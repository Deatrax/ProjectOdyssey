"use client";

import { useState, useRef, useEffect } from "react";
import {
  DndContext,
  useDroppable,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  MeasuringStrategy,
  DragOverEvent,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  CollisionDetection,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "next/navigation";
import LocationModal from "../components/LocationModal"; // Import the modal
import ClusteringView from "../components/ClusteringView"; // Import clustering view
import MultiOptionSelector from "../components/MultiOptionSelector"; // Import multi-option selector
import ConfirmationModal from "../components/ConfirmationModal"; // Import confirmation modal

// --- TYPES (Updated to include data for Modal) ---
type Item = {
  id: string;                 
  placeId?: string;           
  name: string;               // Map 'text' to 'name'
  text?: string;              // Keep 'text' for compatibility with your UI
  description?: string;
  category?: string;
  visitDurationMin?: number;
  time?: string;
  images?: string[];
  reviews?: any[];
  source?: "db" | "ai";
};

type ActiveTab = "chat" | "destinations" | "summaries";
type DestinationsView = "search" | "collections";

/* -------------------- Custom Collision Logic (YOUR ORIGINAL) -------------------- */
const customCollisionStrategy: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) return pointerCollisions;
  return rectIntersection(args);
};

/* -------------------- Sortable Item (MODIFIED: Added Info Button) -------------------- */
function SortableItem({
  id,
  text,
  isIndicatorBefore,
  onAction,
  actionType = "remove",
  disabled = false,
  // New props
  itemData,
  onViewDetails 
}: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      // This class ensures your original styling works
      className={`sortable-item ${isDragging ? "z-50" : ""}`}
    >
      <div style={{ 
        padding: "12px", 
        background: "#fff", 
        borderRadius: "12px", 
        marginBottom: "10px", 
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        position: "relative"
      }}>
        {/* Drop Indicator Logic */}
        {isIndicatorBefore !== undefined && (
          <div style={{
            position: "absolute",
            left: 0, right: 0,
            height: "2px",
            background: "#22c55e",
            transition: "all 0.2s",
            top: isIndicatorBefore ? "-6px" : "auto",
            bottom: isIndicatorBefore ? "auto" : "-6px"
          }} />
        )}

        {/* --- MAIN CARD CONTENT (Draggable) --- */}
        <div 
          style={{ flex: 1, cursor: disabled ? "default" : "grab", display: "flex", flexDirection: "column" }}
          {...attributes} 
          {...listeners}
        >
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#1f2937" }}>{text}</span>
          
          {/* Optional: Show tiny details below name */}
          {itemData?.category && (
             <span style={{ fontSize: "10px", color: "#9ca3af", textTransform: "uppercase", marginTop: "2px" }}>
               {itemData.category} {itemData.visitDurationMin ? `• ${itemData.visitDurationMin}m` : ""}
             </span>
          )}
        </div>

        {/* --- BUTTON GROUP --- */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          
          {/* 1. INFO BUTTON (New) */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Don't trigger drag
              if (onViewDetails) onViewDetails(itemData);
            }}
            onPointerDown={(e) => e.stopPropagation()} // Don't start drag
            style={{
              background: "#eff6ff",
              color: "#3b82f6",
              border: "1px solid #dbeafe",
              borderRadius: "50%",
              width: "24px", 
              height: "24px",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "bold"
            }}
            title="View Details"
          >
            i
          </button>

          {/* 2. ACTION BUTTON (Add/Remove) */}
          {onAction && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction(id);
              }}
              onPointerDown={(e) => e.stopPropagation()} // Don't start drag
              style={{
                background: actionType === "add" ? "#ecfdf5" : "#fef2f2",
                color: actionType === "add" ? "#059669" : "#dc2626",
                border: "none",
                borderRadius: "50%",
                width: "24px", 
                height: "24px",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              {actionType === "add" ? "+" : "×"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------- Column Component (YOUR ORIGINAL + Prop passing) -------------------- */
function Column({ id, items, actionType, onActionItem, dropIndicatorIndex, transparent, isSortable = true, onViewDetails }: any) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        background: transparent ? "transparent" : "rgba(255,255,255,0.5)",
        borderRadius: "16px",
        border: transparent ? "none" : "2px dashed #d1d5db",
        transition: "background 0.2s"
      }}
    >
      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }} className="custom-scrollbar">
        {isSortable ? (
          <SortableContext items={items.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
            {items.map((item: any, index: number) => (
              <SortableItem
                key={item.id}
                id={item.id}
                text={item.name} // Display Name
                itemData={item}  // Pass full object
                actionType={actionType}
                onAction={onActionItem}
                onViewDetails={onViewDetails} // Pass down function
                isIndicatorBefore={
                  dropIndicatorIndex === index ? true :
                  dropIndicatorIndex === index + 1 ? false : undefined
                }
              />
            ))}
          </SortableContext>
        ) : (
          // Non-sortable items (e.g., search results)
          items.map((item: any) => (
            <SortableItem
              key={item.id}
              id={item.id}
              text={item.name}
              itemData={item}
              actionType={actionType}
              onAction={onActionItem}
              onViewDetails={onViewDetails}
              disabled={true}
            />
          ))
        )}
        
        {items.length === 0 && !transparent && (
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: "14px", fontStyle: "italic" }}>
            Drop items here
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------- Chat Column (Updated for Cards) -------------------- */
function ChatColumn({ messages, chatInput, setChatInput, onSendMessage, onAddCard, onViewDetails, loading }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "10px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {messages.map((msg: any) => (
          <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: msg.sender === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "85%",
              padding: "12px 16px",
              borderRadius: "16px",
              borderTopLeftRadius: msg.sender === "ai" ? "4px" : "16px",
              borderTopRightRadius: msg.sender === "user" ? "4px" : "16px",
              background: msg.sender === "user" ? "#1f2937" : "#ffffff",
              color: msg.sender === "user" ? "#ffffff" : "#1f2937",
              fontSize: "14px",
              lineHeight: "1.5",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
            }}>
              {msg.text}
            </div>
            
            {/* RENDER AI CARDS */}
            {msg.cards && msg.cards.length > 0 && (
              <div style={{ marginTop: "10px", width: "90%" }}>
                {msg.cards.map((card: any) => (
                  <SortableItem 
                    key={card.id} 
                    id={card.id} 
                    text={card.name} 
                    itemData={card}
                    actionType="add" 
                    onAction={() => onAddCard(card)} // Add to collections
                    onViewDetails={onViewDetails}    // View details
                    disabled={true}                  // Chat items are fixed
                  />
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && <div style={{ fontSize: "12px", color: "#9ca3af", padding: "10px" }}>Odyssey is writing...</div>}
      </div>

      <form onSubmit={onSendMessage} style={{ padding: "10px", background: "#fff", borderTop: "1px solid #e5e7eb" }}>
        <div style={{ position: "relative" }}>
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask Odyssey..."
            style={{ width: "100%", padding: "12px 40px 12px 16px", borderRadius: "99px", background: "#f3f4f6", border: "none", outline: "none", fontSize: "14px" }}
          />
          <button type="submit" style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", width: "28px", height: "28px", borderRadius: "50%", background: "#000", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            ↑
          </button>
        </div>
      </form>
    </div>
  );
}

/* -------------------- MAIN PAGE -------------------- */
export default function PlannerPage() {
  const router = useRouter();

  // --- STATE ---
  const [tripName, setTripName] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("chat");
  const [destinationsView, setDestinationsView] = useState<DestinationsView>("search");
  
  // Clustering State (NEW - Stage 1)
  const [stage, setStage] = useState<"chat" | "clustering" | "options" | "confirmation">("chat");
  const [clusteringData, setClusteringData] = useState<any>(null);
  const [clusteringLoading, setClusteringLoading] = useState(false);
  const [selectedPlacesFromClustering, setSelectedPlacesFromClustering] = useState<any[]>([]);
  
  // Itinerary Generation State (NEW - Stage 2)
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [itineraryOptions, setItineraryOptions] = useState<any[]>([]);
  const [selectedItinerary, setSelectedItinerary] = useState<any>(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [customRequirements, setCustomRequirements] = useState<string[]>([]);
  const [requirementInput, setRequirementInput] = useState("");
  
  const [itinerary, setItinerary] = useState<Item[]>([]);
  const [collections, setCollections] = useState<Item[]>([
    { id: "c1", name: "Louvre Museum", category: "museum" },
    { id: "c2", name: "Eiffel Tower", category: "urban" }
  ]);
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  
  const [chat, setChat] = useState<any[]>([
    { id: "m1", text: "Hello! Where are we going?", sender: "ai", cards: [] }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  // Drag State
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{ column: string; index: number } | null>(null);

  // Modal State (NEW)
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Item | null>(null);

  // --- HANDLER: OPEN MODAL ---
  const handleViewDetails = (item: Item) => {
    setSelectedLocation(item);
    setModalOpen(true);
  };

  // --- HANDLER: ADD TO COLLECTIONS ---
  const handleAddToCollections = (card: Item) => {
    // Avoid duplicates
    if (!collections.find(c => c.name === card.name)) {
      setCollections(prev => [...prev, { ...card, id: `col-${Date.now()}-${Math.random()}` }]);
    }
  };

  // --- HANDLER: SAVE TRIP ---
  const handleSaveTrip = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please login to save.");
        router.push("/login");
        return;
    }
    try {
        const res = await fetch("http://localhost:4000/api/trips", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({ name: tripName, itinerary, collections })
        });
        if(res.ok) {
            alert("Trip Saved Successfully!");
        } else {
            alert("Failed to save trip.");
        }
    } catch(e) { console.error(e); }
  };

  // --- HANDLER: SEND MESSAGE (AI) ---
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { id: Date.now().toString(), text: chatInput, sender: "user" };
    setChat(prev => [...prev, userMsg]);
    setChatInput("");
    setLoading(true);

    try {
      // Check if this is a clustering request (trip planning keywords)
      const isClusteringRequest = chatInput.toLowerCase().includes("trip") || 
                                  chatInput.toLowerCase().includes("plan") || 
                                  chatInput.toLowerCase().includes("day") ||
                                  chatInput.toLowerCase().includes("itinerary");

      if (isClusteringRequest) {
        // Call clustering endpoint
        setClusteringLoading(true);
        const clusterRes = await fetch("http://localhost:4000/api/clustering/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            message: userMsg.text,
            userContext: { budget: "medium", pace: "moderate" }
          })
        });

        if (clusterRes.ok) {
          const clusterData = await clusterRes.json();
          setClusteringData(clusterData.data);
          setStage("clustering");
          
          // Add AI response to chat
          setChat(prev => [...prev, {
            id: Date.now().toString() + "ai",
            text: "I've analyzed your request and found these place clusters. Select the ones you'd like to visit!",
            sender: "ai",
            cards: []
          }]);
          setClusteringLoading(false);
          setLoading(false);
          return;
        }
      }

      // Regular chat flow (existing)
      const res = await fetch("http://localhost:4000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text, collections, itinerary })
      });
      const data = await res.json();

      // PARSE THE AI RESPONSE
      let aiCards: Item[] = [];
      
      // 1. Direct cards
      if (data.cards) aiCards = [...aiCards, ...data.cards];
      
      // 2. Itinerary Preview (Nested days)
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

      setChat(prev => [...prev, {
        id: Date.now().toString() + "ai",
        text: data.message || data.reply || "Here is a plan for you.",
        sender: "ai",
        cards: aiCards
      }]);

    } catch (err) {
      console.error(err);
      setChat(prev => [...prev, { id: "err", text: "Error connecting to AI.", sender: "ai" }]);
    } finally {
      setLoading(false);
      setClusteringLoading(false);
    }
  };

  // --- HANDLER: Clustering Continue (Stage 1 → Stage 2) ---
  const handleClusteringContinue = (selectedPlaces: any[]) => {
    setSelectedPlacesFromClustering(selectedPlaces);
    // Add selected places to collections for drag-drop
    const newPlaces = selectedPlaces.map((place: any) => ({
      id: `cluster-${Date.now()}-${Math.random()}`,
      name: place.name,
      category: place.category,
      source: "ai" as const
    }));
    setCollections(prev => [...prev, ...newPlaces]);
    
    // Show next step message in chat
    setChat(prev => [...prev, {
      id: Date.now().toString() + "ai",
      text: `Great! I've added ${selectedPlaces.length} place(s) to your collection. Drag and drop them into your itinerary, then click "Generate Itineraries" to see multiple options!`,
      sender: "ai",
      cards: []
    }]);
    
    // Reset clustering
    setStage("chat");
    setClusteringData(null);
  };

  // --- HANDLER: Generate Itineraries (Stage 2) ---
  const handleGenerateItineraries = async () => {
    if (itinerary.length === 0) {
      alert("Please add places to your itinerary first!");
      return;
    }

    setOptionsLoading(true);
    setStage("options");

    try {
      // Add AI thinking message
      setChat(prev => [...prev, {
        id: Date.now().toString() + "thinking",
        text: "Odyssey is generating 3 different itinerary options for you...",
        sender: "ai",
        cards: []
      }]);

      const res = await fetch("http://localhost:4000/api/ai/generateItineraries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedPlaces: itinerary.map(item => ({
            name: item.name,
            category: item.category || "place",
          })),
          tripDuration: Math.ceil(itinerary.length / 2), // Rough estimate
          userContext: { budget: "medium", pace: "moderate" },
          customRequirements: customRequirements.length > 0 ? customRequirements.join(" | ") : undefined
        })
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to generate itineraries");
      }

      setItineraryOptions(data.data.itineraries);

      // Add success message
      setChat(prev => [...prev, {
        id: Date.now().toString() + "options",
        text: `Perfect! I've created 3 itinerary options for you. Review them below and select your preferred option!`,
        sender: "ai",
        cards: []
      }]);

    } catch (err) {
      console.error(err);
      alert("Error generating itineraries: " + (err as any).message);
      setStage("chat");
    } finally {
      setOptionsLoading(false);
    }
  };

  // Handler for confirming and saving itinerary
  const handleConfirmItinerary = async (finalTripName: string) => {
    if (!selectedItinerary) {
      alert("No itinerary selected");
      return;
    }

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Not authenticated. Please login first.");
        return;
      }

      const tripData = {
        tripName: finalTripName || tripName || "My Trip",
        selectedPlaces: itinerary.map(item => ({
          name: item.name,
          category: item.category || "place"
        })),
        selectedItinerary: {
          id: selectedItinerary.id,
          title: selectedItinerary.title,
          description: selectedItinerary.description,
          paceDescription: selectedItinerary.paceDescription,
          estimatedCost: selectedItinerary.estimatedCost,
          schedule: selectedItinerary.schedule
        },
        status: "draft"
      };

      const res = await fetch("http://localhost:4000/api/trips/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(tripData)
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to save trip");
      }

      // Add success message
      setChat(prev => [...prev, {
        id: Date.now().toString() + "saved",
        text: `✅ Trip saved successfully! You can view it in your dashboard.`,
        sender: "ai",
        cards: []
      }]);

      // Reset state
      setConfirmationOpen(false);
      setStage("chat");
      setItinerary([]);
      setSelectedItinerary(null);
      setItineraryOptions([]);

    } catch (err) {
      console.error(err);
      alert("Error saving trip: " + (err as any).message);
    }
  };

  // Handler for Edit & Regenerate
  const handleEditAndRegenerate = () => {
    setConfirmationOpen(false);
    setStage("chat");
    setItineraryOptions([]);
    setSelectedItinerary(null);
    setCustomRequirements([]); // Clear requirements for fresh edit
    
    // Show instruction message
    setChat(prev => [...prev, {
      id: Date.now().toString() + "edit",
      text: "Great! You can now:\n1. Add or remove places from your itinerary (drag them in/out)\n2. Add custom requirements in the box below (e.g., 'visit museum first', 'sunset at beach')\n\nWhen ready, click 'Generate Itineraries' again!",
      sender: "ai",
      cards: []
    }]);
  };

  // Add custom requirement
  const handleAddRequirement = () => {
    if (requirementInput.trim()) {
      setCustomRequirements(prev => [...prev, requirementInput.trim()]);
      setRequirementInput("");
    }
  };

  // Remove custom requirement
  const handleRemoveRequirement = (index: number) => {
    setCustomRequirements(prev => prev.filter((_, i) => i !== index));
  };

  // --- DRAG HANDLERS (EXACT ORIGINAL LOGIC) ---
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    // Only drag from Collections or Itinerary (Chat is disabled for drag)
    const item = collections.find((i) => i.id === active.id) || itinerary.find((i) => i.id === active.id);
    if (item) setActiveItem(item);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const overId = over.id;
    const overColumnId = overId === "itinerary" || itinerary.some(i => i.id === overId) ? "itinerary" : 
                         overId === "collections" || collections.some(i => i.id === overId) ? "collections" : null;

    if (!overColumnId) return;

    if (overColumnId === "itinerary") {
        const overIndex = itinerary.findIndex(i => i.id === overId);
        const index = overIndex === -1 ? itinerary.length : overIndex;
        setDropIndicator({ column: "itinerary", index });
    } else if (overColumnId === "collections") {
        const overIndex = collections.findIndex(i => i.id === overId);
        const index = overIndex === -1 ? collections.length : overIndex;
        setDropIndicator({ column: "collections", index });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);
    setDropIndicator(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumnId = collections.some(i => i.id === activeId) ? "collections" : "itinerary";
    const overColumnId = overId === "itinerary" || itinerary.some(i => i.id === overId) ? "itinerary" :
                         overId === "collections" || collections.some(i => i.id === overId) ? "collections" : null;

    if (!overColumnId) return;

    if (activeColumnId === overColumnId) {
        if (activeColumnId === "itinerary") {
            const oldIndex = itinerary.findIndex(i => i.id === activeId);
            const newIndex = itinerary.findIndex(i => i.id === overId);
            if (oldIndex !== newIndex) setItinerary(arrayMove(itinerary, oldIndex, newIndex));
        } else {
            const oldIndex = collections.findIndex(i => i.id === activeId);
            const newIndex = collections.findIndex(i => i.id === overId);
            if (oldIndex !== newIndex) setCollections(arrayMove(collections, oldIndex, newIndex));
        }
    } else {
        if (activeColumnId === "collections" && overColumnId === "itinerary") {
            const item = collections.find(i => i.id === activeId);
            if (item) {
                setItinerary(prev => [...prev, item]);
                setCollections(prev => prev.filter(i => i.id !== activeId));
            }
        } else if (activeColumnId === "itinerary" && overColumnId === "collections") {
            const item = itinerary.find(i => i.id === activeId);
            if (item) {
                setCollections(prev => [...prev, item]);
                setItinerary(prev => prev.filter(i => i.id !== activeId));
            }
        }
    }
  };

  const sharedTabStyles = (isActive: boolean) => ({
    flex: 1, padding: "6px", borderRadius: "8px", border: "none",
    background: isActive ? "#fff" : "transparent",
    fontWeight: isActive ? 600 : 400, cursor: "pointer", fontSize: "14px"
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "Inter, sans-serif", background: "#ffffff", overflow: "hidden" }}>
      
      {/* Header */}
      <header style={{ padding: "12px 5%", height: "64px", flexShrink: 0, display: "flex", alignItems: "center", background: "#fff6eb", gap: "12px", borderBottom: "1px solid #e5e7eb" }}>
        <input 
          value={tripName} 
          onChange={(e) => setTripName(e.target.value)} 
          placeholder="Trip name" 
          style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1px solid #d9d9d9", background: "#fff" }} 
        />
        <button 
          onClick={handleGenerateItineraries}
          disabled={itinerary.length === 0 || optionsLoading}
          style={{ 
            padding: "8px 14px", 
            background: itinerary.length === 0 ? "#d1d5db" : "#7c3aed", 
            color: "#fff", 
            border: "none", 
            borderRadius: "8px", 
            fontWeight: 600, 
            cursor: itinerary.length === 0 ? "not-allowed" : "pointer",
            opacity: optionsLoading ? 0.7 : 1
          }}
          title={itinerary.length === 0 ? "Add places to itinerary first" : "Generate 3 itinerary options"}
        >
          {optionsLoading ? "Generating..." : "✨ Generate Itineraries"}
        </button>
        <button onClick={handleSaveTrip} style={{ padding: "8px 14px", background: "#1db954", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>Save</button>
        <button style={{ padding: "8px 14px", background: "#fff", color: "#000", border: "1px solid #d9d9d9", borderRadius: "8px" }}>Maps</button>
        <button style={{ padding: "8px 14px", background: "#fff", color: "#000", border: "1px solid #d9d9d9", borderRadius: "8px" }}>Summaries</button>
      </header>

      <main style={{ padding: "20px 5%", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
        <DndContext 
          collisionDetection={customCollisionStrategy} 
          onDragStart={handleDragStart} 
          onDragOver={handleDragOver} 
          onDragEnd={handleDragEnd} 
          measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        >
          <div style={{ display: "flex", gap: "30px", marginBottom: "12px", flexShrink: 0 }}>
            <div style={{ width: "55%", display: "flex", alignItems: "center", gap: "10px" }}>
              <button onClick={() => router.push("/dashboard")} style={{ background: "white", border: "1px solid #d9d9d9", borderRadius: "6px", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>←</button>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: "20px" }}>Itinerary</h3>
            </div>
            <div style={{ width: "45%", display: "flex", gap: "4px", background: "#d1d5db", borderRadius: "10px", padding: "4px" }}>
              <button onClick={() => setActiveTab("chat")} style={sharedTabStyles(activeTab === "chat")}>Chat</button>
              <button onClick={() => setActiveTab("destinations")} style={sharedTabStyles(activeTab === "destinations")}>Destinations</button>
              <button onClick={() => setActiveTab("summaries")} style={sharedTabStyles(activeTab === "summaries")}>Summaries</button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "row", gap: "30px", flex: 1, overflow: "hidden", minHeight: 0 }}>
            <div style={{ width: "55%", display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
              <Column 
                id="itinerary" 
                items={itinerary} 
                actionType="remove" 
                dropIndicatorIndex={dropIndicator?.column === "itinerary" ? dropIndicator.index : null} 
                onActionItem={(id: string) => setItinerary(itinerary.filter(i => i.id !== id))} 
                onViewDetails={handleViewDetails} // Pass Modal trigger
              />
            </div>

            <div style={{ width: "45%", display: "flex", flexDirection: "column", background: "#e5e7eb", borderRadius: "20px", padding: "12px", overflow: "hidden", minHeight: 0 }}>
                {activeTab === "chat" && (
                  <>
                    {/* Clustering Stage Display */}
                    {stage === "clustering" && clusteringData && (
                      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", marginBottom: "12px", padding: "12px", background: "#fff", borderRadius: "12px" }}>
                        <ClusteringView 
                          data={clusteringData} 
                          loading={clusteringLoading}
                          onContinue={handleClusteringContinue}
                        />
                      </div>
                    )}

                    {/* Options Selection Stage Display */}
                    {stage === "options" && itineraryOptions.length > 0 && (
                      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", marginBottom: "12px", padding: "12px", background: "#fff", borderRadius: "12px" }}>
                        <MultiOptionSelector 
                          itineraries={itineraryOptions}
                          onSelect={(option) => {
                            setSelectedItinerary(option);
                            setConfirmationOpen(true);
                          }}
                        />
                      </div>
                    )}

                    {/* Regular Chat Display */}
                    {stage === "chat" && (
                      <ChatColumn 
                        messages={chat} 
                        chatInput={chatInput} 
                        setChatInput={setChatInput} 
                        onSendMessage={handleSendMessage}
                        onAddCard={handleAddToCollections}
                        onViewDetails={handleViewDetails}
                        loading={loading}
                      />
                    )}

                    {/* Custom Requirements Box - Only show when editing options */}
                    {stage === "chat" && itineraryOptions.length > 0 && (
                      <div style={{ 
                        marginTop: "12px", 
                        padding: "12px", 
                        background: "#fef3c7", 
                        borderRadius: "12px",
                        border: "2px solid #fcd34d",
                        flexShrink: 0
                      }}>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#92400e", marginBottom: "8px" }}>
                          📋 Custom Requirements (Regeneration Only)
                        </div>

                        {/* Input for new requirement */}
                        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                          <input
                            type="text"
                            value={requirementInput}
                            onChange={(e) => setRequirementInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleAddRequirement()}
                            placeholder="e.g., 'visit museum first' or 'sunset at beach'"
                            style={{
                              flex: 1,
                              padding: "8px 12px",
                              border: "1px solid #fcd34d",
                              borderRadius: "8px",
                              fontSize: "13px",
                              background: "#fff",
                              outline: "none"
                            }}
                          />
                          <button
                            onClick={handleAddRequirement}
                            disabled={!requirementInput.trim()}
                            style={{
                              padding: "8px 14px",
                              background: requirementInput.trim() ? "#fcd34d" : "#e5d4a4",
                              color: "#92400e",
                              border: "none",
                              borderRadius: "8px",
                              fontWeight: 600,
                              fontSize: "12px",
                              cursor: requirementInput.trim() ? "pointer" : "not-allowed",
                              transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => {
                              if (requirementInput.trim()) {
                                (e.currentTarget as HTMLButtonElement).style.background = "#fbbf24";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (requirementInput.trim()) {
                                (e.currentTarget as HTMLButtonElement).style.background = "#fcd34d";
                              }
                            }}
                          >
                            + Add
                          </button>
                        </div>

                        {/* Requirements List */}
                        {customRequirements.length > 0 && (
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            {customRequirements.map((req, idx) => (
                              <div
                                key={idx}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  background: "#fff",
                                  padding: "8px 10px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  color: "#92400e",
                                  border: "1px solid #fcd34d"
                                }}
                              >
                                <span>✓ {req}</span>
                                <button
                                  onClick={() => handleRemoveRequirement(idx)}
                                  style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "#ef4444",
                                    cursor: "pointer",
                                    padding: "0 4px",
                                    fontSize: "16px",
                                    fontWeight: "bold"
                                  }}
                                  title="Remove requirement"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {customRequirements.length === 0 && (
                          <div style={{ fontSize: "12px", color: "#a16207", fontStyle: "italic" }}>
                            No custom requirements added yet. Add requirements to regenerate itineraries that prioritize your preferences.
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
                
                {activeTab === "destinations" && (
                  <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
                    <div style={{ display: "flex", gap: "12px", background: "#d1d5db", borderRadius: "10px", padding: "4px", marginBottom: "16px", flexShrink: 0 }}>
                      <button onClick={() => setDestinationsView("search")} style={sharedTabStyles(destinationsView === "search")}>Search</button>
                      <button onClick={() => setDestinationsView("collections")} style={sharedTabStyles(destinationsView === "collections")}>Collections ({collections.length})</button>
                    </div>

                    {destinationsView === "search" ? (
                      <Column id="search" items={searchResults} actionType="add" onActionItem={handleAddToCollections} transparent isSortable={false} onViewDetails={handleViewDetails}>
                        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexShrink: 0 }}>
                          <input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
                            placeholder="Search destinations..." 
                            style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "none", background: "#ffffff" }} 
                          />
                          <button onClick={handleSendMessage} style={{ padding: "8px 14px", background: "#000", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
                            Search
                          </button>
                        </div>
                      </Column>
                    ) : (
                      <Column 
                        id="collections" 
                        items={collections} 
                        actionType="remove" 
                        dropIndicatorIndex={dropIndicator?.column === "collections" ? dropIndicator.index : null} 
                        onActionItem={(id: string) => setCollections(collections.filter(i => i.id !== id))} 
                        transparent 
                        isSortable={true} 
                        onViewDetails={handleViewDetails}
                      />
                    )}
                  </div>
                )}

                {activeTab === "summaries" && <div style={{ textAlign: "center", padding: "20px" }}>No summaries.</div>}
            </div>
          </div>

          <DragOverlay dropAnimation={null}>
            {activeItem && (
              <div style={{ 
                padding: "14px", 
                background: "#fff", 
                borderRadius: "12px", 
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                width: "100%",
                maxWidth: "300px",
                fontSize: "14px",
                opacity: 0.9
              }}>
                {activeItem.name}
              </div>
            )}
          </DragOverlay>

          {/* Modal Injection */}
          <LocationModal 
            isOpen={modalOpen} 
            onClose={() => setModalOpen(false)} 
            data={selectedLocation} 
          />

          {/* Confirmation Modal */}
          <ConfirmationModal 
            isOpen={confirmationOpen}
            itinerary={selectedItinerary}
            tripName={tripName}
            onConfirm={handleConfirmItinerary}
            onClose={() => setConfirmationOpen(false)}
            onEdit={handleEditAndRegenerate}
          />

        </DndContext>
      </main>

      <footer style={{ height: "48px", flexShrink: 0, padding: "0 5%", display: "flex", alignItems: "center", justifyContent: "center", borderTop: "1px solid #d9d9d9", background: "#f5f5f5", fontSize: "14px", color: "#666" }}>
        ©Odyssey. Made with ❤️ by Route6
      </footer>
    </div>
  );
}