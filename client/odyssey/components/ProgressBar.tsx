// client/odyssey/components/ProgressBar.tsx
// Group 3: Progress Bar Component

'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
    completed: number;
    total: number;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    showFraction?: boolean;
    animated?: boolean;
}

export default function ProgressBar({
    completed,
    total,
    size = 'md',
    showLabel = true,
    showFraction = true,
    animated = true
}: ProgressBarProps) {
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const sizeClasses = {
        sm: 'w-24 h-24',
        md: 'w-32 h-32',
        lg: 'w-48 h-48'
    };

    const strokeWidths = {
        sm: 6,
        md: 8,
        lg: 10
    };

    const strokeWidth = strokeWidths[size];
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    // Determine color based on percentage
    const getColor = () => {
        if (percentage === 100) return 'text-green-500';
        if (percentage >= 75) return 'text-blue-500';
        if (percentage >= 50) return 'text-yellow-500';
        if (percentage >= 25) return 'text-orange-500';
        return 'text-gray-400';
    };

    const getGradient = () => {
        if (percentage === 100) return 'from-green-400 to-green-600';
        if (percentage >= 75) return 'from-blue-400 to-blue-600';
        if (percentage >= 50) return 'from-yellow-400 to-yellow-600';
        if (percentage >= 25) return 'from-orange-400 to-orange-600';
        return 'from-gray-300 to-gray-500';
    };

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative">
                <svg
                    className={`${sizeClasses[size]} transform -rotate-90`}
                    viewBox="0 0 100 100"
                >
                    {/* Background circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        className="text-gray-200 dark:text-gray-700"
                    />

                    {/* Progress circle with gradient */}
                    <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" className={getGradient().split(' ')[0].replace('from-', 'stop-color-')} />
                            <stop offset="100%" className={getGradient().split(' ')[1].replace('to-', 'stop-color-')} />
                        </linearGradient>
                    </defs>

                    {animated ? (
                        <motion.circle
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="none"
                            stroke="url(#progressGradient)"
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: offset }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={getColor()}
                        />
                    ) : (
                        <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="none"
                            stroke="url(#progressGradient)"
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            className={getColor()}
                        />
                    )}
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {animated ? (
                        <motion.span
                            className={`font-bold ${getColor()} ${size === 'sm' ? 'text-xl' : size === 'md' ? 'text-3xl' : 'text-5xl'
                                }`}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            {percentage}%
                        </motion.span>
                    ) : (
                        <span
                            className={`font-bold ${getColor()} ${size === 'sm' ? 'text-xl' : size === 'md' ? 'text-3xl' : 'text-5xl'
                                }`}
                        >
                            {percentage}%
                        </span>
                    )}

                    {showFraction && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {completed}/{total}
                        </span>
                    )}
                </div>
            </div>

            {showLabel && (
                <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {percentage === 100 ? (
                            <span className="text-green-600 dark:text-green-400">✅ Complete!</span>
                        ) : percentage === 0 ? (
                            <span className="text-gray-500">Not started</span>
                        ) : (
                            <span>
                                {completed} of {total} places visited
                            </span>
                        )}
                    </p>
                </div>
            )}
        </div>
    );
}

/**
 * Linear Progress Bar variant (for smaller spaces)
 */
export function LinearProgressBar({
    completed,
    total,
    height = 'h-3',
    showLabel = true,
    animated = true
}: {
    completed: number;
    total: number;
    height?: string;
    showLabel?: boolean;
    animated?: boolean;
}) {
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const getGradient = () => {
        if (percentage === 100) return 'from-green-400 to-green-600';
        if (percentage >= 75) return 'from-blue-400 to-blue-600';
        if (percentage >= 50) return 'from-yellow-400 to-yellow-600';
        if (percentage >= 25) return 'from-orange-400 to-orange-600';
        return 'from-gray-300 to-gray-500';
    };

    return (
        <div className="w-full space-y-2">
            {showLabel && (
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                        Progress
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                        {completed}/{total} ({percentage}%)
                    </span>
                </div>
            )}

            <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${height}`}>
                {animated ? (
                    <motion.div
                        className={`${height} bg-gradient-to-r ${getGradient()} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    />
                ) : (
                    <div
                        className={`${height} bg-gradient-to-r ${getGradient()} rounded-full`}
                        style={{ width: `${percentage}%` }}
                    />
                )}
            </div>
        </div>
    );
}
