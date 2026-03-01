const User = require("../models/User");
const VisitLog = require("../models/VisitLog");
const { getTrendingPlaces } = require("./placeService");
const { callGemini } = require("./ai/geminiClient");
const supabase = require("../config/supabaseClient");

class RecommendationService {
    /**
     * Helper to find real image for a place name
     */
    static async findRealImageForPlace(placeName) {
        if (!supabase) return null;
        try {
            // Check cities first
            let { data: cities } = await supabase
                .from('cities')
                .select('id')
                .ilike('name', `%${placeName}%`)
                .limit(1);

            if (cities && cities.length > 0) {
                const { data: images } = await supabase
                    .from('place_images')
                    .select('url')
                    .eq('place_id', cities[0].id)
                    .in('place_type', ['CITY', 'DISTRICT'])
                    .limit(1);
                if (images && images.length > 0) return images[0].url;
            }

            // Check countries
            let { data: countries } = await supabase
                .from('countries')
                .select('id')
                .ilike('name', `%${placeName}%`)
                .limit(1);

            if (countries && countries.length > 0) {
                const { data: images } = await supabase
                    .from('place_images')
                    .select('url')
                    .eq('place_id', countries[0].id)
                    .eq('place_type', 'COUNTRY')
                    .limit(1);
                if (images && images.length > 0) return images[0].url;
            }

            // Check POIs
            let { data: pois } = await supabase
                .from('pois')
                .select('id')
                .ilike('name', `%${placeName}%`)
                .limit(1);

            if (pois && pois.length > 0) {
                const { data: images } = await supabase
                    .from('place_images')
                    .select('url')
                    .eq('place_id', pois[0].id)
                    .eq('place_type', 'POI')
                    .limit(1);
                if (images && images.length > 0) return images[0].url;
            }
        } catch (error) {
            console.error("Error looking up image:", error);
        }
        return null; // fallback
    }

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

            // Try to find a real image from DB
            let realCardImageUrl = await this.findRealImageForPlace(rec.destination_name);
            const fallbackCardImage = `https://images.unsplash.com/featured/?${encodeURIComponent(rec.destination_name)},travel&sig=${idx}`;

            const processedSubPlaces = [];
            for (let sIdx = 0; sIdx < rec.sub_places.length; sIdx++) {
                const sp = rec.sub_places[sIdx];
                let realSubImageUrl = await this.findRealImageForPlace(sp.place_name);
                const fallbackSubImage = `https://images.unsplash.com/featured/?${encodeURIComponent(sp.place_name)},${encodeURIComponent(rec.destination_name)}&sig=${idx}${sIdx}`;

                processedSubPlaces.push({
                    ...sp,
                    image_url: realSubImageUrl || fallbackSubImage
                });
            }

            processedPlaces.push({
                ...rec,
                card_image_url: realCardImageUrl || fallbackCardImage,
                sub_places: processedSubPlaces
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
