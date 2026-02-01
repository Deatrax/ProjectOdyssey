// client/odyssey/services/notificationService.ts
// Group 3: Browser Notifications Service

/**
 * Browser Notification Service
 * Handles permission requests and notification display
 */

export type NotificationType = 'arrival' | 'departure' | 'progress' | 'completion';

export interface NotificationData {
    title: string;
    body: string;
    icon?: string;
    type?: NotificationType;
    itineraryId?: string;
    placeId?: string;
    placeName?: string;
}

class BrowserNotificationService {
    private permissionGranted: boolean = false;

    /**
     * Initialize the service and check current permission status
     */
    constructor() {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            this.permissionGranted = Notification.permission === 'granted';
        }
    }

    /**
     * Check if notifications are supported
     */
    isSupported(): boolean {
        return typeof window !== 'undefined' && 'Notification' in window;
    }

    /**
     * Check current permission status
     */
    getPermissionStatus(): NotificationPermission {
        if (!this.isSupported()) {
            return 'denied';
        }
        return Notification.permission;
    }

    /**
     * Request notification permission from user
     */
    async requestPermission(): Promise<boolean> {
        if (!this.isSupported()) {
            console.warn('Browser does not support notifications');
            return false;
        }

        if (Notification.permission === 'granted') {
            this.permissionGranted = true;
            return true;
        }

        if (Notification.permission === 'denied') {
            console.warn('Notification permission denied');
            return false;
        }

        try {
            const permission = await Notification.requestPermission();
            this.permissionGranted = permission === 'granted';

            if (this.permissionGranted) {
                console.log('✅ Notification permission granted');
                // Send a test notification
                this.send({
                    title: 'Notifications Enabled! 🎉',
                    body: "You'll receive updates about your trip progress",
                    icon: '/logo.png'
                });
            } else {
                console.log('❌ Notification permission denied');
            }

            return this.permissionGranted;
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return false;
        }
    }

    /**
     * Send a notification
     */
    send(data: NotificationData): void {
        if (!this.isSupported()) {
            console.warn('Notifications not supported');
            return;
        }

        if (Notification.permission !== 'granted') {
            console.warn('Notification permission not granted');
            return;
        }

        try {
            const notification = new Notification(data.title, {
                body: data.body,
                icon: data.icon || '/logo.png',
                badge: '/logo.png',
                tag: data.type || 'general',
                requireInteraction: false, // Auto-dismiss after a few seconds
                silent: false,
                vibrate: [200, 100, 200], // Vibration pattern for mobile
                data: {
                    type: data.type,
                    itineraryId: data.itineraryId,
                    placeId: data.placeId,
                    placeName: data.placeName,
                    timestamp: new Date().toISOString()
                }
            } as any);

            // Handle notification click
            notification.onclick = () => {
                window.focus();
                notification.close();

                // Navigate to relevant page if data is provided
                if (data.itineraryId) {
                    window.location.href = `/trip/${data.itineraryId}${data.placeId ? `?place=${data.placeId}` : ''}`;
                }
            };

            // Auto-close after 5 seconds if not interacted with
            setTimeout(() => {
                notification.close();
            }, 5000);

            console.log(`📬 Notification sent: ${data.title}`);
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    }

    /**
     * Send notification with action buttons (for supported browsers)
     */
    sendWithActions(data: NotificationData, actions: { action: string; title: string }[]): void {
        if (!this.isSupported()) {
            console.warn('Notifications not supported');
            return;
        }

        if (Notification.permission !== 'granted') {
            console.warn('Notification permission not granted');
            return;
        }

        try {
            const notification = new Notification(data.title, {
                body: data.body,
                icon: data.icon || '/logo.png',
                badge: '/logo.png',
                tag: data.type || 'general',
                requireInteraction: true, // Keep notification visible
                actions: actions,
                data: {
                    type: data.type,
                    itineraryId: data.itineraryId,
                    placeId: data.placeId,
                    placeName: data.placeName
                }
            } as any);

            console.log(`📬 Interactive notification sent: ${data.title}`);
        } catch (error) {
            console.error('Error sending interactive notification:', error);
            // Fall back to regular notification
            this.send(data);
        }
    }

    /**
     * Clear all notifications from this app
     */
    clearAll(): void {
        // Note: Web Notifications API doesn't have a built-in clearAll
        // This is a placeholder for future implementation
        console.log('Clearing notifications');
    }

    /**
     * Predefined notification templates
     */
    templates = {
        arrival: (placeName: string, itineraryId: string, placeId: string) =>
            this.send({
                title: `Arrived at ${placeName}! 🎉`,
                body: 'Enjoy your visit. We\'ll track your time here.',
                type: 'arrival',
                itineraryId,
                placeId,
                placeName
            }),

        departure: (placeName: string, timeSpent: string, itineraryId: string, placeId: string) =>
            this.send({
                title: `Left ${placeName}`,
                body: `You spent ${timeSpent} here. Hope you enjoyed it!`,
                type: 'departure',
                itineraryId,
                placeId,
                placeName
            }),

        nextPlace: (nextPlaceName: string, distance: string, itineraryId: string, placeId: string) =>
            this.send({
                title: `Next: ${nextPlaceName}`,
                body: `${distance} away. Ready to continue?`,
                type: 'progress',
                itineraryId,
                placeId,
                placeName: nextPlaceName
            }),

        completion: (placesCount: number, itineraryId: string) =>
            this.send({
                title: 'Trip Complete! 🎊',
                body: `Amazing! You visited ${placesCount} places. View your trip summary.`,
                type: 'completion',
                itineraryId
            }),

        milestone: (percentage: number, completedCount: number, totalCount: number, itineraryId: string) =>
            this.send({
                title: `${percentage}% Complete! 🎯`,
                body: `You've visited ${completedCount} of ${totalCount} places. Keep going!`,
                type: 'progress',
                itineraryId
            }),

        reminder: (itineraryId: string) =>
            this.send({
                title: 'Still exploring? 🗺️',
                body: 'We haven\'t seen movement in a while. Let us know if you\'re still on your trip!',
                type: 'progress',
                itineraryId
            }),

        timeWarning: (placeName: string, duration: string, itineraryId: string, placeId: string) =>
            this.send({
                title: 'Time Check ⏱️',
                body: `You've been at ${placeName} for ${duration}. Ready to move to the next stop?`,
                type: 'progress',
                itineraryId,
                placeId,
                placeName
            }),

        offRoute: (itineraryId: string) =>
            this.send({
                title: 'Off Route ⚠️',
                body: 'You seem to be drifting away from your planned route. Need directions?',
                type: 'progress',
                itineraryId
            })
    };
}

// Export singleton instance
const notificationService = new BrowserNotificationService();
export default notificationService;
