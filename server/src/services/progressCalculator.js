// server/src/services/progressCalculator.js
// Group 3: Progress calculation utilities

/**
 * Format duration from seconds to human-readable string
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration (e.g., "2h 15m" or "45m")
 */
function formatDuration(seconds) {
    if (!seconds || seconds === 0) return '0m';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

/**
 * Format distance from meters to human-readable string
 * @param {number} meters - Distance in meters
 * @returns {string} Formatted distance (e.g., "1.2km" or "450m")
 */
function formatDistance(meters) {
    if (!meters || meters === 0) return '0m';

    if (meters < 1000) {
        return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * Calculate average time per place
 * @param {number} totalTimeSpent - Total time in seconds
 * @param {number} completedPlaces - Number of completed places
 * @returns {number} Average time in seconds
 */
function calculateAverageTime(totalTimeSpent, completedPlaces) {
    if (completedPlaces === 0) return 0;
    return Math.round(totalTimeSpent / completedPlaces);
}

/**
 * Determine if trip is on schedule
 * @param {number} completedPlaces - Number of places completed
 * @param {number} totalPlaces - Total number of places
 * @param {number} hoursElapsed - Hours since trip started
 * @param {number} estimatedTotalHours - Estimated total trip duration
 * @returns {object} Schedule status
 */
function getScheduleStatus(completedPlaces, totalPlaces, hoursElapsed, estimatedTotalHours) {
    const expectedCompletionRate = hoursElapsed / estimatedTotalHours;
    const actualCompletionRate = completedPlaces / totalPlaces;

    const diff = actualCompletionRate - expectedCompletionRate;

    if (diff > 0.1) {
        return { status: 'ahead', message: 'Ahead of schedule! 🚀' };
    } else if (diff < -0.1) {
        return { status: 'behind', message: 'Taking your time! 🐢' };
    } else {
        return { status: 'on_time', message: 'On schedule! ✅' };
    }
}

/**
 * Enrich trip summary with formatted values and calculations
 * @param {object} summary - Raw summary from database
 * @returns {object} Enriched summary
 */
function enrichSummary(summary) {
    if (!summary || !summary.progress) {
        return summary;
    }

    const { progress, visits, itinerary } = summary;

    // Calculate additional metrics
    const averageTime = calculateAverageTime(
        progress.total_time_spent,
        progress.completed_places
    );

    // Find favorite place (highest rated)
    let favoritePlace = null;
    if (visits && visits.length > 0) {
        favoritePlace = visits.reduce((fav, current) => {
            if (!fav || (current.user_rating || 0) > (fav.user_rating || 0)) {
                return current;
            }
            return fav;
        }, null);
    }

    // Calculate total trip duration (first entry to last exit)
    let tripDuration = 0;
    if (visits && visits.length > 0) {
        const sortedVisits = [...visits].sort((a, b) =>
            new Date(a.entered_at) - new Date(b.entered_at)
        );
        const firstEntry = new Date(sortedVisits[0].entered_at);
        const lastExit = new Date(sortedVisits[sortedVisits.length - 1].exited_at || new Date());
        tripDuration = Math.floor((lastExit - firstEntry) / 1000); // seconds
    }

    return {
        ...summary,
        enriched: {
            average_time_per_place: averageTime,
            average_time_formatted: formatDuration(averageTime),
            total_distance_formatted: formatDistance(progress.total_distance),
            total_time_formatted: formatDuration(progress.total_time_spent),
            trip_duration: tripDuration,
            trip_duration_formatted: formatDuration(tripDuration),
            favorite_place: favoritePlace ? {
                name: favoritePlace.place_name,
                rating: favoritePlace.user_rating,
                time_spent: formatDuration(favoritePlace.time_spent)
            } : null,
            completion_date: visits && visits.length > 0
                ? visits[visits.length - 1].exited_at
                : null
        }
    };
}

/**
 * Generate achievement badges based on trip performance
 * @param {object} progress - Progress data
 * @param {array} visits - Visit logs
 * @returns {array} Array of achievement objects
 */
function generateAchievements(progress, visits) {
    const achievements = [];

    // 100% Completion
    if (progress.completion_percentage === 100) {
        achievements.push({
            id: 'perfect_trip',
            name: 'Perfect Trip!',
            description: 'Visited all planned places',
            icon: '🎯',
            rarity: 'gold'
        });
    }

    // Speed Tourist (completed in < 50% of expected time)
    const totalTimeSpent = progress.total_time_spent;
    const expectedTime = visits.reduce((sum, v) => sum + (v.expected_duration || 0), 0);
    if (totalTimeSpent < expectedTime * 0.5 && progress.completed_places > 0) {
        achievements.push({
            id: 'speed_tourist',
            name: 'Speed Tourist',
            description: 'Completed trip in record time',
            icon: '⚡',
            rarity: 'silver'
        });
    }

    // Explorer (visited 10+ places)
    if (progress.completed_places >= 10) {
        achievements.push({
            id: 'explorer',
            name: 'Explorer',
            description: 'Visited 10 or more places',
            icon: '🗺️',
            rarity: 'gold'
        });
    }

    // First Trip
    if (progress.total_places <= 5 && progress.completion_percentage === 100) {
        achievements.push({
            id: 'getting_started',
            name: 'Getting Started',
            description: 'Completed your first trip',
            icon: '🌟',
            rarity: 'bronze'
        });
    }

    // Marathon (15+ hours of travel)
    if (totalTimeSpent >= 54000) { // 15 hours in seconds
        achievements.push({
            id: 'marathon',
            name: 'Marathon Traveler',
            description: 'Spent 15+ hours exploring',
            icon: '🏃',
            rarity: 'gold'
        });
    }

    // Culture Vulture (visited all museums/cultural sites)
    // This would need category data from visits

    return achievements;
}

/**
 * Get next milestone for progress tracking
 * @param {number} completedPlaces - Number of completed places
 * @param {number} totalPlaces - Total places
 * @returns {object} Next milestone info
 */
function getNextMilestone(completedPlaces, totalPlaces) {
    const milestones = [
        { threshold: 0.25, emoji: '📍', message: 'Quarter way there!' },
        { threshold: 0.5, emoji: '🎯', message: 'Halfway done!' },
        { threshold: 0.75, emoji: '🚀', message: 'Almost there!' },
        { threshold: 1.0, emoji: '🎉', message: 'Trip complete!' }
    ];

    const currentProgress = completedPlaces / totalPlaces;

    for (const milestone of milestones) {
        if (currentProgress < milestone.threshold) {
            const placesNeeded = Math.ceil(totalPlaces * milestone.threshold) - completedPlaces;
            return {
                ...milestone,
                places_needed: placesNeeded,
                progress_to_milestone: (currentProgress / milestone.threshold) * 100
            };
        }
    }

    return {
        threshold: 1.0,
        emoji: '🎊',
        message: 'All milestones reached!',
        places_needed: 0,
        progress_to_milestone: 100
    };
}

module.exports = {
    formatDuration,
    formatDistance,
    calculateAverageTime,
    getScheduleStatus,
    enrichSummary,
    generateAchievements,
    getNextMilestone
};
