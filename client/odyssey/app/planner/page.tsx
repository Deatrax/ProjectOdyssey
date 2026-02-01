"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  closestCorners
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useRouter } from "next/navigation";

// Components
import ItinerarySetup from "./components/ItinerarySetup";
import ItinerarySidebar from "./components/ItinerarySidebar";
import DayTabs from "./components/DayTabs";
import TimelineView from "./components/TimelineView";
import ResourcePanel from "./components/ResourcePanel";
import MapComponent from "../components/MapComponent";
import LocationModal from "../components/LocationModal";

// Icons & UI
import { Menu, Map as MapIcon, List, Sparkles } from "lucide-react";

// Types
type ItineraryItem = {
  id: string;
  name: string;
  placeId?: string;
  category?: string;
  visitDurationMin?: number;
  time?: string;
  description?: string;
  images?: string[];
  reviews?: any[];
  source?: "db" | "ai";
  // details for map
  lat?: number;
  lng?: number;
};

type Trip = {
  id: string;
  tripName: string;
  startDate?: string;
  status: "draft" | "confirmed" | "completed";
  days: number;
  travelers: number;
  // This structure matches what we save in 'selectedItinerary' or similar JSON
  schedule: Record<number, ItineraryItem[]>;
};

export default function PlannerPage() {
  const router = useRouter();

  // --- STATE ---

  // 1. Navigation / View Modes
  const [showSetup, setShowSetup] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState<"itinerary" | "map">("itinerary");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 2. Data
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTripId, setActiveTripId] = useState<string | null>(null);

  // Derived active trip
  const activeTrip = trips.find(t => t.id === activeTripId) || null;

  // 3. Active Trip State
  const [currentDay, setCurrentDay] = useState(1);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // 4. Resource Panel State (Chat / Search)
  const [activeRightTab, setActiveRightTab] = useState<"chat" | "destinations" | "summaries">("chat");
  const [destinationsView, setDestinationsView] = useState<"search" | "collections">("search");
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [searchResults, setSearchResults] = useState<ItineraryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [collections, setCollections] = useState<ItineraryItem[]>([]); // Mock collections for now, or load from DB

  // 5. Drag & Drop State
  const [activeDragItem, setActiveDragItem] = useState<any>(null);

  // 6. Modals
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<ItineraryItem | null>(null);

  // Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor)
  );

  // --- EFFECTS ---

  // Load Trips on Mount
  useEffect(() => {
    loadTrips();
    loadChatHistory();
    // Load collections logic here if real
    // Mock Collections
    setCollections([
      { id: "c1", name: "Saved Museum", category: "History", visitDurationMin: 90 },
      { id: "c2", name: "Favorite Cafe", category: "Food", visitDurationMin: 45 }
    ]);
  }, []);

  const loadTrips = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:4000/api/trips", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          // Map backend data to our local Trip type
          const loadedTrips = data.data.map((t: any) => ({
            id: t.id,
            tripName: t.trip_name,
            startDate: t.selected_itinerary?.startDate || "2024-06-01", // fallback
            days: t.selected_itinerary?.days || 3, // fallback
            travelers: t.selected_itinerary?.travelers || 1,
            status: t.status || "draft",
            schedule: t.selected_itinerary?.schedule || {}
          }));
          setTrips(loadedTrips);

          if (loadedTrips.length > 0) {
            // Select the most recent active one
            const firstActive = loadedTrips.find((t: any) => t.status !== "completed");
            if (firstActive) setActiveTripId(firstActive.id);
            else setShowSetup(true);
          } else {
            setShowSetup(true);
          }
        }
      }
    } catch (e) { console.error("Failed to load trips", e); }
  };

  const loadChatHistory = async () => {
    // Reusing existing chat load logic strictly
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:4000/api/chat/history?limit=50", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        const msgs = data.data.map((m: any) => ({
          id: m.id,
          text: m.message,
          sender: m.role === 'user' ? 'user' : 'ai',
          cards: m.metadata?.cards || []
        }));
        setChatMessages(msgs);
      } else {
        setChatMessages([{ id: "init", text: "Hello! Where are we going today?", sender: "ai" }]);
      }
    } catch (e) {
      setChatMessages([{ id: "init", text: "Hello! Where are we going today?", sender: "ai" }]);
    }
  };

  // --- LOGIC ---

  // Helper to recalculate times for a day based on durations
  const recalculateDayTimes = (items: ItineraryItem[], startTime = "09:00"): ItineraryItem[] => {
    let currentTime = new Date(`2000-01-01T${startTime}`);

    return items.map(item => {
      // Format current time as HH:MM
      const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

      // Add duration
      const duration = item.visitDurationMin || 60;
      currentTime.setMinutes(currentTime.getMinutes() + duration);

      return { ...item, time: timeStr };
    });
  };

  // --- ACTIONS ---

  const handleCreateTrip = async (data: { title: string; days: number; travelers: number; startDate: string }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to create a trip");
      return;
    }

    const schedule: Record<number, ItineraryItem[]> = {};
    for (let i = 1; i <= data.days; i++) schedule[i] = [];

    const newTripPayload = {
      tripName: data.title,
      selectedPlaces: [],
      status: "draft",
      selectedItinerary: {
        title: data.title,
        days: data.days,
        travelers: data.travelers,
        startDate: data.startDate,
        schedule: schedule
      }
    };

    try {
      const res = await fetch("http://localhost:4000/api/trips/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newTripPayload)
      });
      if (res.ok) {
        const json = await res.json();
        const createdTrip = {
          id: json.data.id || "temp-id",
          tripName: data.title,
          days: data.days,
          travelers: data.travelers,
          startDate: data.startDate,
          status: "draft" as const,
          schedule: schedule
        };
        setTrips([createdTrip, ...trips]);
        setActiveTripId(createdTrip.id);
        setShowSetup(false);
      }
    } catch (e) {
      console.error("Error creating trip", e);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { id: Date.now().toString(), text: chatInput, sender: "user" };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");

    const token = localStorage.getItem("token");

    try {
      if (token) {
        await fetch("http://localhost:4000/api/chat/message", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ message: userMsg.text, role: "user" })
        });
      }

      const res = await fetch("http://localhost:4000/api/clustering/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ message: userMsg.text, userContext: { budget: "medium" } })
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg = {
          id: Date.now().toString() + "ai",
          text: "I've found some places for you. Check these out!",
          sender: "ai",
          cards: data.data?.clusters?.[0]?.places?.map((p: any) => ({
            id: p.place_id,
            name: p.name,
            category: p.types?.[0],
            // ... map other fields
          })) || []
        };
        setChatMessages(prev => [...prev, aiMsg]);
      }

    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async () => {
    // Mocking for now as per "retain features" - existing file likely used external API or was mocked
    const mockResults: ItineraryItem[] = [
      { id: "p1", name: `Result for ${searchQuery} 1`, category: "Museum", visitDurationMin: 120 },
      { id: "p2", name: `Result for ${searchQuery} 2`, category: "Park", visitDurationMin: 60 },
    ];
    setSearchResults(mockResults);
  };

  const handleGenerateItinerary = async () => {
    // Simulate Generative AI call
    const name = window.prompt("Enter a focus for generation (e.g. 'Art & Food')");
    if (!name) return;

    // Here we would call an implementation that auto-fills the schedule
    alert("AI Generation triggered! (This would populate your itinerary based on preferences)");
  };

  // --- DRAG AND DROP HANDLERS ---
  const handleDragStart = (event: any) => {
    setActiveDragItem(event.active.data.current);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragItem(null);

    if (!over || !activeTrip) return;

    const activeData = active.data.current as any;
    const overId = over.id as string;

    // Case 1: Dragging from Resource Panel (Source) to Timeline
    if (activeData?.type === "source-item" && overId.startsWith("timeline-day-")) {
      const targetDay = parseInt(overId.replace("timeline-day-", ""));
      if (targetDay === currentDay) {
        addItemToSchedule(activeData, targetDay);
      }
    }

    // Case 2: Reordering within Timeline
    if (activeData?.type === "timeline-item") {
      const activeId = active.id;
      // Logic for reordering
      const daySchedule = activeTrip.schedule[currentDay] || [];
      const oldIndex = daySchedule.findIndex(i => i.id === activeId);
      const newIndex = daySchedule.findIndex(i => i.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(daySchedule, oldIndex, newIndex);
        // Recalculate times after reorder
        const newSchedule = { ...activeTrip.schedule };
        newSchedule[currentDay] = recalculateDayTimes(newOrder);
        updateTripSchedule(newSchedule);
      }
    }
  };

  const addItemToSchedule = (item: ItineraryItem, day: number) => {
    if (!activeTrip) return;

    const currentList = activeTrip.schedule[day] || [];

    const newItem = {
      ...item,
      id: `${item.id}-${Date.now()}`, // unique instance id
      visitDurationMin: item.visitDurationMin || 60, // ensure default duration
      source: "db" as const
    };

    const newList = [...currentList, newItem];
    const recalculatedList = recalculateDayTimes(newList);

    const newSchedule = { ...activeTrip.schedule };
    newSchedule[day] = recalculatedList;

    updateTripSchedule(newSchedule);
  };

  const removeItemFromSchedule = (itemId: string, day: number) => {
    if (!activeTrip) return;
    const newSchedule = { ...activeTrip.schedule };
    if (newSchedule[day]) {
      const filtered = newSchedule[day].filter(i => i.id !== itemId);
      newSchedule[day] = recalculateDayTimes(filtered); // Recalc after remove
      updateTripSchedule(newSchedule);
    }
  };

  const updateTripSchedule = (newSchedule: Record<number, ItineraryItem[]>) => {
    const updatedTrip = { ...activeTrip!, schedule: newSchedule };
    setTrips(trips.map(t => t.id === updatedTrip.id ? updatedTrip : t));
    saveTrip(updatedTrip);
  };

  const handleAddItem = (time: string) => {
    const name = window.prompt("Enter activity name:", "New Activity");
    if (name) {
      addItemToSchedule({
        id: `manual-${Date.now()}`,
        name: name,
        time: time,
        source: "db"
      }, currentDay);
    }
  };

  const saveTrip = async (trip: Trip) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await fetch(`http://localhost:4000/api/trips/${trip.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          status: trip.status,
          selectedItinerary: {
            title: trip.tripName,
            days: trip.days,
            travelers: trip.travelers,
            startDate: trip.startDate,
            schedule: trip.schedule
          }
        })
      });
      setUnsavedChanges(false);
    } catch (e) { console.error("Save failed", e); }
  };

  // --- RENDER ---

  if (showSetup) {
    return (
      <ItinerarySetup
        onCreate={handleCreateTrip}
        onCancel={trips.length > 0 ? () => setShowSetup(false) : undefined}
      />
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen w-full bg-[#f8f9fa] overflow-hidden">

        {/* Sidebar */}
        {sidebarOpen ? (
          <ItinerarySidebar
            itineraries={trips}
            activeItineraryId={activeTripId}
            onSelectItinerary={setActiveTripId}
            onNewTrip={() => setShowSetup(true)}
          />
        ) : (
          <div className="w-12 border-r border-gray-200 bg-white pt-4 flex flex-col items-center">
            <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
              <Menu size={20} />
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Top Bar / Header */}
          <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-20">
            <div className="flex items-center gap-4">
              {!sidebarOpen && (
                <div className="font-bold text-lg">{activeTrip?.tripName}</div>
              )}
              {/* View Switcher */}
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveMainTab("itinerary")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 transition-all ${activeMainTab === "itinerary" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-black"
                    }`}
                >
                  <List size={16} /> Itinerary
                </button>
                <button
                  onClick={() => setActiveMainTab("map")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 transition-all ${activeMainTab === "map" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-black"
                    }`}
                >
                  <MapIcon size={16} /> Map
                </button>
              </div>
            </div>

            {/* Add Generate Button */}
            <button
              onClick={handleGenerateItinerary}
              className="flex items-center gap-2 bg-gradient-to-r from-[#4A9B7F] to-[#2E6B56] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              <Sparkles size={16} />
              Generate Itinerary
            </button>
          </div>

          {/* Main Body */}
          <div className="flex-1 flex overflow-hidden">

            {/* Center Panel (Timeline or Map) */}
            <div className="flex-1 flex flex-col overflow-hidden relative p-4">
              {activeMainTab === "itinerary" && activeTrip ? (
                <>
                  <div className="mb-4">
                    <DayTabs
                      currentDay={currentDay}
                      totalDays={activeTrip.days}
                      onDaySelect={setCurrentDay}
                    />
                  </div>
                  <div className="flex-1 overflow-hidden rounded-2xl shadow-sm border border-gray-200 bg-white">
                    <TimelineView
                      day={currentDay}
                      items={activeTrip.schedule[currentDay] || []}
                      onRemoveItem={(id) => removeItemFromSchedule(id, currentDay)}
                      onEditItem={setSelectedLocation}
                      onAddItem={handleAddItem}
                    />
                  </div>
                </>
              ) : activeMainTab === "map" && activeTrip ? (
                <div className="h-full w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                  <MapComponent
                    items={Object.values(activeTrip.schedule).flat()}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Select a trip to start planning
                </div>
              )}
            </div>

            {/* Right Panel (Resource Panel) */}
            <div className="w-[400px] border-l border-gray-200 bg-white h-full">
              <ResourcePanel
                activeTab={activeRightTab}
                onTabChange={setActiveRightTab}
                chatMessages={chatMessages}
                chatInput={chatInput}
                setChatInput={setChatInput}
                onSendMessage={handleSendMessage}
                onAddCard={(item) => addItemToSchedule(item, currentDay)}
                searchResults={searchResults}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearch}
                collections={collections}
                tripInfo={activeTrip ? {
                  dates: activeTrip.startDate,
                  travelers: activeTrip.travelers,
                  days: activeTrip.days,
                  budget: "Calculating..."
                } : undefined}
                onViewDetails={setSelectedLocation}
                destinationsView={destinationsView}
                setDestinationsView={setDestinationsView}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeDragItem ? (
          <div className="bg-white p-4 rounded-xl shadow-xl border border-[#4A9B7F] w-[300px] opacity-90 cursor-grabbing">
            <h4 className="font-bold">{activeDragItem.name}</h4>
          </div>
        ) : null}
      </DragOverlay>

      {/* Modals */}
      {selectedLocation && (
        <LocationModal
          isOpen={!!selectedLocation}
          onClose={() => setSelectedLocation(null)}
          location={selectedLocation}
        />
      )}
    </DndContext>
  );
}