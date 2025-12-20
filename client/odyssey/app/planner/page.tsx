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

type Item = {
  id: string;                 // frontend UUID
  placeId?: string;           // DB id OR external id
  name: string;
  description?: string;
  category?: "nature" | "history" | "museum" | "urban";
  visitDurationMin?: number;
  source: "db" | "ai";
};

type ActiveTab = "chat" | "destinations" | "summaries";
type DestinationsView = "search" | "collections";

/* -------------------- Custom Collision Logic -------------------- */
// This fixes the "jumping to end" issue by prioritizing item-level collisions
const customCollisionStrategy: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) return pointerCollisions;
  return rectIntersection(args);
};

/* -------------------- Sortable Item -------------------- */
function SortableItem({
  id,
  name,
  isIndicatorBefore,
  onAction,
  actionType = "remove",
  disabled = false,
}: Item & { 
  isIndicatorBefore?: boolean; 
  onAction?: () => void;
  actionType?: "add" | "remove"; 
  disabled?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id, disabled });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    marginBottom: "10px",
    borderRadius: "14px",
    background: "#ffffff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    position: "relative"
  };

  return (
    <div ref={setNodeRef} style={style}>
      {isIndicatorBefore && (
        <div style={{ position: "absolute", top: "-6px", left: 0, right: 0, height: "4px", background: "#1db954", borderRadius: "2px", zIndex: 10 }} />
      )}
      <div style={{ display: "flex", alignItems: "center", padding: "14px", cursor: disabled ? "default" : (isDragging ? "grabbing" : "grab") }}> 
        <span {...(disabled ? {} : { ...attributes, ...listeners })} style={{ flex: 1, fontSize: "14px" }}>{name}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onAction && onAction(); }}
          style={{ 
            marginLeft: "12px", 
            background: actionType === "add" ? "#1db954" : "#000", 
            color: "#fff", 
            border: "none", 
            borderRadius: "6px", 
            padding: "4px 10px", 
            cursor: "pointer", 
            fontWeight: 600,
            fontSize: "16px"
          }}
        >
          {actionType === "add" ? "+" : "×"}
        </button>
      </div>
    </div>
  );
}

/* -------------------- Column -------------------- */
function Column({
  id,
  items,
  dropIndicatorIndex,
  onActionItem,
  actionType,
  children,
  transparent = false,
  isSortable = true,
}: {
  id: string;
  items: Item[];
  dropIndicatorIndex?: number | null;
  onActionItem: (id: string) => void;
  actionType: "add" | "remove";
  children?: React.ReactNode;
  transparent?: boolean;
  isSortable?: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const content = (
    <div 
      ref={setNodeRef} 
      style={{ 
        flex: 1, 
        overflowY: "auto", 
        padding: "4px",
        minHeight: "200px",
      }}
    >
      {items.map((item, index) => (
        <SortableItem
          key={item.id}
          {...item}
          actionType={actionType}
          disabled={!isSortable}
          isIndicatorBefore={dropIndicatorIndex === index}
          onAction={() => onActionItem(item.id)}
        />
      ))}
      {dropIndicatorIndex === items.length && items.length > 0 && (
        <div style={{ height: "4px", background: "#1db954", marginTop: "-6px", marginBottom: "10px", borderRadius: "2px" }} />
      )}
    </div>
  );

  return (
    <div
      style={{
        flex: 1,
        height: "100%",
        background: transparent ? "transparent" : (isOver ? "#f0fdf4" : "#ffffff"),
        padding: transparent ? "0px" : "16px",
        borderRadius: "18px",
        display: "flex",
        flexDirection: "column",
        border: (!transparent) ? "2px dashed #eeeeee" : "none",
        minHeight: 0,
      }}
    >
      {children}
      {isSortable ? (
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {content}
        </SortableContext>
      ) : content}
    </div>
  );
}

/* -------------------- Chat Column -------------------- */
function ChatColumn({
  messages,
  setMessages,
  chatInput,
  setChatInput,
}: {
  messages: { id: string; text: string; user?: boolean }[];
  setMessages: React.Dispatch<React.SetStateAction<{ id: string; text: string; user?: boolean }[]>>;
  chatInput: string;
  setChatInput: React.Dispatch<React.SetStateAction<string>>;
}) {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { setNodeRef } = useDroppable({ id: "chat" });

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = { id: crypto.randomUUID(), text: chatInput, user: true };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), text: `Bot reply to: "${userMsg.text}"` }]);
    }, 500);
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  return (
    <div ref={setNodeRef} style={{ width: "100%", flex: 1, display: "flex", flexDirection: "column", borderRadius: "18px", minHeight: 0 }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "10px", minHeight: 0 }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.user ? "flex-end" : "flex-start",
              background: msg.user ? "#1db954" : "#fff",
              color: "#000",
              padding: "10px 14px",
              borderRadius: "14px",
              maxWidth: "80%",
              fontSize: "14px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
            }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div style={{ padding: "10px", display: "flex", gap: "8px", flexShrink: 0 }}>
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Where to ?..."
          style={{ flex: 1, padding: "12px", borderRadius: "25px", border: "none", background: "#ffffff", fontWeight: "bold", outline: "none", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)" }}
        />
      </div>
    </div>
  );
}

/* -------------------- Main Page -------------------- */
export default function Page() {
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [itinerary, setItinerary] = useState<Item[]>([]);
  const [collections, setCollections] = useState<Item[]>([]);
  
  const [chat, setChat] = useState<{ id: string; text: string; user?: boolean }[]>([]);
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{ column: string; index: number } | null>(null);
  const [input, setInput] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("chat");
  const [destinationsView, setDestinationsView] = useState<DestinationsView>("search");
  const [tripName, setTripName] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const mockResults: Item[] = [
        { id: crypto.randomUUID(), name: `${input} - Popular Landmark`, source: "ai" },
        { id: crypto.randomUUID(), name: `${input} - City Center`, source: "ai" },
        { id: crypto.randomUUID(), name: `Hidden Gem in ${input}`, source: "ai" },
        { id: crypto.randomUUID(), name: `Top Rated Restaurant in ${input}`, source: "ai" },
      ];
      setSearchResults(mockResults);
      setLoading(false);
    }, 800);
  };

  const handleAddToCollections = (id: string) => {
    const item = searchResults.find(i => i.id === id);
    if (item) setCollections(prev => [...prev, { ...item, id: crypto.randomUUID() }]);
  };

  const findColumn = (id: string): string | null => {
    if (id === "itinerary" || itinerary.some((i) => i.id === id)) return "itinerary";
    if (id === "collections" || collections.some((i) => i.id === id)) return "collections";
    if (id === "search" || searchResults.some((i) => i.id === id)) return "search";
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    const item = [...itinerary, ...collections].find(i => i.id === id);
    setActiveItem(item || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || over.id === "chat") { setDropIndicator(null); return; }

    const overId = over.id as string;
    const colId = findColumn(overId);

    if (!colId || colId === "search") { setDropIndicator(null); return; } 

    const items = colId === "itinerary" ? itinerary : collections;
    const overItemIndex = items.findIndex((i) => i.id === overId);
    
    let index: number;

    if (overItemIndex !== -1) {
      const overRect = over.rect;
      // Get the mouse position relative to the item being hovered
      const cursorY = event.activatorEvent instanceof MouseEvent 
        ? (event.activatorEvent as MouseEvent).clientY 
        : (event.activatorEvent as TouchEvent).touches[0].clientY;
      
      const threshold = overRect.top + overRect.height / 2;
      index = cursorY > threshold ? overItemIndex + 1 : overItemIndex;
    } else {
      index = items.length;
    }

    setDropIndicator({ column: colId, index });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);
    
    if (!over) { setDropIndicator(null); return; }

    if (over.id === "chat") {
      if (activeItem) setChatInput((p) => p + (p ? " " : "") + activeItem.name);
      setDropIndicator(null);
      return;
    }

    const fromCol = findColumn(active.id as string);
    const toCol = dropIndicator?.column;
    
    if (!fromCol || !toCol) { setDropIndicator(null); return; }

    const targetIndex = dropIndicator.index;
    const sourceItems = fromCol === "itinerary" ? itinerary : collections;
    const targetItems = toCol === "itinerary" ? itinerary : collections;
    const setSource = fromCol === "itinerary" ? setItinerary : setCollections;
    const setTarget = toCol === "itinerary" ? setItinerary : setCollections;

    if (fromCol === toCol) {
      const oldIndex = sourceItems.findIndex(i => i.id === active.id);
      // Adjust targetIndex for arrayMove if moving downwards
      const newIdx = targetIndex > oldIndex ? targetIndex - 1 : targetIndex;
      setSource(arrayMove(sourceItems, oldIndex, newIdx));
    } else {
      const movingItem = sourceItems.find(i => i.id === active.id);
      if (!movingItem) return;

      const newTarget = [...targetItems];
      newTarget.splice(targetIndex, 0, { ...movingItem, id: crypto.randomUUID() });
      setTarget(newTarget);
      
      if (!(fromCol === "collections" && toCol === "itinerary")) {
        setSource(sourceItems.filter(i => i.id !== active.id));
      }
    }
    setDropIndicator(null);
  };

  const sharedTabStyles = (isActive: boolean) => ({
    flex: 1,
    padding: "8px 12px",
    background: isActive ? "#1db954" : "transparent",
    color: isActive ? "#fff" : "#000",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "13px",
    transition: "all 0.2s ease"
  } as React.CSSProperties);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "Inter, sans-serif", background: "#ffffff", overflow: "hidden" }}>
    
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
            <div style={{ width: "55%", display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
              <Column id="itinerary" items={itinerary} actionType="remove" dropIndicatorIndex={dropIndicator?.column === "itinerary" ? dropIndicator.index : null} onActionItem={(id) => setItinerary(itinerary.filter(i => i.id !== id))} />
            </div>

            <div style={{ width: "45%", display: "flex", flexDirection: "column", background: "#e5e7eb", borderRadius: "20px", padding: "12px", overflow: "hidden", minHeight: 0 }}>
                {activeTab === "chat" && <ChatColumn messages={chat} setMessages={setChat} chatInput={chatInput} setChatInput={setChatInput} />}
                
                {activeTab === "destinations" && (
                  <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
                    <div style={{ display: "flex", gap: "12px", background: "#d1d5db", borderRadius: "10px", padding: "4px", marginBottom: "16px", flexShrink: 0 }}>
                      <button onClick={() => setDestinationsView("search")} style={sharedTabStyles(destinationsView === "search")}>Search</button>
                      <button onClick={() => setDestinationsView("collections")} style={sharedTabStyles(destinationsView === "collections")}>Collections ({collections.length})</button>
                    </div>

                    {destinationsView === "search" ? (
                      <Column id="search" items={searchResults} actionType="add" onActionItem={handleAddToCollections} transparent isSortable={false}>
                        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexShrink: 0 }}>
                          <input 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder="Search destinations..." 
                            style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "none", background: "#ffffff" }} 
                          />
                          <button onClick={handleSearch} style={{ padding: "8px 14px", background: "#000", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
                            {loading ? "..." : "Search"}
                          </button>
                        </div>
                      </Column>
                    ) : (
                      <Column id="collections" items={collections} actionType="remove" dropIndicatorIndex={dropIndicator?.column === "collections" ? dropIndicator.index : null} onActionItem={(id) => setCollections(collections.filter(i => i.id !== id))} transparent isSortable={true} />
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
        </DndContext>
      </main>

      <footer style={{ height: "48px", flexShrink: 0, padding: "0 5%", display: "flex", alignItems: "center", justifyContent: "center", borderTop: "1px solid #d9d9d9", background: "#f5f5f5", fontSize: "14px", color: "#666" }}>
        ©Odyssey. Made with ❤️ by Route6
      </footer>
    </div>
  );
}