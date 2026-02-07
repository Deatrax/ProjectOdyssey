"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MapComponent from "../components/MapComponent";
import { useVisitTracking } from "../hooks/useVisitTracking";
import { useGeofencing } from "../hooks/useGeofencing";

// --- TYPES ---
type Item = {
    id: string;
    placeId?: string;
    name: string;
    category?: string;
    visitDurationMin?: number;
    time?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
};

type ItineraryDay = {
    day: number;
    items: Item[];
};

export default function TripPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [savedItinerary, setSavedItinerary] = useState<any>(null);
    const [savedItineraryId, setSavedItineraryId] = useState<string | null>(null);
    const [selectedDay, setSelectedDay] = useState<number>(1);
    const [mapCollapsed, setMapCollapsed] = useState(false);

    // Load Itinerary
    useEffect(() => {
        const loadSavedItinerary = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    router.push("/login");
                    return;
                }

                const res = await fetch("http://localhost:4000/api/trips", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!res.ok) throw new Error("Failed to fetch trips");

                const data = await res.json();
                if (data.success && data.data && data.data.length > 0) {
                    const latestItinerary = data.data[0];
                    const selectedItin = latestItinerary.selected_itinerary;

                    setSavedItineraryId(latestItinerary.id);
                    setSavedItinerary({
                        id: latestItinerary.id,
                        tripName: latestItinerary.trip_name,
                        schedule: Array.isArray(selectedItin?.schedule) ? selectedItin.schedule : []
                    });
                }
            } catch (err) {
                console.error("Error loading saved itinerary:", err);
            } finally {
                setLoading(false);
            }
        };

        loadSavedItinerary();
    }, [router]);

    // Visit Tracking Hook
    const {
        currentVisit,
        visitHistory,
        checkIn,
        checkOut,
    } = useVisitTracking(savedItineraryId || "", typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '');

    // Geofencing Hook for Auto-Checkin
    const { geofenceStatus, userLocation } = useGeofencing({
        enabled: !!savedItineraryId,
        itineraryId: savedItineraryId || undefined,
        autoCheckin: true,
        throttleInterval: 10000,
    });

    // Handle Auto-Actions
    useEffect(() => {
        if (geofenceStatus?.action === 'auto_checked_in' && geofenceStatus.place) {
            if (!currentVisit) {
                checkIn({
                    placeId: geofenceStatus.place.placeId,
                    placeName: geofenceStatus.place.placeName,
                    location: {
                        lat: geofenceStatus.place.latitude,
                        lng: geofenceStatus.place.longitude
                    }
                });
            }
        } else if (geofenceStatus?.action === 'auto_checked_out' && geofenceStatus.place) {
            if (currentVisit && currentVisit.place_id === geofenceStatus.place.placeId) {
                checkOut({
                    location: {
                        lat: geofenceStatus.place.latitude,
                        lng: geofenceStatus.place.longitude
                    }
                });
            }
        }
    }, [geofenceStatus, currentVisit, checkIn, checkOut]);


    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#FFF5E9]">
                <div className="text-xl font-odyssey text-gray-600 animate-pulse">Loading Trip...</div>
            </div>
        );
    }

    if (!savedItinerary) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-[#FFF5E9]">
                <div className="text-xl font-odyssey text-gray-600 mb-4">No active trip found.</div>
                <button
                    onClick={() => router.push("/planner")}
                    className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                >
                    Go to Planner
                </button>
            </div>
        );
    }

    const currentDayItems = savedItinerary.schedule.find((d: any) => d.day === selectedDay)?.items || [];

    return (
        <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-[#FFF5E9]"> {/* Subtract Navbar height approx */}

            {/* LEFT PANEL: Timeline */}
            <div className={`flex flex-col transition-all duration-300 ${mapCollapsed ? 'w-full' : 'w-full md:w-[450px] lg:w-[500px]'} bg-white border-r border-gray-200 shadow-xl z-10`}>

                {/* Header */}
                <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-20">
                    <h1 className="text-2xl font-bold font-odyssey text-gray-900 mb-2">{savedItinerary.tripName}</h1>
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500 font-medium">
                            {visitHistory.length} places visited
                        </div>
                        <button
                            onClick={() => setMapCollapsed(!mapCollapsed)}
                            className="md:hidden text-sm bg-gray-100 px-3 py-1 rounded-lg"
                        >
                            {mapCollapsed ? 'Show Map' : 'Hide Map'}
                        </button>
                    </div>
                </div>

                {/* Day Tabs */}
                <div className="flex overflow-x-auto p-4 gap-2 border-b border-gray-100 scrollbar-hide">
                    {savedItinerary.schedule.map((day: any) => (
                        <button
                            key={day.day}
                            onClick={() => setSelectedDay(day.day)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${selectedDay === day.day
                                ? "bg-black text-white shadow-md"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            Day {day.day}
                        </button>
                    ))}
                </div>

                {/* Vertical Timeline */}
                <div className="flex-1 overflow-y-auto p-6 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[35px] top-6 bottom-6 w-0.5 bg-gray-200" />

                    <div className="space-y-8 relative">
                        {currentDayItems.map((item: any, index: number) => {
                            const visitLog = visitHistory.find(v => v.place_id === (item.placeId || item.id));
                            const isCurrent = currentVisit?.place_id === (item.placeId || item.id);
                            const isCompleted = visitLog?.status === 'completed';
                            const isPending = !visitLog && !isCurrent;

                            return (
                                <div key={item.id} className="flex gap-6 relative group">
                                    {/* Node */}
                                    <div className={`
                    w-5 h-5 rounded-full border-4 z-10 flex-shrink-0 mt-1 transition-all duration-300
                    ${isCompleted ? 'bg-green-500 border-green-200' :
                                            isCurrent ? 'bg-blue-500 border-blue-200 animate-pulse' :
                                                'bg-white border-gray-300'}
                  `} />

                                    {/* Card */}
                                    <div className={`
                    flex-1 rounded-2xl p-4 transition-all duration-300 border
                    ${isCurrent ? 'bg-blue-50 border-blue-200 shadow-md transform scale-[1.02]' :
                                            isCompleted ? 'bg-gray-50 border-gray-100 opacity-75' :
                                                'bg-white border-gray-100 shadow-sm hover:shadow-md'}
                  `}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 block">
                                                    {item.time || 'Flexible Time'}
                                                </span>
                                                <h3 className={`font-bold text-gray-900 ${isCurrent ? 'text-lg' : 'text-base'}`}>
                                                    {item.name || item.place} // Fallback for name property
                                                </h3>
                                            </div>
                                            {isCurrent && (
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full animate-pulse">
                                                    Active
                                                </span>
                                            )}
                                            {isCompleted && (
                                                <span className="text-green-500 font-bold text-lg">✓</span>
                                            )}
                                        </div>

                                        {item.description && (
                                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                                {item.description}
                                            </p>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2 mt-2">
                                            {!isCompleted && !isCurrent && (
                                                <button
                                                    onClick={() => checkIn({
                                                        placeId: item.placeId || item.id,
                                                        placeName: item.name || item.place,
                                                        location: { lat: 0, lng: 0 } // Mock location if manual
                                                    })}
                                                    className="text-xs bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                                                >
                                                    Check In
                                                </button>
                                            )}
                                            {isCurrent && (
                                                <button
                                                    onClick={() => checkOut({})}
                                                    className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    Check Out
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {currentDayItems.length === 0 && (
                            <div className="text-center text-gray-400 py-10">No activities scheduled for this day.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: Map */}
            {!mapCollapsed && (
                <div className="hidden md:block flex-1 relative h-full bg-gray-100">
                    <MapComponent 
                      items={currentDayItems.filter((i:any) => i.placeId || (i.lat && i.lng))} 
                      userLocation={userLocation}
                      geofences={currentDayItems
                        .filter((i:any) => i.lat && i.lng) // Ensure coords exist
                        .map((i:any) => ({ lat: i.lat, lng: i.lng, radius: 100, color: visitHistory.find(v => v.place_id === (i.placeId || i.id))?.status === 'completed' ? '#9ca3af' : '#22c55e' }))} // Grey if visited
                      onClose={() => { }} 
                    />

                    {/* Collapse Button */}
                    <button
                        onClick={() => setMapCollapsed(true)}
                        className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 z-[400] text-gray-600"
                        title="Expand Timeline"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Re-expand button when collapsed */}
            {mapCollapsed && (
                <button
                    onClick={() => setMapCollapsed(false)}
                    className="hidden md:block absolute top-1/2 right-0 bg-white p-3 rounded-l-xl shadow-lg hover:bg-gray-50 z-50 text-gray-600 transform -translate-y-1/2 border border-r-0 border-gray-200"
                    title="Show Map"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                    <span className="block text-xs font-bold mt-1 writing-vertical text-orientation-up">MAP</span>
                </button>
            )}

        </div>
    );
}
