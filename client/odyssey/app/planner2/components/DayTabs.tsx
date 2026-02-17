"use client";

import React from "react";

interface DayTabsProps {
    currentDay: number;
    totalDays: number;
    onDaySelect: (day: number) => void;
}

export default function DayTabs({ currentDay, totalDays, onDaySelect }: DayTabsProps) {
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 custom-scrollbar">
            {days.map((day) => (
                <button
                    key={day}
                    onClick={() => onDaySelect(day)}
                    className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 ${currentDay === day
                            ? "bg-black text-white shadow-md transform scale-105"
                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                        }`}
                >
                    Day {day}
                </button>
            ))}
        </div>
    );
}
