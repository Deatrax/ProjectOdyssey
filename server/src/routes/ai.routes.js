const router = require("express").Router();
const { detectIntent } = require("../services/ai/intent");
const { searchPlaces } = require("../repositories/places.repo");
const { callGemini } = require("../services/ai/geminiClient");

router.post("/chat", async (req, res) => {
  const { message } = req.body;

  const intent = detectIntent(message);

  // 1️⃣ DB-first search (mocked)
  const dbResults = await searchPlaces(message);

  // 2️⃣ Decision
  if (dbResults.length >= 3 || dbResults.length > 0) {
    return res.json({
      message: "Here are some places from our database.",
      cards: dbResults,
      itineraryPreview: null,
      source: "db",
    });
  }

  // 3️⃣ AI fallback
  const aiResponse = await callGemini(message);

  return res.json({
    message: aiResponse.message,
    cards: aiResponse.cards,
    itineraryPreview: null,
    source: "ai",
  });
});

module.exports = router;
