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
import LocationModal from "../components/LocationModal"; // Import your Modal

// --- UPDATED TYPE (To support AI data) ---
type Item = {
  id: string;                 
  placeId?: string;           
  name: string; // Map 'text' to this for UI
  text?: string; // Fallback for your original UI
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

/* -------------------- Sortable Item (YOUR ORIGINAL + Click) -------------------- */
function SortableItem({
  id,
  text,
  isIndicatorBefore,
  onAction,
  actionType = "remove",
  disabled = false,
  // New props for Modal
  itemData,
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
      className={`sortable-item ${isDragging ? "z-50" : ""}`} // Preserving class behavior
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
        {/* Indicator Logic */}
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

        {/* Clickable Area for Modal */}
        <div 
          onClick={() => onClick && onClick(itemData)} 
          style={{ flex: 1, cursor: "pointer", display: "flex", flexDirection: "column" }}
          {...attributes} 
          {...listeners}
        >
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#1f2937" }}>{text}</span>
          {itemData?.category && (
             <span style={{ fontSize: "10px", color: "#6b7280", textTransform: "uppercase", marginTop: "2px" }}>
               {itemData.category}
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
            onPointerDown={(e) => e.stopPropagation()} // Stop drag when clicking button
          >
            {actionType === "add" ? "+" : "×"}
          </button>
        )}
      </div>
    </div>
  );
}

/* -------------------- Column Component (YOUR ORIGINAL) -------------------- */
function Column({ id, items, actionType, onActionItem, dropIndicatorIndex, transparent, isSortable = true, onItemClick }: any) {
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
          <SortableContext items={items.map((i:any) => i.id)} strategy={verticalListSortingStrategy}>
            {items.map((item: any, index: number) => (
              <SortableItem
                key={item.id}
                id={item.id}
                text={item.name} // Map name to text
                itemData={item}  // Pass full data for modal
                actionType={actionType}
                onAction={onActionItem}
                onClick={onItemClick}
                isIndicatorBefore={
                  dropIndicatorIndex === index ? true :
                  dropIndicatorIndex === index + 1 ? false : undefined
                }
              />
            ))}
          </SortableContext>
        ) : (
          items.map((item: any) => (
            <SortableItem
              key={item.id}
              id={item.id}
              text={item.name}
              itemData={item}
              actionType={actionType}
              onAction={onActionItem}
              onClick={onItemClick}
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

/* -------------------- Chat Column (Updated to Render Cards) -------------------- */
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
            
            {/* THIS IS THE NEW PART: Render Cards INSIDE Chat */}
            {msg.cards && msg.cards.length > 0 && (
              <div style={{ marginTop: "8px", width: "85%", alignSelf: "flex-start" }}>
                {msg.cards.map((card: any) => (
                  <SortableItem 
                    key={card.id} 
                    id={card.id} 
                    text={card.name}
                    itemData={card} 
                    actionType="add" 
                    onAction={() => onAddCard(card)} // Click "+" to add to collections
                    onClick={onItemClick}
                    disabled={true} // Not draggable (as requested), just clickable
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

  // State
  const [tripName, setTripName] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("chat");
  const [destinationsView, setDestinationsView] = useState<DestinationsView>("search");
  const [input, setInput] = useState("");
  
  // Data State
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

  // --- HANDLER: Add to Collections (From Chat) ---
  const handleAddToCollections = (card: Item) => {
    if (!collections.find(c => c.name === card.name)) {
      setCollections(prev => [...prev, { ...card, id: `col-${Date.now()}` }]);
    }
  };

  // --- HANDLER: Send Message (AI Logic) ---
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { id: Date.now().toString(), text: chatInput, sender: "user" };
    setChat(prev => [...prev, userMsg]);
    setChatInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text, collections, itinerary })
      });
      const data = await res.json();

      let aiCards: Item[] = [];
      
      // Parse cards from response
      if (data.cards) aiCards = [...aiCards, ...data.cards];
      
      // Parse Itinerary Preview
      if (data.itineraryPreview?.days) {
        data.itineraryPreview.days.forEach((day: any) => {
          if (day.items) {
             day.items.forEach((item: any) => {
                aiCards.push({
                   ...item, 
                   id: `ai-${Date.now()}-${Math.random()}`, 
                   description: `Day ${day.day} - ${item.time || 'Visit'}`
                });
             });
          }
        });
      }

      setChat(prev => [...prev, {
        id: Date.now().toString() + "ai",
        text: data.message || data.reply,
        sender: "ai",
        cards: aiCards
      }]);

    } catch (err) {
      console.error(err);
      setChat(prev => [...prev, { id: "err", text: "Error connecting to AI.", sender: "ai" }]);
    } finally {
      setLoading(false);
    }
  };

  // --- DRAG HANDLERS (EXACTLY YOUR ORIGINAL LOGIC) ---
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
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
        // Reordering within same column
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
        // Moving between columns
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
        <button style={{ padding: "8px 14px", background: "#1db954", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600 }}>Itinerary</button>
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
            
            {/* LEFT: ITINERARY COLUMN */}
            <div style={{ width: "55%", display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
              <Column 
                id="itinerary" 
                items={itinerary} 
                actionType="remove" 
                dropIndicatorIndex={dropIndicator?.column === "itinerary" ? dropIndicator.index : null} 
                onActionItem={(id: string) => setItinerary(itinerary.filter(i => i.id !== id))} 
                onItemClick={handleItemClick} // Click opens modal
              />
            </div>

            {/* RIGHT: TABS CONTENT */}
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
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Search destinations..." 
                            style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "none", background: "#ffffff" }} 
                          />
                          <button style={{ padding: "8px 14px", background: "#000", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
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

        </DndContext>
      </main>

      <footer style={{ height: "48px", flexShrink: 0, padding: "0 5%", display: "flex", alignItems: "center", justifyContent: "center", borderTop: "1px solid #d9d9d9", background: "#f5f5f5", fontSize: "14px", color: "#666" }}>
        ©Odyssey. Made with ❤️ by Route6
      </footer>
    </div>
  );
}