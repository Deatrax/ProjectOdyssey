"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Layout, CheckCircle, Clock } from "lucide-react";

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
}

export default function ItinerarySidebar({
    itineraries,
    activeItineraryId,
    onSelectItinerary,
    onNewTrip
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
                        {activeItineraries.map((trip) => (
                            <button
                                key={trip.id}
                                onClick={() => onSelectItinerary(trip.id)}
                                className={`w-full text-left p-3 rounded-xl transition-all ${activeItineraryId === trip.id
                                    ? "bg-[#F5EFE7] ring-1 ring-[#4A9B7F] shadow-sm"
                                    : "hover:bg-gray-50 text-gray-600"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeItineraryId === trip.id ? "bg-[#4A9B7F] text-white" : "bg-gray-100 text-gray-400"
                                        }`}>
                                        <Layout className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-medium ${activeItineraryId === trip.id ? "text-gray-900" : "text-gray-600"
                                            }`}>
                                            {trip.tripName || "Untitled Trip"}
                                        </h4>
                                        {trip.startDate && (
                                            <p className="text-xs text-gray-400 mt-0.5">{trip.startDate}</p>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
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
                                    <button
                                        key={trip.id}
                                        onClick={() => onSelectItinerary(trip.id)}
                                        className={`w-full text-left p-3 rounded-xl transition-all ${activeItineraryId === trip.id
                                            ? "bg-gray-100 text-gray-900"
                                            : "hover:bg-gray-50 text-gray-500 opacity-75 hover:opacity-100"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm truncate">{trip.tripName}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div >
    );
}
