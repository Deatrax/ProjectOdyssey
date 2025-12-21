"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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
// Import the new modal
import LocationModal from "../components/LocationModal";

// --- TYPES (Updated to match your Backend) ---
type Item = { 
  id: string; 
  name: string; // "text" mapped to name
  category?: string;
  visitDurationMin?: number;
  time?: string;
  description?: string;
  images?: string[];
  reviews?: any[];
};

type ChatMessage = {
  id: string;
  text: string;
  sender: "user" | "ai";
  cards?: Item[];
};

type ActiveTab = "chat" | "destinations" | "summaries";
type DestinationsView = "search" | "collections";

// --- CUSTOM COLLISION LOGIC (Yours) ---
const customCollisionStrategy: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) return pointerCollisions;
  return rectIntersection(args);
};

// --- SORTABLE ITEM (Updated with onClick) ---
function SortableItem({
  id,
  item, // Pass the full item object
  actionType = "remove",
  onAction,
  disabled = false,
  onClick
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
      // Added onClick here to open modal
      onClick={() => onClick && onClick(item)}
      className="sortable-card" // Keeping class for dnd
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
        cursor: "pointer" // Visual cue
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#1f2937" }}>{item.name}</span>
          {item.category && (
             <span style={{ fontSize: "10px", color: "#6b7280", textTransform: "uppercase", fontWeight: "bold" }}>
               {item.category} • {item.visitDurationMin ? `${item.visitDurationMin}m` : ""}
             </span>
          )}
        </div>

        {onAction && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction(id);
            }}
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
              fontSize: "16px",
              marginLeft: "8px"
            }}
          >
            {actionType === "add" ? "+" : "×"}
          </button>
        )}
      </div>
    </div>
  );
}

// --- COLUMN COMPONENT ---
function Column({ id, items, actionType, onActionItem, transparent, isSortable = true, onItemClick }: any) {
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
      }}
    >
      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        {isSortable ? (
          <SortableContext items={items.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
            {items.map((item: any) => (
              <SortableItem
                key={item.id}
                id={item.id}
                item={item} // Pass full item
                actionType={actionType}
                onAction={onActionItem}
                onClick={onItemClick}
              />
            ))}
          </SortableContext>
        ) : (
          items.map((item: any) => (
            <SortableItem
              key={item.id}
              id={item.id}
              item={item}
              actionType={actionType}
              onAction={onActionItem}
              onClick={onItemClick}
              disabled={true}
            />
          ))
        )}
      </div>
    </div>
  );
}

// --- CHAT COLUMN COMPONENT ---
function ChatColumn({ messages, chatInput, setChatInput, onSendMessage, onAddCard, onItemClick, loading }: any) {
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
            
            {/* RENDER AI CARDS UNDER MESSAGE */}
            {msg.cards && msg.cards.length > 0 && (
              <div style={{ marginTop: "8px", width: "80%" }}>
                {msg.cards.map((card: any) => (
                  <SortableItem 
                    key={card.id} 
                    id={card.id} 
                    item={card} 
                    actionType="add" 
                    onAction={() => onAddCard(card)}
                    onClick={onItemClick}
                    disabled={true} 
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

// --- MAIN PAGE ---
export default function PlannerPage() {
  const router = useRouter();

  // State
  const [tripName, setTripName] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("chat");
  const [destinationsView, setDestinationsView] = useState<DestinationsView>("search");
  
  const [itinerary, setItinerary] = useState<Item[]>([]);
  const [collections, setCollections] = useState<Item[]>([]);
  const [searchResults, setSearchResults] = useState<Item[]>([]); // Mock search results
  
  const [chat, setChat] = useState<ChatMessage[]>([
    { id: "m1", text: "Hello! Where are we going?", sender: "ai", cards: [] }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);

  // DnD State
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{ column: string; index: number } | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Item | null>(null);

  // --- HANDLER: Open Modal ---
  const handleItemClick = (item: Item) => {
    setSelectedLocation(item);
    setModalOpen(true);
  };

  // --- HANDLER: Send to Backend ---
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), text: chatInput, sender: "user" };
    setChat(prev => [...prev, userMsg]);
    setChatInput("");
    setLoading(true);

    try {
      // 1. Call your actual backend
      const res = await fetch("http://localhost:4000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMsg.text,
          collections: collections, 
          itinerary: itinerary 
        })
      });
      const data = await res.json();

      // 2. Process Response: Flatten Itinerary into Cards
      let aiCards: Item[] = [];

      // If response has 'cards' (Direct suggestions)
      if (data.cards && data.cards.length > 0) {
        aiCards = [...aiCards, ...data.cards];
      }

      // If response has 'itineraryPreview' (Day by Day plan) -> Flatten items to cards
      if (data.itineraryPreview && data.itineraryPreview.days) {
        data.itineraryPreview.days.forEach((day: any) => {
          if (day.items) {
             day.items.forEach((item: any) => {
                aiCards.push({
                   ...item, // name, category, visitDurationMin
                   id: `ai-${Date.now()}-${Math.random()}`, // Frontend ID
                   description: `Day ${day.day} - ${item.time || 'Visit'}`
                });
             });
          }
        });
      }

      // 3. Update Chat
      const aiMsg: ChatMessage = {
        id: Date.now().toString() + "ai",
        text: data.message || data.reply, // Adjust based on which backend returns
        sender: "ai",
        cards: aiCards
      };
      setChat(prev => [...prev, aiMsg]);

    } catch (err) {
      console.error(err);
      setChat(prev => [...prev, { id: "err", text: "Error connecting to AI.", sender: "ai" }]);
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLER: Add Card from Chat to Collection ---
  const handleAddToCollections = (card: Item) => {
    if (!collections.find(c => c.name === card.name)) {
      setCollections(prev => [...prev, { ...card, id: `col-${Date.now()}` }]);
    }
  };

  // --- DND HANDLERS (Unchanged logic) ---
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const item = 
       itinerary.find(i => i.id === active.id) || 
       collections.find(i => i.id === active.id) ||
       chat.flatMap(m => m.cards || []).find(c => c.id === active.id);
    if(item) setActiveItem(item);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    // ... (Your existing logic)
    if (over.id === "itinerary" || itinerary.some(i => i.id === over.id)) {
        setDropIndicator({ column: "itinerary", index: 0 }); // simplified
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);
    setDropIndicator(null);
    if (!over) return;

    if (over.id === "itinerary" || itinerary.some(i => i.id === over.id)) {
        if (!itinerary.find(i => i.id === active.id) && activeItem) {
            setItinerary(prev => [...prev, { ...activeItem, id: `it-${Date.now()}` }]);
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
        <button style={{ padding: "8px 14px", background: "#1db954", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600 }}>Itinerary</button>
        <button style={{ padding: "8px 14px", background: "#fff", color: "#000", border: "1px solid #d9d9d9", borderRadius: "8px" }}>Maps</button>
        <button style={{ padding: "8px 14px", background: "#fff", color: "#000", border: "1px solid #d9d9d9", borderRadius: "8px" }}>Summaries</button>
      </header>

      {/* Main */}
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
            {/* Left: Itinerary */}
            <div style={{ width: "55%", display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
              <Column 
                id="itinerary" 
                items={itinerary} 
                actionType="remove" 
                dropIndicatorIndex={dropIndicator?.column === "itinerary" ? dropIndicator.index : null} 
                onActionItem={(id: string) => setItinerary(itinerary.filter(i => i.id !== id))} 
                onItemClick={handleItemClick}
              />
            </div>

            {/* Right: Tab Content */}
            <div style={{ width: "45%", display: "flex", flexDirection: "column", background: "#e5e7eb", borderRadius: "20px", padding: "12px", overflow: "hidden", minHeight: 0 }}>
                {activeTab === "chat" && (
                  <ChatColumn 
                    messages={chat} 
                    chatInput={chatInput} 
                    setChatInput={setChatInput} 
                    onSendMessage={handleSendMessage}
                    onAddCard={handleAddToCollections}
                    onItemClick={handleItemClick}
                    loading={loading}
                  />
                )}
                
                {activeTab === "destinations" && (
                  <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
                    <div style={{ display: "flex", gap: "12px", background: "#d1d5db", borderRadius: "10px", padding: "4px", marginBottom: "16px", flexShrink: 0 }}>
                      <button onClick={() => setDestinationsView("search")} style={sharedTabStyles(destinationsView === "search")}>Search</button>
                      <button onClick={() => setDestinationsView("collections")} style={sharedTabStyles(destinationsView === "collections")}>Collections ({collections.length})</button>
                    </div>

                    {destinationsView === "search" ? (
                      <Column id="search" items={searchResults} actionType="add" onActionItem={handleAddToCollections} transparent isSortable={false} onItemClick={handleItemClick}>
                        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexShrink: 0 }}>
                          <input 
                            placeholder="Search destinations..." 
                            style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "none", background: "#ffffff" }} 
                          />
                          <button style={{ padding: "8px 14px", background: "#000", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>Search</button>
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
                        onItemClick={handleItemClick}
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
                padding: "14px", background: "#fff", borderRadius: "12px", 
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)", width: "100%", maxWidth: "300px", 
                fontSize: "14px", opacity: 0.9 
              }}>
                {activeItem.name}
              </div>
            )}
          </DragOverlay>

          {/* Location Modal */}
          <LocationModal 
            isOpen={modalOpen} 
            onClose={() => setModalOpen(false)} 
            data={selectedLocation} 
          />

        </DndContext>
      </main>

      <footer style={{ height: "48px", flexShrink: 0, padding: "0 5%", display: "flex", alignItems: "center", justifyContent: "center", borderTop: "1px solid #d9d9d9", background: "#f5f5f5", fontSize: "14px", color: "#666" }}>
        ©Odyssey. Made with ❤️ by Route6
      </footer>
    </div>
  );
}