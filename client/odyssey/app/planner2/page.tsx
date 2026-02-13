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
          const loadedTrips = data.data.map((t: any) => ({
            id: t.id,
            tripName: t.trip_name,
            startDate: t.selected_itinerary?.startDate || "2024-06-01",
            days: t.selected_itinerary?.days || 3,
            travelers: t.selected_itinerary?.travelers || 1,
            status: t.status || "draft",
            schedule: t.selected_itinerary?.schedule || {}
          }));
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
    return items.map(item => {
      const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
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
    const allItems = activeTrip ? Object.values(activeTrip.schedule).flat() : [];
    if (allItems.length === 0) {
      alert("Please add places to your itinerary first!");
      return;
    }

    setOptionsLoading(true);
    setStage("options");

    try {
      setChatMessages(prev => [...prev, {
        id: Date.now().toString() + "thinking",
        text: "Odyssey is generating 3 different itinerary options for you...",
        sender: "ai", cards: []
      }]);

      const res = await fetch("http://localhost:4000/api/ai/generateItineraries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedPlaces: allItems.map(item => ({ name: item.name, category: item.category || "place" })),
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

      setChatMessages(prev => [...prev, {
        id: Date.now().toString() + "saved",
        text: `✅ Trip saved successfully! Trip ID: ${itineraryId}. You can view it in your dashboard.`,
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
  const handleRemoveRequirement = (index: number) => {
    setCustomRequirements(prev => prev.filter((_, i) => i !== index));
  };

  // --- HANDLER: Search ---
  const handleSearch = async () => {
    // TODO: integrate real search API
    const mockResults: ItineraryItem[] = [
      { id: "p1", name: `Result for ${searchQuery} 1`, category: "Museum", visitDurationMin: 120 },
      { id: "p2", name: `Result for ${searchQuery} 2`, category: "Park", visitDurationMin: 60 },
    ];
    setSearchResults(mockResults);
  };

  // --- SIMULATION ---
  const startSimulation = () => {
    const allItems = activeTrip ? Object.values(activeTrip.schedule).flat() : [];
    if (allItems.length === 0) return;
    setIsSimulating(true);
    setSimulationIndex(-1);
  };
  const stopSimulation = () => {
    setIsSimulating(false);
    setMockLocation(undefined);
  };

  // --- DRAG AND DROP HANDLERS ---
  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragItem(event.active.data.current);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragItem(null);

    if (!over || !activeTrip) return;

    const activeData = active.data.current as any;
    const overId = over.id as string;

    // Case 1: Dragging from Resource Panel to Timeline
    if (activeData?.type === "source-item" && overId.startsWith("timeline-day-")) {
      const targetDay = parseInt(overId.replace("timeline-day-", ""));
      if (targetDay === currentDay) {
        addItemToSchedule(activeData, targetDay);
      }
    }

    // Case 2: Reordering within Timeline
    if (activeData?.type === "timeline-item") {
      const activeId = active.id;
      const daySchedule = activeTrip.schedule[currentDay] || [];
      const oldIndex = daySchedule.findIndex(i => i.id === activeId);
      const newIndex = daySchedule.findIndex(i => i.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(daySchedule, oldIndex, newIndex);
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
      id: `${item.id}-${Date.now()}`,
      visitDurationMin: item.visitDurationMin || 60,
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
      newSchedule[day] = recalculateDayTimes(filtered);
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
      addItemToSchedule({ id: `manual-${Date.now()}`, name, time, source: "db" }, currentDay);
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

  const allTripItems = activeTrip ? Object.values(activeTrip.schedule).flat() : [];

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

          {/* Top Bar */}
          <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-20">
            <div className="flex items-center gap-4">
              {!sidebarOpen && (
                <div className="font-bold text-lg">{activeTrip?.tripName}</div>
              )}
              {/* View Switcher */}
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveMainTab("itinerary")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 transition-all ${activeMainTab === "itinerary" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-black"}`}
                >
                  <List size={16} /> Itinerary
                </button>
                <button
                  onClick={() => setActiveMainTab("map")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 transition-all ${activeMainTab === "map" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-black"}`}
                >
                  <MapIcon size={16} /> Map
                </button>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateItineraries}
              disabled={allTripItems.length === 0 || optionsLoading}
              className={`flex items-center gap-2 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all ${
                allTripItems.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-[#4A9B7F] to-[#2E6B56]"
              }`}
              title={allTripItems.length === 0 ? "Add places to itinerary first" : "Generate 3 itinerary options"}
            >
              <Sparkles size={16} />
              {optionsLoading ? "Generating..." : "Generate Itineraries"}
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
                      onEditItem={handleViewDetails}
                      onAddItem={handleAddItem}
                    />
                  </div>
                </>
              ) : activeMainTab === "map" && activeTrip ? (
                <div className="h-full w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200 relative">
                  <MapComponent
                    items={allTripItems}
                    userLocation={userLocation}
                    geofences={allTripItems.filter((i: any) => i.lat && i.lng).map((i: any) => ({
                      lat: i.lat, lng: i.lng, radius: 100, color: "#22c55e"
                    }))}
                    onClose={() => setActiveMainTab("itinerary")}
                  />
                  {/* Simulation Controls Overlay */}
                  <div className="absolute bottom-6 left-6 z-10 bg-white p-3 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${isSimulating ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                      <span className="text-sm font-medium">Simulation Mode</span>
                      <button
                        onClick={isSimulating ? stopSimulation : startSimulation}
                        className={`px-3 py-1 rounded-md text-sm font-bold text-white transition-colors ${
                          isSimulating ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                      >
                        {isSimulating ? "Stop" : "Start Travel"}
                      </button>
                    </div>
                    {isSimulating && (
                      <div className="mt-2 text-xs text-gray-500">
                        Visiting place {simulationIndex + 1} of {allTripItems.length}
                      </div>
                    )}
                  </div>
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
                onAddToCollections={handleAddToCollections}
                searchResults={searchResults}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearch}
                collections={collections}
                onRemoveFromCollections={handleRemoveFromCollections}
                tripInfo={activeTrip ? {
                  dates: activeTrip.startDate,
                  travelers: activeTrip.travelers,
                  days: activeTrip.days,
                  budget: "Calculating..."
                } : undefined}
                onViewDetails={handleViewDetails}
                destinationsView={destinationsView}
                setDestinationsView={setDestinationsView}
                // AI Stage Props
                loading={loading}
                chatHistoryLoading={chatHistoryLoading}
                stage={stage}
                clusteringData={clusteringData}
                clusteringLoading={clusteringLoading}
                onClusteringContinue={handleClusteringContinue}
                onClusteringCancel={() => setStage("chat")}
                itineraryOptions={itineraryOptions}
                onSelectItineraryOption={(option: any) => { setSelectedItinerary(option); setConfirmationOpen(true); }}
                // Custom Requirements
                customRequirements={customRequirements}
                requirementInput={requirementInput}
                onRequirementInputChange={setRequirementInput}
                onAddRequirement={handleAddRequirement}
                onRemoveRequirement={handleRemoveRequirement}
                // Visit Tracking
                visitCount={visitCount}
                savedItinerary={savedItinerary}
                savedItineraryId={savedItineraryId}
                onVisitChange={setVisitCount}
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
      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        data={selectedLocation}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationOpen}
        itinerary={selectedItinerary}
        tripName={activeTrip?.tripName || ""}
        onConfirm={handleConfirmItinerary}
        onClose={() => setConfirmationOpen(false)}
        onEdit={handleEditAndRegenerate}
      />
    </DndContext>
  );
}