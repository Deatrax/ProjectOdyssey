// client/odyssey/components/NotificationBanner.tsx
// Group 3: Notification Banner Component

'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import notificationService, { NotificationData } from '../services/notificationService';

interface NotificationBannerProps {
    userId?: string;
    onPermissionChange?: (granted: boolean) => void;
}

export default function NotificationBanner({
    userId,
    onPermissionChange
}: NotificationBannerProps) {
    const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
    const [showBanner, setShowBanner] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);

    useEffect(() => {
        const status = notificationService.getPermissionStatus();
        setPermissionStatus(status);

        // Show banner if permission is not granted
        if (status === 'default') {
            const timer = setTimeout(() => setShowBanner(true), 2000); // Show after 2 seconds
            return () => clearTimeout(timer);
        }
    }, []);

    const handleRequestPermission = async () => {
        setIsRequesting(true);
        const granted = await notificationService.requestPermission();
        setPermissionStatus(notificationService.getPermissionStatus());
        setIsRequesting(false);
        setShowBanner(false);

        if (onPermissionChange) {
            onPermissionChange(granted);
        }
    };

    const handleDismiss = () => {
        setShowBanner(false);
    };

    if (!showBanner || permissionStatus === 'granted') {
        return null;
    }

    if (permissionStatus === 'denied') {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md"
                >
                    <div className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-200 p-4 rounded-lg shadow-lg">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">⚠️</span>
                            <div className="flex-1">
                                <p className="font-semibold">Notifications Blocked</p>
                                <p className="text-sm mt-1">
                                    To receive trip updates, please enable notifications in your browser settings.
                                </p>
                            </div>
                            <button
                                onClick={handleDismiss}
                                className="text-yellow-700 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md"
            >
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-2xl">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">🔔</span>
                        <div className="flex-1">
                            <p className="font-semibold">Stay Updated on Your Trip!</p>
                            <p className="text-sm mt-1 opacity-90">
                                Enable notifications to get real-time updates about your progress and arrivals.
                            </p>
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={handleRequestPermission}
                                    disabled={isRequesting}
                                    className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition-colors disabled:opacity-50"
                                >
                                    {isRequesting ? 'Requesting...' : 'Enable Notifications'}
                                </button>
                                <button
                                    onClick={handleDismiss}
                                    className="px-4 py-2 bg-transparent border border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
                                >
                                    Maybe Later
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={handleDismiss}
                            className="text-white hover:text-gray-200"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

/**
 * In-app notification toast component
 */
export function NotificationToast({
    notification,
    onClose
}: {
    notification: NotificationData & { id: string };
    onClose: (id: string) => void;
}) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(notification.id);
        }, 5000);

        return () => clearTimeout(timer);
    }, [notification.id, onClose]);

    const getIcon = () => {
        switch (notification.type) {
            case 'arrival':
                return '🎉';
            case 'departure':
                return '👋';
            case 'progress':
                return '📊';
            case 'completion':
                return '🎊';
            default:
                return '🔔';
        }
    };

    const getBgColor = () => {
        switch (notification.type) {
            case 'arrival':
                return 'from-green-500 to-emerald-600';
            case 'departure':
                return 'from-blue-500 to-indigo-600';
            case 'progress':
                return 'from-yellow-500 to-orange-600';
            case 'completion':
                return 'from-purple-500 to-pink-600';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="mb-2"
        >
            <div className={`bg-gradient-to-r ${getBgColor()} text-white p-4 rounded-lg shadow-lg max-w-sm`}>
                <div className="flex items-start gap-3">
                    <span className="text-2xl">{getIcon()}</span>
                    <div className="flex-1">
                        <p className="font-semibold">{notification.title}</p>
                        {notification.body && (
                            <p className="text-sm mt-1 opacity-90">{notification.body}</p>
                        )}
                    </div>
                    <button
                        onClick={() => onClose(notification.id)}
                        className="text-white hover:text-gray-200"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

/**
 * Notification container for managing multiple toasts
 */
export function NotificationContainer() {
    const [notifications, setNotifications] = useState<Array<NotificationData & { id: string }>>([]);

    const addNotification = (notification: NotificationData) => {
        const id = Date.now().toString();
        setNotifications(prev => [...prev, { ...notification, id }]);
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    // Expose function to add notifications globally
    useEffect(() => {
        (window as any).showNotification = addNotification;
        return () => {
            delete (window as any).showNotification;
        };
    }, []);

    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
            <AnimatePresence>
                {notifications.map(notification => (
                    <NotificationToast
                        key={notification.id}
                        notification={notification}
                        onClose={removeNotification}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
