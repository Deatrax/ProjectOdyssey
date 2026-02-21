// src/routes/clustering.routes.js

const router = require("express").Router();
const { callGemini } = require("../services/ai/geminiClient");
const { makeValidator } = require("../services/ai/validate");
const { systemPrompt: clusteringSystemPrompt, responseSchema: clusteringResponseSchema } = require("../services/ai/prompts/clustering.prompt");
const authMiddleware = require("../middleware/authMiddleware");

const validateClustering = makeValidator(clusteringResponseSchema);

/**
 * POST /api/clustering/analyze
 * 
 * User Input: Trip description + preferences
 * AI Output: Geographic clusters with place recommendations
 * 
 * Request body:
 * {
 *   message: "3-day trip to Bangladesh, I like history and nature",
 *   userContext: { budget: "medium", pace: "relaxed", interests: ["history", "nature"] }
 * }
 * 
 * Response:
 * {
 *   overallReasoning: "...",
 *   recommendedDuration: 3,
 *   clusters: [
 *     { clusterName, description, suggestedDays, places: [{name, category, reasoning, estimatedVisitHours, estimatedCost}] }
 *   ]
 * }
 */
router.post("/analyze", authMiddleware, async (req, res) => {
  try {
    const { message, userContext } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message is required (string)" });
    }

    // Prepare payload for AI
    const payload = {
      message,
      userContext: userContext ?? null,
    };

    // Call Gemini with clustering prompt
    const clusteringJson = await callGemini({
      system: clusteringSystemPrompt,
      user: payload,
    });

    // Validate AI output server-side
    const validation = validateClustering(clusteringJson);
    if (!validation.ok) {
      console.error("Invalid clustering JSON from AI:", validation.errors);
      return res.status(502).json({
        error: "AI response was invalid. Please try again.",
        validationErrors: validation.errors,
      });
    }

    // Success: return clustered recommendations
    return res.json({
      success: true,
      data: clusteringJson,
    });

  } catch (err) {
    console.error("Clustering /analyze error:", err);
    return res.status(500).json({ error: err.message || "Clustering error" });
  }
});

module.exports = router;
