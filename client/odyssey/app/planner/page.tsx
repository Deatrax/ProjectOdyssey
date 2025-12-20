"use client";

import { useState, useRef, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  useDroppable,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  MeasuringStrategy,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Item = { id: string; text: string };
type ColumnId = "left" | "right" | "chat";
type ActiveTab = "chat" | "destinations" | "summaries";

/* -------------------- Sortable Item -------------------- */
function SortableItem({
  id,
  text,
  isIndicatorBefore,
  onRemove,
}: Item & { isIndicatorBefore?: boolean; onRemove?: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    marginBottom: "10px",
    borderRadius: "14px",
    background: "#ffffff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {isIndicatorBefore && (
        <div style={{ height: "3px", background: "#1db954", marginBottom: "6px", borderRadius: "2px" }} />
      )}
      <div style={{ display: "flex", alignItems: "center", padding: "14px", cursor: isDragging ? "grabbing" : "grab" }}>
        <span {...attributes} {...listeners} style={{ flex: 1, fontSize: "14px" }}>{text}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove && onRemove(); }}
          style={{ marginLeft: "12px", background: "#000", color: "#fff", border: "none", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", fontWeight: 600 }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

/* -------------------- Column -------------------- */
function Column({
  id,
  title,
  items,
  dropIndicatorIndex,
  onRemoveItem,
  children,
  width,
  transparent = false,
}: {
  id: ColumnId;
  title?: string;
  items: Item[];
  dropIndicatorIndex?: number | null;
  onRemoveItem: (id: string) => void;
  children?: React.ReactNode;
  width?: string;
  transparent?: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      style={{
        width: width || "100%",
        height: "100%",
        background: transparent ? "transparent" : (id === "left" ? "transparent" : isOver ? "#e0f2fe" : "#ffffff"),
        padding: transparent ? "0px" : "16px",
        borderRadius: "18px",
        display: "flex",
        flexDirection: "column",
        border: (id === "right" && !transparent) ? "2px dashed #eeeeee" : "none",
      }}
    >
      {title && !transparent && <h4 style={{ marginBottom: "12px", fontWeight: 600 }}>{title}</h4>}
      {children}
      <div ref={setNodeRef} style={{ flex: 1, overflowY: "auto", paddingRight: "6px", minHeight: "60px" }}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((item, index) => (
            <SortableItem
              key={item.id}
              {...item}
              isIndicatorBefore={dropIndicatorIndex === index}
              onRemove={() => onRemoveItem(item.id)}
            />
          ))}
          {dropIndicatorIndex === items.length && (
            <div style={{ height: "3px", background: "#1db954", marginBottom: "6px", borderRadius: "2px" }} />
          )}
        </SortableContext>
      </div>
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
    <div ref={setNodeRef} style={{ width: "100%", flex: 1, display: "flex", flexDirection: "column", borderRadius: "18px" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
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
      <div style={{ padding: "10px", display: "flex", gap: "8px" }}>
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Where to ?..."
          style={{ flex: 1, padding: "12px", borderRadius: "25px", border: "none", background: "#d1d5db", fontWeight: "bold", outline: "none" }}
        />
      </div>
    </div>
  );
}

/* -------------------- Page -------------------- */
export default function Page() {
  const [left, setLeft] = useState<Item[]>([]);
  const [right, setRight] = useState<Item[]>([]);
  const [chat, setChat] = useState<{ id: string; text: string; user?: boolean }[]>([]);
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{ column: ColumnId; index: number } | null>(null);
  const [input, setInput] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("chat");
  const [tripName, setTripName] = useState("");

  const addItem = () => {
    if (!input.trim()) return;
    setLeft((prev) => [...prev, { id: crypto.randomUUID(), text: input }]);
    setInput("");
  };

  const handleRemoveItem = (id: string) => {
    setLeft((prev) => prev.filter((i) => i.id !== id));
    setRight((prev) => prev.filter((i) => i.id !== id));
  };

  const findColumn = (id: string): ColumnId | null => {
    if (left.some((i) => i.id === id)) return "left";
    if (right.some((i) => i.id === id)) return "right";
    if (id === "left" || id === "right") return id as ColumnId;
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    setActiveItem(left.find((i) => i.id === id) || right.find((i) => i.id === id) || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || over.id === "chat") { setDropIndicator(null); return; }
    const to = findColumn(over.id as string);
    if (!to) return;
    const targetItems = to === "left" ? left : right;
    let index = targetItems.findIndex((i) => i.id === over.id);
    if (index === -1) index = targetItems.length;
    setDropIndicator({ column: to, index });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);
    if (!over) return;

    if (over.id === "chat") {
      const item = left.find((i) => i.id === active.id) || right.find((i) => i.id === active.id);
      if (item) setChatInput((p) => p + (p ? " " : "") + item.text);
      setDropIndicator(null);
      return;
    }

    const from = findColumn(active.id as string);
    const to = findColumn(over.id as string);
    if (!from || !to) return;

    const source = from === "left" ? left : right;
    const target = to === "left" ? left : right;
    const sourceIndex = source.findIndex((i) => i.id === active.id);
    const moving = source[sourceIndex];

    if (from === to) {
      const reordered = arrayMove(source, sourceIndex, dropIndicator?.index ?? sourceIndex);
      from === "left" ? setLeft(reordered) : setRight(reordered);
    } else {
      if (from === "left") {
        const copyOfItem = { ...moving, id: crypto.randomUUID() };
        const newTarget = [...target.slice(0, dropIndicator?.index ?? target.length), copyOfItem, ...target.slice(dropIndicator?.index ?? target.length)];
        setRight(newTarget);
      } else {
        const newSource = source.filter((i) => i.id !== active.id);
        const newTarget = [...target.slice(0, dropIndicator?.index ?? target.length), moving, ...target.slice(dropIndicator?.index ?? target.length)];
        setRight(newSource);
        setLeft(newTarget);
      }
    }
    setDropIndicator(null);
  };

  const tabButtonStyle = (tab: ActiveTab) => ({
    flex: 1,
    padding: "8px 12px",
    background: activeTab === tab ? "#1db954" : "transparent",
    color: activeTab === tab ? "#fff" : "#000",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.2s",
    fontSize: "13px"
  });

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

      <main style={{ padding: "20px 5%", flex: 1, display: "flex", flexDirection: "column", background: "#ffffff", overflow: "hidden" }}>
        <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd} measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}>
          
          {/* HEADER ROW - Synchronizes vertical start of columns */}
          <div style={{ display: "flex", gap: "30px", marginBottom: "12px", alignItems: "center", flexShrink: 0 }}>
            {/* Left Header */}
            <div style={{ width: "55%", display: "flex", alignItems: "center", gap: "10px" }}>
              <button style={{ 
                background: "white", 
                border: "1px solid #d9d9d9", 
                borderRadius: "6px", 
                width: "28px", 
                height: "28px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "16px"
              }}>
                ←
              </button>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: "20px" }}>Itinerary</h3>
            </div>

            {/* Right Header (Tabs) */}
            <div style={{ width: "45%", display: "flex", gap: "4px", background: "#d1d5db", borderRadius: "10px", padding: "4px" }}>
              <button onClick={() => setActiveTab("chat")} style={tabButtonStyle("chat")}>Chat</button>
              <button onClick={() => setActiveTab("destinations")} style={tabButtonStyle("destinations")}>Destinations</button>
              <button onClick={() => setActiveTab("summaries")} style={tabButtonStyle("summaries")}>Summaries</button>
            </div>
          </div>

          {/* COLUMN CONTENT ROW */}
          <div style={{ display: "flex", flexDirection: "row", gap: "30px", alignItems: "stretch", flex: 1, overflow: "hidden" }}>
            {/* Left Column Container */}
            <div style={{ width: "55%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <Column 
                id="right" 
                items={right} 
                dropIndicatorIndex={dropIndicator?.column === "right" ? dropIndicator.index : null} 
                onRemoveItem={handleRemoveItem} 
                width="100%" 
              />
            </div>

            {/* Right Column Container */}
            <div style={{ width: "45%", display: "flex", flexDirection: "column", background: "#e5e7eb", borderRadius: "20px", padding: "12px", overflow: "hidden" }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {activeTab === "chat" && <ChatColumn messages={chat} setMessages={setChat} chatInput={chatInput} setChatInput={setChatInput} />}
                
                {activeTab === "destinations" && (
                  <Column id="left" items={left} dropIndicatorIndex={dropIndicator?.column === "left" ? dropIndicator.index : null} onRemoveItem={handleRemoveItem} width="100%" transparent>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Add item" style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "none", background: "#fff", outline: "none" }} />
                      <button onClick={addItem} style={{ padding: "8px 14px", background: "#1db954", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600 }}>Add</button>
                    </div>
                  </Column>
                )}

                {activeTab === "summaries" && (
                  <div style={{ flex: 1, padding: "20px", textAlign: "center", color: "#666" }}>
                    <p>No summaries generated yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DragOverlay>
            {activeItem && <div style={{ padding: "14px", background: "#fff", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", minWidth: "200px" }}>{activeItem.text}</div>}
          </DragOverlay>
        </DndContext>
      </main>

      <footer style={{ height: "48px", flexShrink: 0, padding: "0 5%", display: "flex", alignItems: "center", justifyContent: "center", borderTop: "1px solid #d9d9d9", background: "#f5f5f5", fontSize: "14px", color: "#666" }}>
        ©Odyssey. Made with ❤️ by Route6
      </footer>
    </div>
  );
}