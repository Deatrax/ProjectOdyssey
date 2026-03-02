const User = require("../models/User");
const VisitLog = require("../models/VisitLog");
const { getTrendingPlaces } = require("./placeService");
const { callGemini } = require("./ai/geminiClient");
const { fetchUnsplashPhotos } = require("./imageService");

class RecommendationService {
    /**
     * Main entry point for generating recommendations
     */
    static async generateForUser(userId) {
        // 1. Determine current week start (Sunday)
        const weekStart = this.getRecentSunday();
        const weekStartStr = weekStart.toISOString().split("T")[0];

        // 2. Fetch required data
        let user, trending;
        try {
            [user, trending] = await Promise.all([
                User.findById(userId),
                getTrendingPlaces()
            ]);
        } catch (err) {
            console.error("Error fetching data for recommendations:", err);
            throw new Error("Failed to gather travel data for recommendations.");
        }

        if (!user) throw new Error("User not found");

        // 3. Prepare Prompt Data
        const trendingNames = (trending || []).map(p => p.name);
        const preferences = {
            travelStyle: user.travelStyle,
            budget: user.preferences?.budgetRange,
            accommodation: user.preferences?.accommodation
        };

        const visits = await VisitLog.getUserVisits(userId, { limit: 50 });
        const completedDestinations = [...new Set(visits.map(v => v.place_name))];

        // 4. Build Prompt
        const systemPrompt = `You are a travel recommendation AI for a platform called Odyssey.
Generate 4 recommended main destinations based on the provided user data.

Requirements:
- Avoid destinations already completed unless suggesting a new region within it.
- Prioritize trending places but personalize heavily using preferences.
- Each destination must match budget and travel style.
- Include image description prompts suitable for generating travel images.

Return output strictly in JSON format:
{
  "recommended_places": [
    {
      "destination_name": "Name",
      "short_caption": "2-3 sentences",
      "card_image_prompt": "Realistic photography style description",
      "sub_places": [
        {
          "place_name": "Name",
          "description": "2-3 sentences",
          "image_prompt": "Realistic photography style description"
        }
      ]
    }
  ]
}

Rules:
- Exactly 4 main destinations.
- Each must contain 3-5 sub_places.
- Descriptions must be 2-3 sentences.
- Image prompts must be descriptive for high-quality photography.`;

        const userContext = {
            trending_searches: trendingNames,
            user_preferences: preferences,
            completed_trips: completedDestinations
        };

        // 5. Call Gemini
        const result = await callGemini({
            system: systemPrompt,
            user: userContext
        });

        if (!result || !result.recommended_places) {
            throw new Error("Invalid response from Gemini");
        }

        // 6. Post-process (Add Image URLs)
        const processedPlaces = [];
        for (let idx = 0; idx < result.recommended_places.length; idx++) {
            const rec = result.recommended_places[idx];

            // Fetch main destination image
            const mainPhotos = await fetchUnsplashPhotos(`${rec.destination_name} travel landscape`, 1);
            const card_image_url = mainPhotos.length > 0
                ? mainPhotos[0]
                : `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop&sig=${idx}`;

            // Process sub-places
            const sub_places = [];
            for (let sIdx = 0; sIdx < rec.sub_places.length; sIdx++) {
                const sp = rec.sub_places[sIdx];
                const subPhotos = await fetchUnsplashPhotos(`${sp.place_name} ${rec.destination_name}`, 1);
                sub_places.push({
                    ...sp,
                    image_url: subPhotos.length > 0
                        ? subPhotos[0]
                        : `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop&sig=${idx}${sIdx}`
                });
            }

            processedPlaces.push({
                ...rec,
                card_image_url,
                sub_places
            });
        }

        // 7. Save to User document (MongoDB)
        user.weeklyRecommendations = processedPlaces;
        user.lastRecommendationWeek = weekStartStr;
        await user.save();

        return processedPlaces;
    }

    /**
     * Get the most recent Sunday at midnight
     */
    static getRecentSunday() {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        const day = d.getDay(); // 0 is Sunday
        const diff = d.getDate() - day;
        d.setDate(diff);
        return d;
    }

    /**
     * Get current week's recommendations for a user
     */
    static async getForUser(userId) {
        const weekStart = this.getRecentSunday();
        const weekStartStr = weekStart.toISOString().split("T")[0];

        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        // If no data for current week, generate it
        if (!user.weeklyRecommendations ||
            user.weeklyRecommendations.length === 0 ||
            user.lastRecommendationWeek !== weekStartStr) {
            return await this.generateForUser(userId);
        }

        return user.weeklyRecommendations;
    }
}

module.exports = RecommendationService;
