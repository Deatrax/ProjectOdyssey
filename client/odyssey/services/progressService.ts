// client/odyssey/services/progressService.ts
// Group 3: Progress API Client

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface ProgressData {
    total_places: number;
    completed_places: number;
    in_progress_places: number;
    pending_places: number;
    skipped_places: number;
    completion_percentage: number;
    total_time_spent: number;
    total_distance: number;
    time_spent_formatted: string;
    distance_formatted: string;
}

export interface TripSummary {
    itinerary: {
        name: string;
        destination: string;
        created_at: string;
        map_routes: any;
    };
    progress: ProgressData;
    visits: Array<{
        place_name: string;
        time_spent: number;
        user_rating: number;
        entered_at: string;
        exited_at: string;
    }>;
    enriched: {
        average_time_per_place: number;
        average_time_formatted: string;
        total_distance_formatted: string;
        total_time_formatted: string;
        trip_duration: number;
        trip_duration_formatted: string;
        favorite_place: {
            name: string;
            rating: number;
            time_spent: string;
        } | null;
        completion_date: string;
    };
}

export interface NotificationPreferences {
    user_id: string;
    arrival_enabled: boolean;
    departure_enabled: boolean;
    progress_enabled: boolean;
    browser_notifications_enabled: boolean;
    created_at: string;
    updated_at: string;
}

class ProgressService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = `${API_BASE_URL}/api/progress`;
    }

    /**
     * Get current progress for an itinerary
     */
    async getProgress(itineraryId: string): Promise<ProgressData> {
        try {
            const response = await fetch(`${this.baseUrl}/${itineraryId}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch progress: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to fetch progress');
            }

            return data.progress;
        } catch (error) {
            console.error('Get progress error:', error);
            throw error;
        }
    }

    /**
     * Get complete trip summary
     */
    async getTripSummary(itineraryId: string): Promise<TripSummary> {
        try {
            const response = await fetch(`${this.baseUrl}/summary/${itineraryId}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch trip summary: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to fetch trip summary');
            }

            return data.summary;
        } catch (error) {
            console.error('Get trip summary error:', error);
            throw error;
        }
    }

    /**
     * Get lightweight stats (for real-time updates)
     */
    async getStats(itineraryId: string): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/stats/${itineraryId}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch stats: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to fetch stats');
            }

            return data.stats;
        } catch (error) {
            console.error('Get stats error:', error);
            throw error;
        }
    }

    /**
     * Send a notification (logs to database and returns display data)
     */
    async sendNotification(
        itineraryId: string,
        userId: string,
        type: string,
        message: string,
        metadata?: any
    ): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/notify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    itineraryId,
                    userId,
                    type,
                    message,
                    metadata
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to send notification: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to send notification');
            }

            return data;
        } catch (error) {
            console.error('Send notification error:', error);
            throw error;
        }
    }

    /**
     * Get user's notification preferences
     */
    async getNotificationPreferences(userId: string): Promise<NotificationPreferences> {
        try {
            const response = await fetch(`${this.baseUrl}/notifications/preferences/${userId}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch preferences: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to fetch preferences');
            }

            return data.preferences;
        } catch (error) {
            console.error('Get notification preferences error:', error);
            throw error;
        }
    }

    /**
     * Update user's notification preferences
     */
    async updateNotificationPreferences(
        userId: string,
        preferences: Partial<NotificationPreferences>
    ): Promise<NotificationPreferences> {
        try {
            const response = await fetch(`${this.baseUrl}/notifications/preferences/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(preferences)
            });

            if (!response.ok) {
                throw new Error(`Failed to update preferences: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to update preferences');
            }

            return data.preferences;
        } catch (error) {
            console.error('Update notification preferences error:', error);
            throw error;
        }
    }

    /**
     * Get notification history
     */
    async getNotificationHistory(
        userId: string,
        limit: number = 20,
        itineraryId?: string
    ): Promise<any[]> {
        try {
            let url = `${this.baseUrl}/notifications/history/${userId}?limit=${limit}`;
            if (itineraryId) {
                url += `&itineraryId=${itineraryId}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch notification history: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to fetch notification history');
            }

            return data.notifications;
        } catch (error) {
            console.error('Get notification history error:', error);
            throw error;
        }
    }
}

// Export singleton instance
const progressService = new ProgressService();
export default progressService;
