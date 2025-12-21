const router = require("express").Router();
const { detectIntent } = require("../services/ai/intent");
const { searchPlaces } = require("../repositories/places.repo");
const { callGemini } = require("../services/ai/geminiClient");

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

router.post("/chat", async (req, res) => {
  try {
    const { message, userContext, selectedPlaces } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message is required (string)" });
    }

    const intent = detectIntent(message);

    // 1) DB-first search (mock for now)
    const dbResults = await searchPlaces(message);

    // If DB found matches for search intent, return them
    if (intent === "search_places" && dbResults.length > 0) {
      return res.json({
        message: "Here are some places from our database.",
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
      };

      const itineraryJson = await callGemini({
        system: itinerarySystemPrompt,
        user: payload,
        schema: itineraryResponseSchema,
      });

      return res.json({
        message: itineraryJson.reply ?? "Here is an itinerary preview.",
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
    };

    const searchJson = await callGemini({
      system: searchSystemPrompt,
      user: payload,
      schema: searchResponseSchema,
    });

    return res.json({
      message: searchJson.message ?? "Here are some suggestions.",
      cards: searchJson.cards ?? [],
      itineraryPreview: null,
      source: "ai",
    });
  } catch (err) {
    console.error("AI /chat error:", err);
    return res.status(500).json({ error: err.message || "AI error" });
  }
});

module.exports = router;
