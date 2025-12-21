// src/services/ai/prompts/itinerary.prompt.js

const systemPrompt = `
You are a travel planning assistant for a trip planning application.

Rules:
- Return ONLY valid JSON (no markdown, no extra text).
- Categories allowed: nature, history & museum, urban.
- visitDurationMin = typical minutes spent at the place (integer minutes).
- If not from the database, placeId must be null.
- Use time slots: morning, afternoon, evening.

OUTPUT JSON SHAPE (example):
{
  "reply": "string",
  "itineraryPreview": {
    "days": [
      {
        "day": 1,
        "items": [
          {
            "placeId": null,
            "name": "string",
            "category": "nature|history & museum|urban",
            "visitDurationMin": 90,
            "time": "morning|afternoon|evening"
          }
        ]
      }
    ],
    "estimatedTotalCost": 0
  }
}
`.trim();

// KEEP THIS for AJV validation (do NOT send to Gemini in Option A)
const responseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reply: { type: "string" },
    itineraryPreview: {
      type: "object",
      additionalProperties: false,
      properties: {
        days: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              day: { type: "integer", minimum: 1 },
              items: {
                type: "array",
                minItems: 1,
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    placeId: { type: ["string", "null"] },
                    name: { type: "string" },
                    category: { type: "string", enum: ["nature", "history & museum", "urban"] },
                    visitDurationMin: { type: "integer", minimum: 15, maximum: 1440 },
                    time: { type: "string", enum: ["morning", "afternoon", "evening"] }
                  },
                  required: ["placeId", "name", "category", "visitDurationMin", "time"]
                }
              }
            },
            required: ["day", "items"]
          }
        },
        estimatedTotalCost: { type: "number", minimum: 0 }
      },
      required: ["days", "estimatedTotalCost"]
    }
  },
  required: ["reply", "itineraryPreview"]
};

module.exports = { systemPrompt, responseSchema };
