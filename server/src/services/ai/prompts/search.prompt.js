// src/services/ai/prompts/search.prompt.js

const systemPrompt = `
You are a travel discovery assistant for a trip planning app.

Rules:
- Return ONLY valid JSON (no markdown, no extra text).
- Categories allowed: nature, history, museum, urban.
- If a place is not from the database, placeId must be null.
- shortDesc must be short (1–2 sentences).
- visitDurationMin is typical minutes a user spends there (integer).
- estCostPerDay is an estimated cost per day in local currency (number).
- Return 3 to 8 cards.

OUTPUT JSON SHAPE (example):
{
  "message": "string",
  "cards": [
    {
      "placeId": null,
      "name": "string",
      "category": "nature|history|museum|urban",
      "shortDesc": "string",
      "visitDurationMin": 60,
      "estCostPerDay": 0
    }
  ],
  "itineraryPreview": null
}
`.trim();

// KEPT for AJV validation (do NOT send to Gemini)
const responseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    message: { type: "string" },
    cards: {
      type: "array",
      minItems: 0,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          placeId: { type: ["string", "null"] },
          name: { type: "string" },
          category: { type: "string", enum: ["nature", "history", "museum", "urban"] },
          shortDesc: { type: "string" },
          visitDurationMin: { type: "integer", minimum: 15, maximum: 1440 },
          estCostPerDay: { type: "number", minimum: 0 },
        },
        required: ["placeId", "name", "category", "shortDesc", "visitDurationMin", "estCostPerDay"],
      },
    },
    itineraryPreview: { type: ["object", "null"] }, // recommended for search branch
  },
  required: ["message", "cards", "itineraryPreview"],
};

module.exports = { systemPrompt, responseSchema };
