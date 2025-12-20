console.log("ai.routes loaded");

// src/routes/ai.routes.js
const express = require("express");
const router = express.Router();

router.post("/chat", async (req, res) => {
  const { message, tripDraftId } = req.body;

  // Step 1: just return a mock response in the FINAL format
  return res.json({
    message: `Mock AI reply for: "${message}"`,
    cards: [
      {
        placeId: "mock_001",
        name: "Cox's Bazar",
        category: "nature",
        shortDesc: "Long sandy sea beach with nearby attractions.",
        estCostPerDay: 3500,
        actions: ["add_to_collection", "open_details"],
      },
      {
        placeId: "mock_002",
        name: "Kuakata",
        category: "nature",
        shortDesc: "Beach known for sunrise and sunset views.",
        estCostPerDay: 3000,
        actions: ["add_to_collection", "open_details"],
      },
    ],
    itineraryPreview: null,
    meta: { tripDraftId: tripDraftId ?? null },
  });
});

module.exports = router;
