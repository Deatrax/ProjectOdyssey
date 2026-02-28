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

type GroupInfo = {
    id: string;
    title: string;
    memberCount: number;
};

/** Decode JWT payload without a library – payload is just base64url JSON. */
function decodeJwtId(token: string): string | null {
    try {
        const payload = token.split('.')[1];
        const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
        return json.id || json.sub || null;
    } catch {
        return null;
    }
}

/** Short display name for a user_id (e.g. "User …a3f9b2") */
function shortUser(userId: string): string {
    return `User …${userId.slice(-6)}`;
}

export default function TripPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [savedItinerary, setSavedItinerary] = useState<any>(null);
    const [savedItineraryId, setSavedItineraryId] = useState<string | null>(null);
    const [selectedDay, setSelectedDay] = useState<number>(1);
    const [mapCollapsed, setMapCollapsed] = useState(false);

    // Group-trip state
    const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Load Itinerary (group-first, same as planner)
    useEffect(() => {
        const loadSavedItinerary = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    router.push("/login");
                    return;
                }

                // Decode user ID from the JWT so the visit hook can isolate this
                // user's active visit from other group members' in-progress logs.
                const uid = decodeJwtId(token);
                setCurrentUserId(uid);

                // ── GROUP CHECK (same logic as planner) ──────────────────────
                const groupRes = await fetch("http://localhost:4000/api/groups/mine/active", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (groupRes.ok) {
                    const groupData = await groupRes.json();
                    if (groupData.group && groupData.itinerary) {
                        const itin = groupData.itinerary;
                        const selectedItin = itin.selected_itinerary;
                        setSavedItineraryId(itin.id);
                        setSavedItinerary({
                            id: itin.id,
                            tripName: `${groupData.group.title}`,
                            schedule: Array.isArray(selectedItin?.schedule) ? selectedItin.schedule : [],
                        });
                        setGroupInfo({
                            id: groupData.group.id,
                            title: groupData.group.title,
                            memberCount: groupData.group.member_count ?? 0,
                        });
                        return; // skip personal itinerary lookup
                    }
                }

                // ── PERSONAL ITINERARY FALLBACK ──────────────────────────────
                const res = await fetch("http://localhost:4000/api/trips", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
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
                        schedule: Array.isArray(selectedItin?.schedule) ? selectedItin.schedule : [],
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
    // Pass currentUserId so the hook isolates THIS user's active check-in;
    // visitHistory still contains ALL group members' logs (itinerary-scoped).
    const {
        currentVisit,
        visitHistory,
        checkIn,
        checkOut,
        fetchVisitHistory,
    } = useVisitTracking(
        savedItineraryId || "",
        typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '',
        currentUserId ?? undefined,
    );

    // ── GROUP SYNC via SSE ────────────────────────────────────────────────────
    // Opens ONE persistent HTTP connection per client.
    // The backend subscribes to Supabase Realtime on visit_logs and pushes a
    // tiny "changed" event only when something actually changes.
    // This means zero requests when the group is idle — unlike polling.
    //
    // Fallback: if the server signals Realtime is unavailable (not configured
    // in Supabase dashboard), we fall back to a light 30s poll instead of 10s.
    useEffect(() => {
        if (!groupInfo || !savedItineraryId) return;

        const token = localStorage.getItem('token') || '';
        // EventSource cannot send custom headers — pass token as query param.
        const url = `http://localhost:4000/api/visits/stream/${savedItineraryId}?token=${encodeURIComponent(token)}`;

        let fallbackInterval: ReturnType<typeof setInterval> | null = null;
        const es = new EventSource(url);

        // Server pushes this when a visit_log row changes
        es.addEventListener('changed', () => {
            fetchVisitHistory();
        });

        // Server pushes this if Supabase Realtime isn't configured on the table.
        // Fall back to infrequent polling (30s) so sync still works.
        es.addEventListener('unavailable', () => {
            console.warn('[GroupTrip] Realtime unavailable, falling back to 30s poll.');
            fallbackInterval = setInterval(() => fetchVisitHistory(), 30_000);
        });

        es.onerror = () => {
            // Browser auto-reconnects — no manual action needed.
            console.warn('[GroupTrip] SSE reconnecting...');
        };

        return () => {
            es.close();
            if (fallbackInterval) clearInterval(fallbackInterval);
        };
    }, [groupInfo, savedItineraryId, fetchVisitHistory]);

    // Geofencing Hook for Auto-Checkin
    const { geofenceStatus, userLocation } = useGeofencing({
        enabled: !!savedItineraryId,
        itineraryId: savedItineraryId || undefined,
        autoCheckin: true,
        throttleInterval: 10000,
    });

    // Request Notification Permission on mount
    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            Notification.requestPermission();
        }
    }, []);

    // Send Notification helper
    const sendNotification = (title: string, body: string) => {
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body, icon: '/icon.png' });
        }
    };

    // Handle Auto-Actions & Notifications
    useEffect(() => {
        if (geofenceStatus?.action === 'auto_checked_in' && geofenceStatus.place) {
            if (!currentVisit) {
                sendNotification("Arrived!", `You have arrived at ${geofenceStatus.place.placeName}`);
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
                sendNotification("Departed", `You have left ${geofenceStatus.place.placeName}`);
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
    const visitedCount = visitHistory.filter((v: any) => v.status === 'completed').length;

    return (
        <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-[#FFF5E9]">

            {/* LEFT PANEL: Timeline */}
            <div className={`flex flex-col transition-all duration-300 ${mapCollapsed ? 'w-full' : 'w-full md:w-[450px] lg:w-[500px]'} bg-white border-r border-gray-200 shadow-xl z-10`}>

                {/* Group Banner */}
                {groupInfo && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#4A9B7F] text-white text-sm font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                        </svg>
                        <span className="truncate">Group Trip · {groupInfo.title}</span>
                        <span className="ml-auto flex-shrink-0 text-white/80">syncing every 10s</span>
                    </div>
                )}

                {/* Header */}
                <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-20">
                    <h1 className="text-2xl font-bold font-odyssey text-gray-900 mb-2">{savedItinerary.tripName}</h1>
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500 font-medium">
                            {visitedCount} place{visitedCount !== 1 ? 's' : ''} visited{groupInfo ? ' (group total)' : ''}
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
                            const placeKey = item.placeId || item.id;
                            //Deatrax: manually resolved code
                            const visitLog = visitHistory.find(v => v.place_id === (item.placeId || item.id));
                            // visitHistory is itinerary-scoped: includes ALL group members' logs.
                            // A place is "completed" if ANY member checked out of it.
                            const completedLog = visitHistory.find(
                                (v: any) => v.place_id === placeKey && v.status === 'completed'
                            );
                            // A place is "active" only if THIS user is currently there.
                            const isCurrent = currentVisit?.place_id === placeKey;
                            const isCompleted = !!completedLog;
                            const isPending = !visitLog && !isCurrent;
                            // Who completed this place?
                            const completedBy =
                                completedLog?.user_id === currentUserId
                                    ? 'You'
                                    : completedLog?.user_id
                                        ? shortUser(completedLog.user_id)
                                        : null;

                            return (
                                <div key={`${item.id || 'item'}-${index}`} className="flex gap-6 relative group">
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
                                                <h3 className={`font-bold text-gray-900 ${isCurrent ? 'text-lg' : 'text-base'} ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                                                    {item.name || item.place}
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
                                            <p className={`text-sm text-gray-600 line-clamp-2 mb-3 ${isCompleted ? 'line-through opacity-50' : ''}`}>
                                                {item.description}
                                            </p>
                                        )}

                                        {/* Completed-by attribution (group trips) */}
                                        {isCompleted && completedBy && groupInfo && (
                                            <p className="text-xs text-gray-400 mb-2 italic">
                                                Visited by {completedBy}
                                            </p>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2 mt-2">
                                            {/* Navigate Button */}
                                            <a
                                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(item.name || item.place)}${item.placeId ? `&destination_place_id=${item.placeId}` : ''}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                                                title="Open in Google Maps"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                                                </svg>
                                                Navigate
                                            </a>

                                            {!isCompleted && !isCurrent && (
                                                <button
                                                    onClick={() => checkIn({
                                                        placeId: placeKey,
                                                        placeName: item.name || item.place,
                                                        location: { lat: 0, lng: 0 }
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
                    {/*Deatrax: manually resolved code by accepting current instead of incoming*/}
                    <MapComponent
                        items={currentDayItems.filter((i: any) => (i.placeId || (i.lat && i.lng)) && !i.isBreak)}
                        userLocation={userLocation}
                        geofences={currentDayItems
                            .filter((i: any) => i.lat && i.lng && !i.isBreak)
                            .map((i: any) => {
                                const isCurrent = currentVisit?.place_id === (i.placeId || i.id);
                                const isCompleted = visitHistory.find(v => v.place_id === (i.placeId || i.id))?.status === 'completed';
                                let color = '#22c55e'; // Default Green (Pending)
                                if (isCurrent) color = '#3b82f6'; // Blue (Active)
                                if (isCompleted) color = '#9ca3af'; // Gray (Completed)

                                return {
                                    lat: i.lat,
                                    lng: i.lng,
                                    radius: 100,
                                    color
                                };
                            })}
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

            {/* Re-expand button when map is collapsed */}
            {mapCollapsed && (
                <button
                    onClick={() => setMapCollapsed(false)}
                    className="hidden md:block absolute top-1/2 right-0 bg-white p-3 rounded-l-xl shadow-lg hover:bg-gray-50 z-50 text-gray-600 transform -translate-y-1/2 border border-r-0 border-gray-200"
                    title="Show Map"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0Zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0Z" />
                    </svg>
                    <span className="block text-xs font-bold mt-1 writing-vertical text-orientation-up">MAP</span>
                </button>
            )}

        </div>
    );
}
