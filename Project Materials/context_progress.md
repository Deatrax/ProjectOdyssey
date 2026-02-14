# Project Odyssey - Context & Progress (Phases 2-6)

## Overview
This document summarizes the significant progress made in the last 6 phases of development, focusing on the AI Planner logic, Travel Mode implementation, and Map integration.

---

## Recent Progress (Phases 2-6)

### Phase 2: Core Planner Logic
- **Drag & Drop**: Implemented multi-day drag and drop scheduling using `@dnd-kit`.
- **State Management**: Refactored `planner2/page.tsx` to handle complex state (trips, days, items) robustly.
- **Normalization**: Created `normalizeSchedule` helper to handle different data structures from AI vs Database.

### Phase 3: AI Integration & Place Resolution
- **Waterfall Resolution**: Implemented a smart "Waterfall" strategy in `ai.routes.js` to resolve place locations:
  1. **Collections**: Check user's saved collections first (Free, Instant).
  2. **Cache**: Check database cache for previously resolved places.
  3. **Google API**: Fallback to Google Geocoding API for new places (Cost-optimized).
- **Prompt Engineering**: Refined AI prompts for strict JSON output and better itinerary quality.

### Phase 4: Persistence & Chat
- **Chat History**: Implemented persisted chat history (`ChatHistory` model) linked to Trip Sessions.
- **Guest Migration**: Added logic to migrate guest chat sessions to user accounts upon login.
- **Itinerary Saving**: Full save functionality for multi-day itineraries.

### Phase 5: Map Robustness
- **Filtering**: Updated `MapComponent` to actively filter out generic AI items (e.g., "Depart Hotel") that lack location data, preventing map crashes.
- **Route Visualization**: Integrated Directions Service to draw routes between valid points.

### Phase 6: Travel Mode & Polish
- **Travel Guide (`/trip`)**: Created a dedicated verified mode for active travel.
- **Geofencing**: Implemented `useGeofencing` hook for auto-detection of arrivals.
- **Notifications**: Added Browser Notifications for "Arrived at [Place]" events.
- **Visual Feedback**: Added "Slash-out" styling for visited places and dynamic Map Markers (Blue=Active, Gray=Visited, Green=Pending).
- **Navigation**: Added "Navigate" buttons with smart deep-linking to Google Maps.

---

## Key Code Reference

### 1. Main Planner Logic (`planner2/page.tsx`)
Handles the complex drag-and-drop interface, AI interaction, and state management.

```tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragOverEvent,
  DragStartEvent,
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
import ClusteringView from "../components/ClusteringView";
import MultiOptionSelector from "../components/MultiOptionSelector";
import ConfirmationModal from "../components/ConfirmationModal";
import { VisitTrackingPanel } from "../components/visit/VisitTrackingPanel";
import { useGeofencing } from "../hooks/useGeofencing";

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
  lat?: number;
  lng?: number;
  isBreak?: boolean;
};

type Trip = {
  id: string;
  tripName: string;
  startDate?: string;
  status: "draft" | "confirmed" | "completed";
  days: number;
  travelers: number;
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

  // 4. Resource Panel State
  const [activeRightTab, setActiveRightTab] = useState<"chat" | "destinations" | "summaries" | "visits">("chat");
  const [destinationsView, setDestinationsView] = useState<"search" | "collections">("search");
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [searchResults, setSearchResults] = useState<ItineraryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [collections, setCollections] = useState<ItineraryItem[]>([]);

  // 5. Chat & AI State
  const [loading, setLoading] = useState(false);
  const [chatHistoryLoading, setChatHistoryLoading] = useState(true);

  // 6. Clustering State (Stage 1)
  const [stage, setStage] = useState<"chat" | "clustering" | "options" | "confirmation">("chat");
  const [clusteringData, setClusteringData] = useState<any>(null);
  const [clusteringLoading, setClusteringLoading] = useState(false);

  // 7. Itinerary Generation State (Stage 2)
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [itineraryOptions, setItineraryOptions] = useState<any[]>([]);
  const [selectedItinerary, setSelectedItinerary] = useState<any>(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [customRequirements, setCustomRequirements] = useState<string[]>([]);
  const [requirementInput, setRequirementInput] = useState("");

  // 8. Saved Itinerary State
  const [savedItinerary, setSavedItinerary] = useState<any>(null);
  const [savedItineraryId, setSavedItineraryId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [dayCheckboxes, setDayCheckboxes] = useState<{ [key: string]: boolean }>({});

  // 9. Visit Tracking
  const [visitCount, setVisitCount] = useState(0);

  // 10. Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationIndex, setSimulationIndex] = useState(-1);
  const [mockLocation, setMockLocation] = useState<{ lat: number; lng: number } | undefined>(undefined);

  // 11. Drag & Drop State
  const [activeDragItem, setActiveDragItem] = useState<any>(null);

  // 12. Modals
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<ItineraryItem | null>(null);

  // Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor)
  );

  // Geofencing Hook
  const { userLocation } = useGeofencing({
    itineraryId: savedItineraryId || undefined,
    enabled: !!savedItineraryId,
    autoCheckin: true,
    mockLocation: mockLocation
  });

  // --- EFFECTS ---

  // Load Trips on mount
  useEffect(() => {
    loadTrips();
    // Load collections from localStorage
    const savedCollections = JSON.parse(localStorage.getItem('odyssey_collections') || '[]');
    if (savedCollections.length > 0) {
      setCollections(savedCollections);
    }
  }, []);

  // Load chat history when active trip changes (scoped by trip ID)
  useEffect(() => {
    if (activeTripId) {
      loadChatHistory(activeTripId);
    } else {
      setChatMessages([]);
      setChatHistoryLoading(false);
    }
  }, [activeTripId]);

  // Simulation Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const allItems = activeTrip ? Object.values(activeTrip.schedule).flat() : [];

    if (isSimulating && allItems.length > 0) {
      interval = setInterval(() => {
        setSimulationIndex(prev => {
          const next = prev + 1;
          if (next >= allItems.length) {
            setIsSimulating(false);
            return prev;
          }
          const item = allItems[next];
          if (item.lat && item.lng) {
            setMockLocation({ lat: item.lat, lng: item.lng });
          }
          return next;
        });
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [isSimulating, activeTrip]);

  // --- DATA LOADERS ---

  // Normalize schedule from backend — may be array [{day, items}] or Record<number, Item[]>
  const normalizeSchedule = (raw: any, days: number): Record<number, ItineraryItem[]> => {
    const schedule: Record<number, ItineraryItem[]> = {};
    // Initialize empty days
    for (let i = 1; i <= days; i++) schedule[i] = [];

    if (Array.isArray(raw)) {
      // AI format: [{day: 1, items: [{name, category, ...}]}]
      for (const dayObj of raw) {
        const dayNum = dayObj.day || 1;
        const items = (dayObj.items || []).map((ai: any, idx: number) => ({
          id: ai.id || `loaded-${dayNum}-${idx}-${Date.now()}`,
          name: ai.name || ai.place || "Unnamed",
          placeId: ai.placeId || undefined,
          lat: ai.lat || ai.coordinates?.latitude || undefined,
          lng: ai.lng || ai.coordinates?.longitude || undefined,
          category: ai.category || ai.activity || "place",
          visitDurationMin: ai.visitDurationMin || 60,
          time: ai.time || ai.timeRange?.split("-")[0] || "09:00",
          description: ai.notes || ai.description || "",
          isBreak: ai.isBreak || false,
          source: (ai.source || "db") as "db" | "ai",
        }));
        schedule[dayNum] = items;
      }
    } else if (raw && typeof raw === "object") {
      // Record format: {"1": [...], "2": [...]}
      for (const key of Object.keys(raw)) {
        const dayNum = Number(key);
        if (isNaN(dayNum)) continue;
        const items = Array.isArray(raw[key]) ? raw[key].map((ai: any, idx: number) => ({
          id: ai.id || `loaded-${dayNum}-${idx}-${Date.now()}`,
          name: ai.name || "Unnamed",
          placeId: ai.placeId || undefined,
          lat: ai.lat || ai.coordinates?.latitude || undefined,
          lng: ai.lng || ai.coordinates?.longitude || undefined,
          category: ai.category || "place",
          visitDurationMin: ai.visitDurationMin || 60,
          time: ai.time || "09:00",
          description: ai.description || "",
          isBreak: ai.isBreak || false,
          source: (ai.source || "db") as "db" | "ai",
        })) : [];
        schedule[dayNum] = items;
      }
    }

    return schedule;
  };

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
          const loadedTrips = data.data.map((t: any) => {
            const days = t.selected_itinerary?.days || 3;
            return {
              id: t.id,
              tripName: t.trip_name,
              startDate: t.selected_itinerary?.startDate || "2024-06-01",
              days,
              travelers: t.selected_itinerary?.travelers || 1,
              status: t.status || "draft",
              schedule: normalizeSchedule(t.selected_itinerary?.schedule, days)
            };
          });
          setTrips(loadedTrips);

          if (loadedTrips.length > 0) {
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

  const loadChatHistory = async (tripId: string) => {
    setChatHistoryLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // For logged-out users, try localStorage scoped to trip
        const savedChat = localStorage.getItem(`guestChat_${tripId}`);
        if (savedChat) {
          try { setChatMessages(JSON.parse(savedChat)); }
          catch { setChatMessages([{ id: "m1", text: "Hello! Where are we going?", sender: "ai", cards: [] }]); }
        } else {
          setChatMessages([{ id: "m1", text: "Hello! Where are we going?", sender: "ai", cards: [] }]);
        }
        setChatHistoryLoading(false);
        return;
      }

      // Migrate guest chat for this trip if exists
      const guestChat = localStorage.getItem(`guestChat_${tripId}`);
      if (guestChat) {
        try {
          const parsedGuestChat = JSON.parse(guestChat);
          for (const msg of parsedGuestChat) {
            if (msg.sender && msg.text) {
              await fetch("http://localhost:4000/api/chat/message", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                  message: msg.text,
                  role: msg.sender === "user" ? "user" : "ai",
                  sessionId: tripId,
                  metadata: { cards: msg.cards || [], migratedFromGuest: true }
                })
              });
            }
          }
          await new Promise(resolve => setTimeout(resolve, 500));
          localStorage.removeItem(`guestChat_${tripId}`);
        } catch (e) { console.error("Error migrating guest chat:", e); }
      }

      // Load chat history scoped to this trip (using sessionId)
      const res = await fetch(`http://localhost:4000/api/chat/history?limit=50&sessionId=${tripId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          const msgs = data.data.map((m: any) => ({
            id: m.id,
            text: m.message,
            sender: m.role === 'user' ? 'user' : 'ai',
            cards: m.metadata?.cards || [],
            bullets: m.metadata?.bullets || []
          }));
          setChatMessages(msgs);
        } else {
          setChatMessages([{ id: "init", text: "Hello! Where are we going?", sender: "ai" }]);
        }
      } else {
        setChatMessages([{ id: "init", text: "Hello! Where are we going?", sender: "ai" }]);
      }
    } catch (e) {
      console.error("Error loading chat history:", e);
      setChatMessages([{ id: "init", text: "Hello! Where are we going?", sender: "ai" }]);
    } finally {
      setChatHistoryLoading(false);
    }
  };

  // --- HELPERS ---

  const recalculateDayTimes = (items: ItineraryItem[], startTime = "09:00"): ItineraryItem[] => {
    let currentTime = new Date(`2000-01-01T${startTime}`);
    const TRAVEL_BUFFER_MIN = 15; // Buffer between activities for travel
    return items.map((item, idx) => {
      const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      const duration = item.visitDurationMin || 60;
      currentTime.setMinutes(currentTime.getMinutes() + duration);
      // Add travel buffer between activities (not after last item, not after breaks)
      if (idx < items.length - 1 && !item.isBreak) {
        currentTime.setMinutes(currentTime.getMinutes() + TRAVEL_BUFFER_MIN);
      }
      return { ...item, time: timeStr };
    });
  };

  // Helper to safely get day items (schedule keys can be numbers or strings from backend)
  const getDayItems = (schedule: Record<number | string, ItineraryItem[]>, day: number): ItineraryItem[] => {
    const raw = schedule[day] ?? schedule[String(day)];
    return Array.isArray(raw) ? raw : [];
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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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

  // --- HANDLER: VIEW DETAILS ---
  const handleViewDetails = (item: ItineraryItem) => {
    setSelectedLocation(item);
    setLocationModalOpen(true);
  };

  // --- HANDLER: ADD TO COLLECTIONS ---
  const handleAddToCollections = (card: ItineraryItem) => {
    if (!collections.find(c => c.name === card.name)) {
      const newCollections = [...collections, { ...card, id: `col-${Date.now()}-${Math.random()}` }];
      setCollections(newCollections);
      localStorage.setItem('odyssey_collections', JSON.stringify(newCollections));
    }
  };

  // --- HANDLER: REMOVE FROM COLLECTIONS ---
  const handleRemoveFromCollections = (itemId: string) => {
    const newCollections = collections.filter(i => i.id !== itemId);
    setCollections(newCollections);
    localStorage.setItem('odyssey_collections', JSON.stringify(newCollections));
  };

  // --- HANDLER: SEND MESSAGE (AI) ---
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { id: Date.now().toString(), text: chatInput, sender: "user" };
    setChatMessages(prev => {
      const newChat = [...prev, userMsg];
      // Save to localStorage for logged-out users (scoped to trip)
      const token = localStorage.getItem("token");
      if (!token && activeTripId) {
        localStorage.setItem(`guestChat_${activeTripId}`, JSON.stringify(newChat));
      }
      return newChat;
    });
    setChatInput("");
    setLoading(true);

    // Save user message to database (scoped to trip via sessionId)
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch("http://localhost:4000/api/chat/message", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ message: userMsg.text, role: "user", sessionId: activeTripId })
        });
      } catch (err) { console.error("Error saving user message:", err); }
    }

    // Build temp history for logged-out users
    let tempConversationHistory: any[] = [];
    if (!token) {
      const recentMessages = chatMessages.slice(-10);
      tempConversationHistory = recentMessages.map(msg => ({
        message: msg.text,
        role: msg.sender === "user" ? "user" : "ai",
        created_at: new Date().toISOString()
      }));
    }

    try {
      // Check if this is a clustering request
      const lowerInput = chatInput.toLowerCase();
      const hasTripKeywords = lowerInput.includes("trip") || lowerInput.includes("itinerary");
      const hasMultiDayPlan = /\d+\s*(day|days)/.test(lowerInput);

      const hasMultipleLocations = () => {
        const hasTravelVerb = lowerInput.includes('plan') || lowerInput.includes('visit') ||
          lowerInput.includes('travel') || lowerInput.includes('explore');
        if (!hasTravelVerb) return false;
        const commaCount = (chatInput.match(/,/g) || []).length;
        const hasAndSeparator = lowerInput.match(/\s+and\s+/g);
        const separatorCount = commaCount + (hasAndSeparator ? hasAndSeparator.length : 0);
        return separatorCount >= 1;
      };

      const isClusteringRequest = hasTripKeywords || hasMultiDayPlan || hasMultipleLocations();

      if (isClusteringRequest) {
        setClusteringLoading(true);
        const clusterRes = await fetch("http://localhost:4000/api/clustering/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
          body: JSON.stringify({ message: userMsg.text, userContext: { budget: "medium", pace: "moderate" } })
        });

        if (clusterRes.ok) {
          const clusterData = await clusterRes.json();
          setClusteringData(clusterData.data);
          setStage("clustering");

          const aiMessage = "I've analyzed your request and found these place clusters. Select the ones you'd like to visit!";
          setChatMessages(prev => {
            const newChat = [...prev, { id: Date.now().toString() + "ai", text: aiMessage, sender: "ai", cards: [], hasClustering: true }];
            if (!token && activeTripId) localStorage.setItem(`guestChat_${activeTripId}`, JSON.stringify(newChat));
            return newChat;
          });

          if (token) {
            try {
              await fetch("http://localhost:4000/api/chat/message", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ message: aiMessage, role: "ai", sessionId: activeTripId })
              });
            } catch (err) { console.error("Error saving AI message:", err); }
          }

          setClusteringLoading(false);
          setLoading(false);
          return;
        }
      }

      // Regular chat flow
      const res = await fetch("http://localhost:4000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify({
          message: userMsg.text,
          collections,
          itinerary: activeTrip ? Object.values(activeTrip.schedule).flat() : [],
          conversationHistory: tempConversationHistory
        })
      });

      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }

      const data = await res.json();

      let aiCards: ItineraryItem[] = [];
      if (data.cards) aiCards = [...aiCards, ...data.cards];
      if (data.itineraryPreview?.days) {
        data.itineraryPreview.days.forEach((day: any) => {
          if (day.items) {
            day.items.forEach((item: any) => {
              aiCards.push({
                ...item,
                id: `ai-${Date.now()}-${Math.random()}`,
                description: `Day ${day.day} - ${item.time || 'Visit'}`,
                source: "ai"
              });
            });
          }
        });
      }

      const aiMessage = data.message || data.reply || "Here is a plan for you.";
      setChatMessages(prev => {
        const newChat = [...prev, { id: Date.now().toString() + "ai", text: aiMessage, sender: "ai", cards: aiCards, bullets: data.bullets || [] }];
        if (!token && activeTripId) localStorage.setItem(`guestChat_${activeTripId}`, JSON.stringify(newChat));
        return newChat;
      });

      // Save AI response to backend
      if (token && activeTripId) {
        try {
          await fetch("http://localhost:4000/api/chat/message", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ message: aiMessage, role: "ai", sessionId: activeTripId, metadata: { cards: aiCards, bullets: data.bullets || [] } })
          });
        } catch (err) { console.error("Error saving AI response:", err); }
      }

    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { id: "err", text: "Error connecting to AI.", sender: "ai" }]);
    } finally {
      setLoading(false);
      setClusteringLoading(false);
    }
  };

  // --- HANDLER: Clustering Continue (Stage 1 → Stage 2) ---
  const handleClusteringContinue = (selectedPlaces: any[]) => {
    const newPlaces = selectedPlaces.map((place: any) => ({
      id: `cluster-${Date.now()}-${Math.random()}`,
      name: place.name,
      category: place.category,
      source: "ai" as const
    }));
    setCollections(prev => {
      const updated = [...prev, ...newPlaces];
      localStorage.setItem('odyssey_collections', JSON.stringify(updated));
      return updated;
    });

    setChatMessages(prev => [...prev, {
      id: Date.now().toString() + "ai",
      text: `Great! I've added ${selectedPlaces.length} place(s) to your collection. Drag and drop them into your itinerary, then click "Generate Itineraries" to see multiple options!`,
      sender: "ai", cards: []
    }]);

    setStage("chat");
    setClusteringData(null);
  };

  // --- HANDLER: Generate Itineraries (Stage 2) ---
  const handleGenerateItineraries = async () => {
    if (collections.length === 0) {
      alert("Please add places to your collections first!");
      return;
    }

    setOptionsLoading(true);
    setStage("options");

    try {
      setChatMessages(prev => [...prev, {
        id: Date.now().toString() + "thinking",
        text: "Generating itineraries based on your collections...",
        sender: "ai", cards: []
      }]);

      const res = await fetch("http://localhost:4000/api/ai/generateItineraries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedPlaces: collections.map(item => ({
            name: item.name,
            category: item.category || "place",
            placeId: item.placeId || undefined,
            lat: item.lat || undefined,
            lng: item.lng || undefined
          })),
          tripDuration: activeTrip?.days || 3,
          userContext: { budget: "medium", pace: "moderate" },
          customRequirements: customRequirements.length > 0 ? customRequirements.join(" | ") : undefined
        })
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to generate itineraries");
      setItineraryOptions(data.data.itineraries);

      setChatMessages(prev => [...prev, {
        id: Date.now().toString() + "options",
        text: `Perfect! I've created 3 itinerary options for you. Review them below and select your preferred option!`,
        sender: "ai", cards: []
      }]);
    } catch (err) {
      console.error(err);
      alert("Error generating itineraries: " + (err as any).message);
      setStage("chat");
    } finally {
      setOptionsLoading(false);
    }
  };

  // --- HANDLER: Confirm & Save Itinerary ---
  const handleConfirmItinerary = async (finalTripName: string) => {
    if (!selectedItinerary) { alert("No itinerary selected"); return; }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        const confirmRedirect = confirm("You need to login to save your itinerary.\n\nClick OK to go to login.");
        if (confirmRedirect) router.push("/login?from=planner2");
        return;
      }

      const allItems = activeTrip ? Object.values(activeTrip.schedule).flat() : [];
      const tripData = {
        tripName: finalTripName || activeTrip?.tripName || "My Trip",
        selectedPlaces: allItems.map(item => ({
          id: item.id, name: item.name, category: item.category || "place", placeId: item.placeId,
          coordinates: item.lat && item.lng ? { latitude: item.lat, longitude: item.lng } : null
        })),
        selectedItinerary: {
          id: selectedItinerary.id, title: selectedItinerary.title,
          description: selectedItinerary.description, paceDescription: selectedItinerary.paceDescription,
          estimatedCost: selectedItinerary.estimatedCost, schedule: selectedItinerary.schedule
        },
        status: "draft"
      };

      const res = await fetch("http://localhost:4000/api/trips/save", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(tripData)
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save trip");

      const itineraryId = data.data.id;
      setSavedItineraryId(itineraryId);
      setSavedItinerary({
        id: itineraryId,
        tripName: finalTripName || activeTrip?.tripName || "My Trip",
        title: tripData.selectedItinerary.title,
        description: tripData.selectedItinerary.description,
        paceDescription: tripData.selectedItinerary.paceDescription,
        estimatedCost: tripData.selectedItinerary.estimatedCost,
        schedule: tripData.selectedItinerary.schedule
      });

      // --- Merge AI schedule into local trip timeline ---
      if (activeTrip && selectedItinerary.schedule && Array.isArray(selectedItinerary.schedule)) {
        // Build a lookup of original items by normalized name for placeId/coords injection
        // Include both current timeline items AND collections (since generation now uses collections)
        const timelineItems = Object.values(activeTrip.schedule).flat();
        const originalItems = [...timelineItems, ...collections];
        
        const originalLookup = new Map<string, ItineraryItem>();
        for (const item of originalItems) {
          if (item.name) originalLookup.set(item.name.toLowerCase().trim(), item);
        }

        const newSchedule: Record<number, ItineraryItem[]> = {};
        for (const dayObj of selectedItinerary.schedule) {
          const dayNum = dayObj.day || 1;
          const items: ItineraryItem[] = (dayObj.items || []).map((ai: any, idx: number) => {
            const aiName = (ai.name || ai.place || "Unnamed").toLowerCase().trim();
            const original = originalLookup.get(aiName);
            return {
              id: `ai-${dayNum}-${idx}-${Date.now()}`,
              name: ai.name || ai.place || "Unnamed",
              placeId: ai.placeId || original?.placeId || undefined,
              lat: ai.lat || original?.lat || undefined,
              lng: ai.lng || original?.lng || undefined,
              category: ai.category || ai.activity || "place",
              visitDurationMin: ai.visitDurationMin || original?.visitDurationMin || 60,
              time: ai.timeRange?.split("-")[0] || "09:00",
              description: ai.notes || "",
              source: "ai" as const,
            };
          });
          newSchedule[dayNum] = recalculateDayTimes(items);
        }
        updateTripSchedule(newSchedule);
      }

      setChatMessages(prev => [...prev, {
        id: Date.now().toString() + "saved",
        text: `✅ Trip saved successfully! Trip ID: ${itineraryId}. The itinerary has been placed in your timeline.`,
        sender: "ai", cards: []
      }]);

      setConfirmationOpen(false);
      setStage("chat");
      setSelectedItinerary(null);
      setItineraryOptions([]);
    } catch (err) {
      console.error("Error saving trip:", err);
      alert(`Error saving trip: ${(err as any).message}`);
    }
  };

  // --- HANDLER: Edit & Regenerate ---
  const handleEditAndRegenerate = () => {
    setConfirmationOpen(false);
    setStage("chat");
    setItineraryOptions([]);
    setSelectedItinerary(null);
    setCustomRequirements([]);
    setChatMessages(prev => [...prev, {
      id: Date.now().toString() + "edit",
      text: "Great! You can now:\n1. Add or remove places from your itinerary\n2. Add custom requirements\n\nWhen ready, click 'Generate Itineraries' again!",
      sender: "ai", cards: []
    }]);
  };

  // --- HANDLER: Custom Requirements ---
  const handleAddRequirement = () => {
    if (requirementInput.trim()) {
      setCustomRequirements(prev => [...prev, requirementInput.trim()]);
      setRequirementInput("");
    }
  };

  // --- HELPER to update local trip schedule with new state ---
  const updateTripSchedule = (newSchedule: Record<number, ItineraryItem[]>) => {
    setTrips(prev => prev.map(t => {
      if (t.id === activeTripId) {
        return { ...t, schedule: newSchedule };
      }
      return t;
    }));
  };

  // Drag & drop logic omitted for brevity in this summary
  // ...

  return (
    // Only showing structure hook usage...
    <DndContext /* ... */>
      {/* Sidebar, Timeline, Map etc */}
    </DndContext>
  );
}
```

### 2. Travel Mode (`trip/page.tsx`)
The user-facing guide for active trips.

```tsx
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
                                                    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                                                </svg>
                                                Navigate
                                            </a>

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
                      items={currentDayItems.filter((i:any) => (i.placeId || (i.lat && i.lng)) && !i.isBreak)} 
                      userLocation={userLocation}
                      geofences={currentDayItems
                        .filter((i:any) => i.lat && i.lng && !i.isBreak)
                        .map((i:any) => {
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
```

### 3. AI Server Routes (`ai.routes.js`)
Handles backend AI logic, includes the critical enrichment pipeline.

```javascript
/* Partial inclusion of key functions */

// ... (Router setup and prompts)

/**
 * POST /api/ai/generateItineraries
 */
router.post("/generateItineraries", async (req, res) => {
  try {
    const { selectedPlaces, tripDuration, userContext, customRequirements } = req.body;

    // ... (Validation)

    // ... (Call Gemini for Initial Itinerary JSON)

    // -------------------------------------------------------------------------
    // ENRICHMENT STEP: Resolve place locations (Collections -> Cache -> API)
    // -------------------------------------------------------------------------
    async function enrichItineraryWithLocations(itineraries, sourcePlaces) {
      // 1. Build a lookup map from source places (Collections) - FREE
      const sourceLookup = new Map();
      if (Array.isArray(sourcePlaces)) {
        sourcePlaces.forEach(p => {
          if (p.name) sourceLookup.set(p.name.toLowerCase().trim(), p);
        });
      }

      // 2. Collect all items needing resolution
      const itemsToResolve = [];
      const placeNamesToResolve = new Set();

      for (const itinerary of itineraries) {
        if (!itinerary.schedule) continue;
        for (const day of itinerary.schedule) {
          if (!day.items) continue;
          for (const item of day.items) {
            const nameKey = (item.place || item.name || "").toLowerCase().trim();
            if (!nameKey) continue;

            const sourceMatch = sourceLookup.get(nameKey);
            if (sourceMatch && sourceMatch.placeId) {
              // Exact match from collections - copy details
              item.placeId = sourceMatch.placeId;
              item.lat = sourceMatch.lat || sourceMatch.coordinates?.latitude;
              item.lng = sourceMatch.lng || sourceMatch.coordinates?.longitude;
            } else {
              // Needs resolution
              itemsToResolve.push(item);
              placeNamesToResolve.add(nameKey);
            }
          }
        }
      }

      // 3. Batch resolve unique missing names
      const uniqueNames = Array.from(placeNamesToResolve);
      console.log(`AI Itinerary: ${uniqueNames.length} places to resolve not in collections.`);

      if (uniqueNames.length === 0) return itineraries;

      // Rate limit concurrent API calls
      const RESOLUTION_LIMIT = 10; 
      const namesToProcess = uniqueNames.slice(0, RESOLUTION_LIMIT);

      const resolvedMap = new Map();

      await Promise.all(namesToProcess.map(async (name) => {
        try {
          // Try exact name geocoding
          const result = await googleMapsService.geocode(name);
          if (result) {
            resolvedMap.set(name, result);
          }
        } catch (e) {
          console.error(`Failed to resolve place '${name}':`, e.message);
        }
      }));

      // 4. Apply resolved data back to items
      for (const item of itemsToResolve) {
        const nameKey = (item.place || item.name || "").toLowerCase().trim();
        const resolved = resolvedMap.get(nameKey);
        if (resolved) {
          item.placeId = resolved.placeId;
          item.lat = resolved.coordinates.lat;
          item.lng = resolved.coordinates.lng;
        }
      }

      return itineraries;
    }

    const startEnrich = Date.now();
    const enrichedItineraries = await enrichItineraryWithLocations(
      multiItineraryJson.itineraries,
      selectedPlaces
    );
    
    // ... (Return API response)

  } catch (err) {
    // ...
  }
});

module.exports = router;
```

### 4. Map Component (`MapComponent.tsx`)
Updated to filter generic items and handle geofence rendering.

```tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  APIProvider,
  Map,
  useMapsLibrary,
  useMap,
  AdvancedMarker,
  Pin,
  InfoWindow
} from "@vis.gl/react-google-maps";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

// ... (Props and marker components)

function Directions({ items }: { items: any[] }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();

  // Use Maps Library...

  useEffect(() => {
    if (!directionsService || !directionsRenderer || items.length < 2) {
      return;
    }

    // Filter valid locations for Routing
    // MUST have placeId OR coordinates. Pure names are risky.
    const validItems = items.filter(item => 
      !item.isBreak && 
      (item.placeId || (item.lat && item.lng))
    );

    if (validItems.length < 2) {
      directionsRenderer.setMap(null);
      return;
    }

    // Call directionsService.route()...
    // Set directionsRenderer map...

    return () => {
      directionsRenderer.setMap(null);
    };
  }, [directionsService, directionsRenderer, items]);

  return null;
}

export default function MapComponent({ items, onClose, userLocation, geofences = [] }: MapComponentProps) {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Filter items that have at least a name
  const validItems = useMemo(() => items.filter(i => i.name), [items]);

  const initialCenter = userLocation || (validItems.length > 0 && validItems[0].lat && validItems[0].lng ? { lat: validItems[0].lat, lng: validItems[0].lng } : { lat: 23.9482, lng: 90.3794 });

  if (!GOOGLE_MAPS_API_KEY) {
    return <div className="p-4 text-red-500">Error: Google Maps API Key is missing.</div>;
  }

  return (
    <div className="w-full h-full relative flex flex-col">
       {/* UI Controls */}
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={initialCenter}
          defaultZoom={15}
          mapId="DEMO_MAP_ID" 
          className="w-full h-full"
          fullscreenControl={false}
        >
          {/* Helper Components */}
          <MapUpdater center={userLocation} />
          <CenterControl center={userLocation} disabled={!userLocation} />

          {/* Render Markers */}
          {validItems.map((item, index) => (
            <AdvancedMarkerWithRef
              key={item.id || index}
              item={item}
              index={index}
              onClick={() => setSelectedItem(item)}
            />
          ))}

          {/* Directions */}
          <Directions items={validItems} />

          {/* User Location */}
          {userLocation && <UserLocationMarker position={userLocation} />}

          {/* Render Geofences */}
          {geofences.map((geo, idx) => (
            <GeofenceCircle key={idx} center={{ lat: geo.lat, lng: geo.lng }} radius={geo.radius} color={geo.color} />
          ))}

          {/* Info Window */}
          {selectedItem && (
             <InfoWindow /* ... */ />
          )}
        </Map>
      </APIProvider>
    </div>
  );
}
```
