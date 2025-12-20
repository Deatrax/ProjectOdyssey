const fetch = require("node-fetch");

async function callGemini(prompt) {
  // TEMP: mock Gemini response
  return {
    message: "Here are some places you might like.",
    cards: [
      {
        placeId: null,
        name: "Saint Martin's Island",
        category: "nature",
        shortDesc: "A small coral island with clear blue water.",
        estCostPerDay: 4000,
      },
    ],
  };
}

module.exports = { callGemini };
