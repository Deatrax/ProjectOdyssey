"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Layout, CheckCircle, Trash2 } from "lucide-react";

interface Itinerary {
    id: string;
    tripName: string;
    status?: "draft" | "confirmed" | "completed";
    startDate?: string;
}

interface ItinerarySidebarProps {
    itineraries: Itinerary[];
    activeItineraryId: string | null;
    onSelectItinerary: (id: string) => void;
    onNewTrip: () => void;
    onDeleteTrip?: (id: string) => void;
}

export default function ItinerarySidebar({
    itineraries,
    activeItineraryId,
    onSelectItinerary,
    onNewTrip,
    onDeleteTrip
}: ItinerarySidebarProps) {
    const [completedCollapsed, setCompletedCollapsed] = useState(true);

    // Group itineraries
    const activeItineraries = itineraries.filter(
        (i) => !i.status || i.status === "draft" || i.status === "confirmed"
    );
    const completedItineraries = itineraries.filter((i) => i.status === "completed");

    return (
        <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
            <div className="p-4 border-b border-gray-100">
                <button
                    onClick={onNewTrip}
                    className="w-full py-2 px-4 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                    <span>+</span> New Trip
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Active Trips */}
                <div>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                        Active Trips
                    </h3>
                    <div className="space-y-2">
                        {activeItineraries.length === 0 && (
                            <p className="text-sm text-gray-400 px-2 italic">No active trips</p>
                        )}
                        {activeItineraries.map((trip) => {
                            const isActive = activeItineraryId === trip.id;
                            return (
                                <div
                                    key={trip.id}
                                    className={`group relative w-full text-left p-3 rounded-xl transition-all cursor-pointer ${isActive
                                        ? "bg-[#F5EFE7] ring-1 ring-[#4A9B7F] shadow-sm"
                                        : "hover:bg-gray-50 text-gray-600"
                                        }`}
                                    onClick={() => onSelectItinerary(trip.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? "bg-[#4A9B7F] text-white" : "bg-gray-100 text-gray-400"
                                            }`}>
                                            <Layout className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`text-sm font-medium truncate ${isActive ? "text-gray-900" : "text-gray-600"
                                                }`}>
                                                {trip.tripName || "Untitled Trip"}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                {trip.startDate && (
                                                    <p className="text-xs text-gray-400">{trip.startDate}</p>
                                                )}
                                                {isActive && (
                                                    <span className="text-[10px] font-bold text-[#4A9B7F] bg-[#4A9B7F]/10 px-1.5 py-0.5 rounded-full uppercase">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {/* Delete Button */}
                                        {onDeleteTrip && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onDeleteTrip(trip.id); }}
                                                className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                                title="Delete trip"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Completed Trips */}
                {completedItineraries.length > 0 && (
                    <div>
                        <button
                            onClick={() => setCompletedCollapsed(!completedCollapsed)}
                            className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2 hover:text-gray-600 w-full"
                        >
                            {completedCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            Past Trips
                        </button>

                        {!completedCollapsed && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                {completedItineraries.map((trip) => (
                                    <div
                                        key={trip.id}
                                        className={`group relative w-full text-left p-3 rounded-xl transition-all cursor-pointer ${activeItineraryId === trip.id
                                            ? "bg-gray-100 text-gray-900"
                                            : "hover:bg-gray-50 text-gray-500 opacity-75 hover:opacity-100"
                                            }`}
                                        onClick={() => onSelectItinerary(trip.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm truncate flex-1">{trip.tripName}</span>
                                            {onDeleteTrip && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onDeleteTrip(trip.id); }}
                                                    className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                                    title="Delete trip"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div >
    );
}
