// client/odyssey/components/TripSummary.tsx
// Group 3: Trip Summary Component

'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import Confetti from 'react-confetti';
import { TripSummary as TripSummaryType } from '../services/progressService';

interface TripSummaryProps {
    summary: TripSummaryType;
    showConfetti?: boolean;
    onShare?: () => void;
    onExport?: () => void;
}

export default function TripSummary({
    summary,
    showConfetti = true,
    onShare,
    onExport
}: TripSummaryProps) {
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    const [confettiActive, setConfettiActive] = useState(showConfetti);

    useEffect(() => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
        });

        if (showConfetti) {
            // Stop confetti after 5 seconds
            const timer = setTimeout(() => setConfettiActive(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [showConfetti]);

    const { itinerary, progress, enriched } = summary;
    const isComplete = progress.completion_percentage === 100;

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="relative">
            {/* Confetti */}
            {confettiActive && isComplete && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={500}
                    gravity={0.3}
                />
            )}

            <motion.div
                className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900 dark:via-pink-900 dark:to-blue-900 rounded-3xl shadow-2xl"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <motion.div className="text-center mb-8" variants={itemVariants}>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        {isComplete ? '🎉 Trip Complete! 🎉' : '📊 Trip Summary'}
                    </h1>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        {itinerary.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {itinerary.destination}
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
                    variants={itemVariants}
                >
                    {/* Places Visited */}
                    <StatCard
                        icon="📍"
                        label="Places Visited"
                        value={progress.completed_places}
                        total={progress.total_places}
                        color="purple"
                    />

                    {/* Total Distance */}
                    <StatCard
                        icon="🚶"
                        label="Distance Traveled"
                        value={enriched.total_distance_formatted}
                        color="blue"
                    />

                    {/* Total Time */}
                    <StatCard
                        icon="⏱️"
                        label="Time Spent"
                        value={enriched.total_time_formatted}
                        color="green"
                    />

                    {/* Completion Rate */}
                    <StatCard
                        icon="✅"
                        label="Completion"
                        value={`${progress.completion_percentage}%`}
                        color="pink"
                    />
                </motion.div>

                {/* Detailed Stats */}
                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg"
                    variants={itemVariants}
                >
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                        Trip Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DetailRow
                            label="Total Trip Duration"
                            value={enriched.trip_duration_formatted}
                        />
                        <DetailRow
                            label="Average Time per Place"
                            value={enriched.average_time_formatted}
                        />
                        <DetailRow
                            label="Started"
                            value={new Date(itinerary.created_at).toLocaleDateString()}
                        />
                        <DetailRow
                            label="Completed"
                            value={enriched.completion_date
                                ? new Date(enriched.completion_date).toLocaleDateString()
                                : 'In Progress'
                            }
                        />
                    </div>
                </motion.div>

                {/* Favorite Place */}
                {enriched.favorite_place && (
                    <motion.div
                        className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 rounded-2xl p-6 mb-8 shadow-lg"
                        variants={itemVariants}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">⭐</span>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                Favorite Place
                            </h3>
                        </div>
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            {enriched.favorite_place.name}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>
                                {'⭐'.repeat(enriched.favorite_place.rating)} ({enriched.favorite_place.rating}/5)
                            </span>
                            <span>
                                Time spent: {enriched.favorite_place.time_spent}
                            </span>
                        </div>
                    </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                    className="flex flex-wrap gap-4 justify-center"
                    variants={itemVariants}
                >
                    {onShare && (
                        <button
                            onClick={onShare}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                        >
                            🔗 Share Trip
                        </button>
                    )}

                    {onExport && (
                        <button
                            onClick={onExport}
                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                        >
                            📸 Export Summary
                        </button>
                    )}
                </motion.div>

                {/* Completion Message */}
                {isComplete && (
                    <motion.div
                        className="mt-8 text-center"
                        variants={itemVariants}
                    >
                        <p className="text-lg text-gray-700 dark:text-gray-300">
                            🎊 Congratulations on completing your amazing trip! 🎊
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            We hope you had an unforgettable experience!
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

/**
 * Stat Card Component
 */
function StatCard({
    icon,
    label,
    value,
    total,
    color
}: {
    icon: string;
    label: string;
    value: number | string;
    total?: number;
    color: string;
}) {
    const colorClasses = {
        purple: 'from-purple-400 to-purple-600',
        blue: 'from-blue-400 to-blue-600',
        green: 'from-green-400 to-green-600',
        pink: 'from-pink-400 to-pink-600',
        yellow: 'from-yellow-400 to-yellow-600'
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className={`text-3xl mb-2 bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} bg-clip-text text-transparent`}>
                {icon}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {label}
            </div>
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {typeof value === 'number' && !total ? (
                    <CountUp end={value} duration={2} />
                ) : (
                    <span>{value}</span>
                )}
                {total && <span className="text-lg text-gray-500">/{total}</span>}
            </div>
        </div>
    );
}

/**
 * Detail Row Component
 */
function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
            <span className="text-gray-600 dark:text-gray-400">{label}</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{value}</span>
        </div>
    );
}
