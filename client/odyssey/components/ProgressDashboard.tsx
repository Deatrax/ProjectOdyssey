// client/odyssey/components/ProgressDashboard.tsx
// Group 3: Progress Dashboard Component

'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProgressBar, { LinearProgressBar } from './ProgressBar';
import TripSummary from './TripSummary';
import progressService, { ProgressData, TripSummary as TripSummaryType } from '../services/progressService';
import notificationService from '../services/notificationService';

interface ProgressDashboardProps {
    itineraryId: string;
    userId?: string;
    compact?: boolean;
    showSummary?: boolean;
}

export default function ProgressDashboard({
    itineraryId,
    userId,
    compact = false,
    showSummary = false
}: ProgressDashboardProps) {
    const [progress, setProgress] = useState<ProgressData | null>(null);
    const [summary, setSummary] = useState<TripSummaryType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchProgress = async () => {
        try {
            setRefreshing(true);
            const data = await progressService.getProgress(itineraryId);
            setProgress(data);
            setError(null);

            // If trip is complete, fetch summary
            if (data.completion_percentage === 100 && showSummary) {
                const summaryData = await progressService.getTripSummary(itineraryId);
                setSummary(summaryData);
            }
        } catch (err) {
            console.error('Failed to fetch progress:', err);
            setError('Failed to load progress data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const prevCompletionRef = React.useRef<number>(0);

    useEffect(() => {
        fetchProgress();

        // Refresh every 30 seconds
        const interval = setInterval(fetchProgress, 30000);

        return () => clearInterval(interval);
    }, [itineraryId]);

    // Monitor for completion trigger
    useEffect(() => {
        if (!progress) return;

        // Check if we just hit 100% (previous was < 100)
        if (progress.completion_percentage === 100 && prevCompletionRef.current < 100) {
            notificationService.templates.completion(progress.completed_places, itineraryId);
        }

        // Update ref for next render
        prevCompletionRef.current = progress.completion_percentage;
    }, [progress, itineraryId]);

    const handleShare = () => {
        if (navigator.share && summary) {
            navigator.share({
                title: `My Trip: ${summary.itinerary.name}`,
                text: `I just completed my trip to ${summary.itinerary.destination}! ${summary.progress.completed_places} places visited, ${summary.enriched.total_distance_formatted} traveled. 🎉`,
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback: Copy link
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const handleExport = async () => {
        // This would integrate with html2canvas or similar library
        alert('Export feature coming soon! For now, you can screenshot this page.');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading progress...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
                    <p className="font-semibold">Error</p>
                    <p className="text-sm">{error}</p>
                    <button
                        onClick={fetchProgress}
                        className="mt-2 text-sm underline hover:no-underline"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    if (!progress) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-gray-600 dark:text-gray-400">No progress data available</p>
            </div>
        );
    }

    // Show full trip summary if complete
    if (progress.completion_percentage === 100 && summary && showSummary) {
        return (
            <TripSummary
                summary={summary}
                showConfetti={true}
                onShare={handleShare}
                onExport={handleExport}
            />
        );
    }

    // Compact view (for sidebars, etc.)
    if (compact) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Trip Progress
                    </h3>
                    <button
                        onClick={fetchProgress}
                        disabled={refreshing}
                        className="text-blue-500 hover:text-blue-600 disabled:opacity-50"
                        title="Refresh"
                    >
                        <svg
                            className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                    </button>
                </div>

                <LinearProgressBar
                    completed={progress.completed_places}
                    total={progress.total_places}
                    showLabel={false}
                />

                <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                    <div>
                        <p className="text-gray-500 dark:text-gray-400">Completed</p>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                            {progress.completed_places}/{progress.total_places}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400">Time Spent</p>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                            {progress.time_spent_formatted}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Full dashboard view
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                    Trip Progress
                </h2>
                <button
                    onClick={fetchProgress}
                    disabled={refreshing}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {/* Main Progress Circle */}
            <div className="flex justify-center">
                <ProgressBar
                    completed={progress.completed_places}
                    total={progress.total_places}
                    size="lg"
                    showLabel={true}
                    showFraction={true}
                    animated={true}
                />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    icon="✅"
                    label="Completed"
                    value={progress.completed_places}
                    color="green"
                />
                <StatCard
                    icon="🔄"
                    label="In Progress"
                    value={progress.in_progress_places}
                    color="blue"
                />
                <StatCard
                    icon="⏳"
                    label="Pending"
                    value={progress.pending_places}
                    color="gray"
                />
            </div>

            {/* Detailed Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    Trip Statistics
                </h3>

                <div className="space-y-3">
                    <StatRow
                        label="Total Places"
                        value={progress.total_places.toString()}
                    />
                    <StatRow
                        label="Distance Traveled"
                        value={progress.distance_formatted}
                    />
                    <StatRow
                        label="Time Spent"
                        value={progress.time_spent_formatted}
                    />
                    <StatRow
                        label="Completion Rate"
                        value={`${progress.completion_percentage}%`}
                        highlight={progress.completion_percentage === 100}
                    />
                    {progress.skipped_places > 0 && (
                        <StatRow
                            label="Skipped Places"
                            value={progress.skipped_places.toString()}
                        />
                    )}
                </div>
            </div>

            {/* Next Steps / Encouragement */}
            {progress.completion_percentage < 100 && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-xl p-6 shadow-lg">
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {progress.completion_percentage >= 75
                            ? "🚀 Almost there! Just a few more places to go!"
                            : progress.completion_percentage >= 50
                                ? "🎯 Halfway done! Keep up the great work!"
                                : progress.completion_percentage >= 25
                                    ? "📍 Great start! You're making good progress!"
                                    : "🌟 Your adventure has begun! Enjoy every moment!"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {progress.pending_places} more place{progress.pending_places !== 1 ? 's' : ''} to visit
                    </p>
                </div>
            )}
        </motion.div>
    );
}

/**
 * Stat Card Component
 */
function StatCard({
    icon,
    label,
    value,
    color
}: {
    icon: string;
    label: string;
    value: number;
    color: string;
}) {
    const colorClasses = {
        green: 'from-green-400 to-green-600',
        blue: 'from-blue-400 to-blue-600',
        gray: 'from-gray-400 to-gray-600',
        yellow: 'from-yellow-400 to-yellow-600'
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-3">
                <div className={`text-3xl bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} bg-clip-text text-transparent`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{value}</p>
                </div>
            </div>
        </div>
    );
}

/**
 * Stat Row Component
 */
function StatRow({
    label,
    value,
    highlight = false
}: {
    label: string;
    value: string;
    highlight?: boolean;
}) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
            <span className="text-gray-600 dark:text-gray-400">{label}</span>
            <span className={`font-semibold ${highlight ? 'text-green-600 dark:text-green-400' : 'text-gray-800 dark:text-gray-200'}`}>
                {value}
            </span>
        </div>
    );
}
