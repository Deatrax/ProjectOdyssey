const router = require("express").Router();
const { detectIntent } = require("../services/ai/intent");
const { searchPlaces } = require("../repositories/places.repo");
const { callGemini } = require("../services/ai/geminiClient");
const { makeValidator } = require("../services/ai/validate");
const authMiddleware = require("../middleware/authMiddleware");
const ChatHistory = require("../models/ChatHistory");
const googleMapsService = require("../services/googleMapsService");
const { supabase } = require("../config/supabaseClient");

// itinerary prompt
const {
  systemPrompt: itinerarySystemPrompt,
  responseSchema: itineraryResponseSchema,
} = require("../services/ai/prompts/itinerary.prompt");

// search prompt
const {
  systemPrompt: searchSystemPrompt,
  responseSchema: searchResponseSchema,
} = require("../services/ai/prompts/search.prompt");

// multi-itinerary prompt (Stage 2)
const {
  systemPrompt: multiItinerarySystemPrompt,
  responseSchema: multiItineraryResponseSchema,
} = require("../services/ai/prompts/multiItinerary.prompt");

const validateItinerary = makeValidator(itineraryResponseSchema);
const validateSearch = makeValidator(searchResponseSchema);
const validateMultiItinerary = makeValidator(multiItineraryResponseSchema);

router.post("/chat", async (req, res) => {
  try {
    const { message, userContext, selectedPlaces, conversationHistory: clientHistory } = req.body;

    // Try to get userId from auth, but make it optional
    let userId = null;
    let conversationHistory = [];

    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const jwt = require("jsonwebtoken");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;

        // Get conversation context from database if authenticated
        conversationHistory = await ChatHistory.getConversationContext(userId, 10);
      } catch (err) {
        console.log("Auth optional - continuing without user context");
      }
    }

    // If no database history but client sent session history (logged-out users), use that
    if (conversationHistory.length === 0 && clientHistory && Array.isArray(clientHistory)) {
      conversationHistory = clientHistory;
    }

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message is required (string)" });
    }

    // Save user message to history (only if authenticated)
    if (userId) {
      await ChatHistory.saveMessage(userId, message, "user", null, {});
    }

    const intent = detectIntent(message);

    // 1) DB-first search (mock for now)
    const dbResults = await searchPlaces(message);

    // If DB found matches for search intent, return them
    if (intent === "search_places" && dbResults.length > 0) {
      const aiResponse = "Here are some places from our database.";

      // Save AI response to history (only if authenticated)
      if (userId) {
        await ChatHistory.saveMessage(userId, aiResponse, "ai", null, { cards: dbResults });
      }

      return res.json({
        message: aiResponse,
        cards: dbResults,
        itineraryPreview: null,
        source: "db",
      });
    }

    // 2) AI: itinerary
    if (intent === "generate_itinerary") {
      const payload = {
        message,
        userContext: userContext ?? null,
        selectedPlaces: selectedPlaces ?? [],
        dbResults: dbResults ?? [],
        conversationHistory, // Add conversation context
      };

      // ✅ Option A: do NOT pass schema to Gemini
      const itineraryJson = await callGemini({
        system: itinerarySystemPrompt,
        user: payload,
      });

      //  Validate AI output server-side
      const v = validateItinerary(itineraryJson);
      if (!v.ok) {
        console.error("Invalid itinerary JSON from AI:", v.errors);
        return res.status(502).json({
          message: "AI response was invalid. Please try again.",
          cards: [],
          itineraryPreview: null,
          source: "ai",
        });
      }

      const aiMessage = itineraryJson.reply ?? "Here is an itinerary preview.";

      // Save AI response to history (only if authenticated)
      if (userId) {
        await ChatHistory.saveMessage(userId, aiMessage, "ai", null, {
          itineraryPreview: itineraryJson.itineraryPreview,
          cards: itineraryJson.cards
        });
      }

      return res.json({
        message: aiMessage,
        itineraryPreview: itineraryJson.itineraryPreview ?? null,
        cards: itineraryJson.cards ?? [],
        source: "ai",
      });
    }

    // 3) AI: search/discovery
    const payload = {
      message,
      userContext: userContext ?? null,
      dbResults: dbResults ?? [],
      conversationHistory, // Add conversation context
    };

    async function getValidSearchJson(payload) {
      // 1st attempt
      const first = await callGemini({
        system: searchSystemPrompt,
        user: payload,
      });

      let v = validateSearch(first);
      if (v.ok) return first;

      console.error("Invalid search JSON from AI (attempt 1):", v.errors);

      // 2nd attempt (retry with strict instruction)
      const retryPayload = {
        ...payload,
        __validationError:
          "Your previous JSON failed validation. You MUST output at least 2 overviewBullets and 3 to 8 cards. Return ONLY valid JSON matching the required shape.",
      };

      const second = await callGemini({
        system: searchSystemPrompt,
        user: retryPayload,
      });

      v = validateSearch(second);
      if (v.ok) return second;

      console.error("Invalid search JSON from AI (attempt 2):", v.errors);
      return null;
    }

    const searchJson = await getValidSearchJson(payload);

    if (!searchJson) {
      return res.status(502).json({
        message: "AI response was invalid. Please try again.",
        bullets: [],
        cards: [],
        itineraryPreview: null,
        source: "ai",
      });
    }

    const aiMessage = searchJson.overviewParagraph ?? "Here are some suggestions.";

    // Save AI response to history (only if authenticated)
    if (userId) {
      await ChatHistory.saveMessage(userId, aiMessage, "ai", null, {
        bullets: searchJson.overviewBullets,
        cards: searchJson.cards
      });
    }

    //IMPORTANT: map the new fields from your updated search.prompt.js
    return res.json({
      message: aiMessage,
      bullets: searchJson.overviewBullets ?? [],
      cards: searchJson.cards ?? [],
      itineraryPreview: null,
      source: "ai",
    });

  } catch (err) {
    console.error("AI /chat error:", err);
    return res.status(500).json({ error: err.message || "AI error" });
  }
});

/**
 * POST /api/ai/generateItineraries
 * 
 * Stage 2: Generate 3 distinct itinerary options from selected places
 * 
 * Request body:
 * {
 *   selectedPlaces: [{ name, category, ... }],
 *   tripDuration: 3,
 *   userContext: { budget, pace, interests }
 * }
 * 
 * Response: 3 complete itineraries (Minimalist, Maximum, Balanced)
 */
router.post("/generateItineraries", async (req, res) => {
  try {
    const { selectedPlaces, tripDuration, userContext, customRequirements } = req.body;

    if (!selectedPlaces || !Array.isArray(selectedPlaces) || selectedPlaces.length === 0) {
      return res.status(400).json({ error: "selectedPlaces is required (non-empty array)" });
    }

    if (!tripDuration || tripDuration < 1) {
      return res.status(400).json({ error: "tripDuration is required (integer >= 1)" });
    }

    // Prepare payload for AI
    const payload = {
      selectedPlaces,
      tripDuration,
      userContext: userContext ?? null,
    };

    // Add custom requirements if provided
    if (customRequirements && customRequirements.trim()) {
      payload.customRequirements = customRequirements;
    }

    async function getValidMultiItineraryJson(payload, attempt = 1) {
      // Call Gemini with multi-itinerary prompt
      const multiItineraryJson = await callGemini({
        system: multiItinerarySystemPrompt,
        user: payload,
      });

      // Validate AI output server-side
      const validation = validateMultiItinerary(multiItineraryJson);
      if (validation.ok) return multiItineraryJson;

      console.error(`Invalid multi-itinerary JSON from AI (attempt ${attempt}):`, validation.errors);

      // If first attempt failed, retry with strict instructions
      if (attempt === 1) {
        const retryPayload = {
          ...payload,
          __validationError:
            "Your previous JSON failed validation. IMPORTANT: The 'time' field MUST be EXACTLY one of: 'morning', 'afternoon', or 'evening' (lowercase, no times). Return ONLY valid JSON matching the required shape with exactly 3 itineraries.",
        };

        const second = await callGemini({
          system: multiItinerarySystemPrompt,
          user: retryPayload,
        });

        const validationRetry = validateMultiItinerary(second);
        if (validationRetry.ok) return second;

        console.error(`Invalid multi-itinerary JSON from AI (attempt 2):`, validationRetry.errors);
        return null;
      }

      return null;
    }

    const multiItineraryJson = await getValidMultiItineraryJson(payload);

    if (!multiItineraryJson) {
      return res.status(502).json({
        error: "AI response was invalid after 2 attempts. Please try again.",
      });
    }

    // -------------------------------------------------------------------------
    // ENRICHMENT STEP: Resolve place locations (Collections -> Cache -> API)
    // -------------------------------------------------------------------------
    async function enrichItineraryWithLocations(itineraries, sourcePlaces) {
      // 1. Build a lookup map from source places (Collections) - FREE
      const sourceLookup = new Map();
      if (Array.isArray(sourcePlaces)) {
        sourcePlaces.forEach(p => {
          if (p.name) sourceLookup.set(p.name.toLowerCase().trim(), p);
        });
      }

      // 2. Collect all items needing resolution
      const itemsToResolve = [];
      const placeNamesToResolve = new Set();

      for (const itinerary of itineraries) {
        if (!itinerary.schedule) continue;
        for (const day of itinerary.schedule) {
          if (!day.items) continue;
          for (const item of day.items) {
            const nameKey = (item.place || item.name || "").toLowerCase().trim();
            if (!nameKey) continue;

            const sourceMatch = sourceLookup.get(nameKey);
            if (sourceMatch && sourceMatch.placeId) {
              // Exact match from collections - copy details
              item.placeId = sourceMatch.placeId;
              item.lat = sourceMatch.lat || sourceMatch.coordinates?.latitude;
              item.lng = sourceMatch.lng || sourceMatch.coordinates?.longitude;
            } else {
              // Needs resolution
              itemsToResolve.push(item);
              placeNamesToResolve.add(nameKey);
            }
          }
        }
      }

      // 3. Batch resolve unique missing names
      const uniqueNames = Array.from(placeNamesToResolve);
      console.log(`AI Itinerary: ${uniqueNames.length} places to resolve not in collections.`);

      if (uniqueNames.length === 0) return itineraries;

      // Rate limit concurrent API calls
      const RESOLUTION_LIMIT = 10; // Max items to geocode per request to save quota
      const namesToProcess = uniqueNames.slice(0, RESOLUTION_LIMIT);

      const resolvedMap = new Map();

      await Promise.all(namesToProcess.map(async (name) => {
        try {
          // Check DB Cache first - FREE
          // (Assuming googleMapsService.searchPlaces handles caching, but geocode might not?
          // Let's use searchPlaces or geocode. Geocode is cheaper/simpler if we just need coords)

          // Try exact name geocoding
          const result = await googleMapsService.geocode(name);
          if (result) {
            resolvedMap.set(name, result);
          }
        } catch (e) {
          console.error(`Failed to resolve place '${name}':`, e.message);
        }
      }));

      // 4. Apply resolved data back to items
      for (const item of itemsToResolve) {
        const nameKey = (item.place || item.name || "").toLowerCase().trim();
        const resolved = resolvedMap.get(nameKey);
        if (resolved) {
          item.placeId = resolved.placeId;
          item.lat = resolved.coordinates.lat;
          item.lng = resolved.coordinates.lng;
          // item.address = resolved.formattedAddress; // Optional
        }
      }

      return itineraries;
    }

    const startEnrich = Date.now();
    const enrichedItineraries = await enrichItineraryWithLocations(
      multiItineraryJson.itineraries,
      selectedPlaces
    );
    console.log(`Enrichment complete in ${Date.now() - startEnrich}ms`);

    // Success: return 3 enriched itinerary options
    return res.json({
      success: true,
      data: { itineraries: enrichedItineraries },
    });

  } catch (err) {
    console.error("AI /generateItineraries error:", err);
    return res.status(500).json({ error: err.message || "Itinerary generation error" });
  }
});

console.log("callGemini args keys:", Object.keys(arguments[0] || {}));

module.exports = router;
