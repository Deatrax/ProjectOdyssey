"use strict";

const supabase = require("../config/supabaseClient");
const User = require("../models/User");

class GamificationService {
    /**
     * Calculate total XP for a user based on their travel history
     * @param {string} userId - User ID
     * @returns {object} { totalXP, level, breakdown }
     */
    static async calculateAndSyncXP(userId) {
        try {
            // 1. Fetch all confirmed itineraries
            const { data: itineraries, error: itineraryError } = await supabase
                .from("itineraries")
                .select("*")
                .eq("user_id", userId)
                .eq("status", "confirmed");

            if (itineraryError) throw itineraryError;

            // 2. Fetch all completed visit logs
            const { data: visitLogs, error: visitError } = await supabase
                .from("visit_logs")
                .select("*")
                .eq("user_id", userId)
                .eq("status", "completed");

            if (visitError) throw visitError;

            let totalXP = 0;
            const breakdown = {
                activities: 0,
                days: 0,
                trips: 0
            };

            // --- Calculation Logic ---

            // A. Activity XP (+20 each)
            const activityXP = visitLogs.length * 20;
            totalXP += activityXP;
            breakdown.activities = activityXP;

            // B. Trip XP (+200 each confirmed trip)
            const tripXP = itineraries.length * 200;
            totalXP += tripXP;
            breakdown.trips = tripXP;

            // C. Day XP (+50 per fully completed day)
            // We need to check each itinerary's schedule and see if all places for a day were visited
            let completedDays = 0;

            itineraries.forEach(itinerary => {
                const schedule = itinerary.selected_itinerary?.schedule;
                if (Array.isArray(schedule)) {
                    schedule.forEach(day => {
                        const dayActivities = day.activities || [];
                        if (dayActivities.length > 0) {
                            // Check if ALL activities for this day were completed
                            // Match by place_id or name
                            const allCompleted = dayActivities.every(activity => {
                                const placeId = activity.place_id;
                                // Check if there is a completed visit log for this place in this trip
                                return visitLogs.some(log =>
                                    log.itinerary_id === itinerary.id &&
                                    log.place_id === placeId
                                );
                            });

                            if (allCompleted) completedDays++;
                        }
                    });
                }
            });

            const dayXP = completedDays * 50;
            totalXP += dayXP;
            breakdown.days = dayXP;

            // Calculate Level (Simple linear progression: 1000 XP per level)
            const level = Math.floor(totalXP / 1000) + 1;

            // 3. Sync to MongoDB User Model
            await User.findByIdAndUpdate(userId, { xp: totalXP, level: level });

            return { totalXP, level, breakdown };
        } catch (err) {
            console.error("GamificationService error:", err);
            throw err;
        }
    }
}

module.exports = GamificationService;
