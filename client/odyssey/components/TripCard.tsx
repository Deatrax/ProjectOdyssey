// client/odyssey/components/TripCard.tsx
// Trip Card with Progress Integration

'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LinearProgressBar } from './ProgressBar';
import progressService, { ProgressData } from '../services/progressService';

export interface TripCardProps {
    id: string;
    title: string;
    destination: string;
    image?: string;
    startDate?: string;
    endDate?: string;
    status: 'draft' | 'active' | 'completed' | 'cancelled';
    userId?: string;
    onClick?: () => void;
    onDelete?: (e: React.MouseEvent) => void;
}

export default function TripCard({
    id,
    title,
    destination,
    image,
    startDate,
    endDate,
    status,
    userId,
    onClick,
    onDelete
}: TripCardProps) {
    const [progress, setProgress] = useState<ProgressData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Only fetch progress for active or completed trips
        if (status === 'active' || status === 'completed') {
            fetchProgress();
        }
    }, [id, status]);

    const fetchProgress = async () => {
        try {
            setLoading(true);
            const data = await progressService.getProgress(id);
            setProgress(data);
        } catch (error) {
            console.error('Failed to fetch trip progress:', error);
            // Fail silently - card will still display without progress
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = () => {
        const badges = {
            draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: '📝 Draft' },
            active: { bg: 'bg-blue-100', text: 'text-blue-800', label: '🚀 Active' },
            completed: { bg: 'bg-green-100', text: 'text-green-800', label: '✅ Completed' },
            cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: '❌ Cancelled' }
        };

        const badge = badges[status];

        return (
            <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-xs font-semibold`}>
                {badge.label}
            </span>
        );
    };

    const getProgressColor = () => {
        if (!progress) return 'gray';
        if (progress.completion_percentage === 100) return 'green';
        if (progress.completion_percentage >= 75) return 'blue';
        if (progress.completion_percentage >= 50) return 'yellow';
        if (progress.completion_percentage >= 25) return 'orange';
        return 'gray';
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group relative"
            onClick={onClick}
        >
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-500 to-blue-500" />
                )}

                {/* Overlay with status badge */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Delete Button */}
                {onDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(e);
                        }}
                        className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md hover:bg-red-500 hover:text-white text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Trip"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )}

                <div className="absolute top-4 right-4">
                    {getStatusBadge()}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 space-y-3">
                {/* Title and Destination */}
                <div>
                    <h3 className="text-xl font-bold text-gray-800 truncate">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                        📍 {destination}
                    </p>
                </div>

                {/* Dates */}
                {(startDate || endDate) && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>
                            {startDate && new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            {startDate && endDate && ' - '}
                            {endDate && new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                )}

                {/* Progress Section - Only for Active/Completed trips */}
                {(status === 'active' || status === 'completed') && (
                    <div className="pt-3 border-t border-gray-200">
                        {loading ? (
                            <div className="flex items-center justify-center py-4">
                                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : progress ? (
                            <>
                                <LinearProgressBar
                                    completed={progress.completed_places}
                                    total={progress.total_places}
                                    height="h-2"
                                    showLabel={false}
                                />

                                <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                                    <div className="text-center">
                                        <p className="text-gray-500">Places</p>
                                        <p className="font-bold text-gray-800">
                                            {progress.completed_places}/{progress.total_places}
                                        </p>
                                    </div>
                                    <div className="text-center border-l border-r border-gray-200">
                                        <p className="text-gray-500">Time</p>
                                        <p className="font-bold text-gray-800">
                                            {progress.time_spent_formatted || '0m'}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-gray-500">Progress</p>
                                        <p className={`font-bold ${progress.completion_percentage === 100
                                            ? 'text-green-600'
                                            : 'text-blue-600'
                                            }`}>
                                            {progress.completion_percentage}%
                                        </p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-3 text-sm text-gray-500">
                                No progress data yet
                            </div>
                        )}
                    </div>
                )}

                {/* Draft Message */}
                {status === 'draft' && (
                    <div className="pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-500 text-center">
                            Click to continue planning
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

/**
 * Skeleton loader for trip cards
 */
export function TripCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
            <div className="h-48 bg-gray-300" />
            <div className="p-5 space-y-3">
                <div className="h-6 bg-gray-300 rounded w-3/4" />
                <div className="h-4 bg-gray-300 rounded w-1/2" />
                <div className="h-4 bg-gray-300 rounded w-2/3" />
                <div className="pt-3 space-y-2">
                    <div className="h-2 bg-gray-300 rounded" />
                    <div className="grid grid-cols-3 gap-2">
                        <div className="h-8 bg-gray-300 rounded" />
                        <div className="h-8 bg-gray-300 rounded" />
                        <div className="h-8 bg-gray-300 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
}
