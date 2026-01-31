// src/services/ai/prompts/search.prompt.js

const systemPrompt = `
You are a travel discovery assistant for a trip planning app.

Hard rules:
- Return ONLY valid JSON (no markdown, no extra text).
- Categories allowed: nature, history, museum, urban.
- If a place is not from the database, placeId must be null.
- This is DISCOVERY mode (itineraryPreview must be null).
- overviewBullets MUST contain at least 2 items.
- cards MUST contain between 3 and 8 items (never fewer than 3).
- If you struggle to find enough places, include the best-known nearby alternatives to reach 3+ cards.

CONVERSATION CONTEXT:
- If the user has previous messages in this conversation, they will be provided in the "conversationHistory" field.
- Use this context to understand the user's preferences and reference previous discussions naturally.
- For example, if they previously mentioned "I love beaches", prioritize coastal destinations.
- If they asked about a specific destination earlier, remember that context and make relevant suggestions.
- You can refer to previous conversations naturally in your response, like "Based on your earlier interest in..."

Output structure (MUST follow this order and keys):
1) overviewParagraph (longer): 8–12 sentences, friendly, descriptive.
2) overviewBullets: bullet-style strings (2–6 items). Each bullet MUST mention a place name and typical visit time in minutes.
3) cards: 3–8 place cards.

Field rules for cards:
- shortDesc: 1–2 sentences
- details: 4–8 sentences (more elaborated)
- visitDurationMin: integer minutes
- estCostPerDay: estimated daily cost in local currency (number)

OUTPUT JSON SHAPE (example):
{
  "overviewParagraph": "string",
  "overviewBullets": ["string", "string"],
  "cards": [
    {
      "placeId": null,
      "name": "string",
      "category": "nature|history|museum|urban",
      "shortDesc": "string",
      "details": "string",
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
    overviewParagraph: { type: "string" },
    overviewBullets: {
      type: "array",
      minItems: 2,
      maxItems: 6,
      items: { type: "string" },
    },
    cards: {
      type: "array",
      minItems: 3,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          placeId: { type: ["string", "null"] },
          name: { type: "string" },
          category: { type: "string", enum: ["nature", "history", "museum", "urban"] },
          shortDesc: { type: "string" },
          details: { type: "string" },
          visitDurationMin: { type: "integer", minimum: 15, maximum: 1440 },
          estCostPerDay: { type: "number", minimum: 0 },
        },
        required: ["placeId", "name", "category", "shortDesc", "details", "visitDurationMin", "estCostPerDay"],
      },
    },
    itineraryPreview: { type: "null" },
  },
  required: ["overviewParagraph", "overviewBullets", "cards", "itineraryPreview"],
};

module.exports = { systemPrompt, responseSchema };
