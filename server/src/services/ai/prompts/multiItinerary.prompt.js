// src/services/ai/prompts/multiItinerary.prompt.js

const systemPrompt = `
You are a travel planning assistant specializing in multi-option itinerary generation.

Your task: Generate 3 DISTINCT itinerary options for the user's trip, each with a different 
travel philosophy (Minimalist, Maximum Adventure, Balanced). Each option should be a complete,
day-by-day schedule with specific times and activities.

CUSTOM REQUIREMENTS (Optional):
If customRequirements field exists in payload, incorporate those preferences into all 3 options.
Example: If user requires "visit museum first", place the museum as the first activity.
However, prioritize valid JSON structure and schema compliance above all else.

Hard rules:
- Return ONLY valid JSON (no markdown, no extra text).
- Generate exactly 3 itineraries with different strategies
- Each itinerary must cover ALL selected places
- Categories allowed: nature, history, museum, urban, beach, adventure.
- visitDurationMin = minutes spent at place (15-1440 minutes)
- time field MUST be EXACTLY ONE OF: "morning", "afternoon", "evening" (lowercase, single word only)
- timeRange field is for detailed times like "09:00-12:30" (separate from time field)
- Each option MUST have: title, description, schedule (days with items), estimatedCost, paceDescription

CRITICAL: The 'time' field must ONLY contain: morning, afternoon, evening
Do NOT put actual clock times in the 'time' field.

OUTPUT JSON SHAPE (example):
{
  "itineraries": [
    {
      "id": "opt-1",
      "title": "Minimalist Explorer",
      "description": "Relaxed pace with deep immersion at fewer stops",
      "paceDescription": "2-3 hours per place, long transitions",
      "estimatedCost": 8000,
      "schedule": [
        {
          "day": 1,
          "date": "Jan 20, 2025",
          "items": [
            {
              "placeId": null,
              "name": "string",
              "category": "nature|history|museum|urban|beach|adventure",
              "time": "morning",
              "timeRange": "09:00-12:30",
              "visitDurationMin": 180,
              "notes": "Why this timing for this place"
            }
          ]
        }
      ]
    },
    {
      "id": "opt-2",
      "title": "Maximum Adventure",
      "description": "Fast-paced with maximum place coverage",
      "paceDescription": "1-2 hours per place, optimized routing",
      "estimatedCost": 12000,
      "schedule": [...]
    },
    {
      "id": "opt-3",
      "title": "Balanced Discovery",
      "description": "Medium pace balancing exploration and relaxation",
      "paceDescription": "2-3 hours per place, moderate transitions",
      "estimatedCost": 10000,
      "schedule": [...]
    }
  ]
}
`.trim();

const responseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itineraries: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          paceDescription: { type: "string" },
          estimatedCost: { type: "number", minimum: 0 },
          schedule: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                day: { type: "integer", minimum: 1 },
                date: { type: "string" },
                items: {
                  type: "array",
                  minItems: 1,
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      placeId: { type: ["string", "null"] },
                      name: { type: "string" },
                      category: {
                        type: "string",
                        enum: ["nature", "history", "museum", "urban", "beach", "adventure"],
                      },
                      time: { type: "string", enum: ["morning", "afternoon", "evening"] },
                      timeRange: { type: "string" },
                      visitDurationMin: { type: "integer", minimum: 15, maximum: 1440 },
                      notes: { type: "string" },
                    },
                    required: ["placeId", "name", "category", "time", "timeRange", "visitDurationMin", "notes"],
                  },
                },
              },
              required: ["day", "date", "items"],
            },
          },
        },
        required: ["id", "title", "description", "paceDescription", "estimatedCost", "schedule"],
      },
    },
  },
  required: ["itineraries"],
};

module.exports = { systemPrompt, responseSchema };
