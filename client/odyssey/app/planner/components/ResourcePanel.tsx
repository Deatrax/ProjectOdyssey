"use client";

import React, { useState } from "react";
import { Send, MapPin, Sparkles, Plus, Calendar, Users, DollarSign, Layout } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

// Re-using types
type Item = {
    id: string;
    name: string;
    category?: string;
    visitDurationMin?: number;
    description?: string;
    images?: string[];
    reviews?: any[];
};

interface ResourcePanelProps {
    activeTab: "chat" | "destinations" | "summaries";
    onTabChange: (tab: "chat" | "destinations" | "summaries") => void;
    // Chat props
    chatMessages: any[];
    chatInput: string;
    setChatInput: (val: string) => void;
    onSendMessage: (e: React.FormEvent) => void;
    onAddCard: (item: Item) => void;
    // Destinations props
    searchResults: Item[];
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    onSearch: () => void;
    // Summary props
    tripInfo?: any;
}

function DraggableSourceItem({ item, onAdd }: { item: Item; onAdd: () => void }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `source-${item.id}`,
        data: { ...item, type: "source-item" }
    });

    const style = transform ? {
        transform: CSS.Translate.toString(transform),
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-move group mb-2"
        >
            <div className="flex items-start justify-between gap-2">
                <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                    {item.category && (
                        <span className="text-xs text-black/60 bg-gray-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                            {item.category}
                        </span>
                    )}
                </div>
                <button
                    onPointerDown={(e) => e.stopPropagation()} // Prevent drag start on button click
                    onClick={onAdd}
                    className="p-1 hover:bg-[#4A9B7F] hover:text-white rounded-full text-gray-400 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default function ResourcePanel({
    activeTab,
    onTabChange,
    chatMessages,
    chatInput,
    setChatInput,
    onSendMessage,
    onAddCard,
    searchResults,
    searchQuery,
    setSearchQuery,
    onSearch,
    tripInfo
}: ResourcePanelProps) {

    return (
        <div className="h-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="p-2 border-b border-gray-100 flex gap-2 overflow-x-auto">
                {(["chat", "destinations", "summaries"] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => onTabChange(tab)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex-1 whitespace-nowrap ${activeTab === tab
                                ? "bg-black text-white shadow-md"
                                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col relative">
                {activeTab === "chat" && (
                    <>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {chatMessages.map((msg: any, idx: number) => (
                                <div
                                    key={msg.id || idx}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${msg.sender === "user"
                                                ? "bg-black text-white rounded-tr-sm"
                                                : "bg-gray-100 text-gray-900 rounded-tl-sm"
                                            }`}
                                    >
                                        <p>{msg.text}</p>
                                        {/* Render cards if any */}
                                        {msg.cards && msg.cards.length > 0 && (
                                            <div className="mt-3 space-y-2">
                                                {msg.cards.map((card: Item, cIdx: number) => (
                                                    <DraggableSourceItem
                                                        key={card.id || `${idx}-${cIdx}`}
                                                        item={card}
                                                        onAdd={() => onAddCard(card)}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={onSendMessage} className="p-3 bg-white border-t border-gray-100">
                            <div className="relative flex items-center bg-gray-50 rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-[#4A9B7F] transition-all px-2">
                                <input
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="Ask Odyssey..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-2 outline-none"
                                />
                                <button type="submit" className="p-2 bg-[#4A9B7F] text-white rounded-full hover:bg-[#3d8269] transition-transform active:scale-95">
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </>
                )}

                {activeTab === "destinations" && (
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b border-gray-100 space-y-3 bg-white z-10">
                            <div className="relative">
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search attractions..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4A9B7F] transition-all"
                                />
                                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            </div>
                            <button
                                onClick={onSearch}
                                className="w-full py-2 bg-[#4A9B7F] text-white rounded-xl text-sm font-medium hover:bg-[#3d8269] transition-colors flex items-center justify-center gap-2"
                            >
                                <Sparkles className="w-4 h-4" />
                                Find Places
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Suggestions</h3>
                            <div className="space-y-2">
                                {searchResults.map((item) => (
                                    <DraggableSourceItem
                                        key={item.id}
                                        item={item}
                                        onAdd={() => onAddCard(item)}
                                    />
                                ))}
                                {searchResults.length === 0 && (
                                    <p className="text-center text-gray-400 text-sm py-8 italic">Search for places to add to your itinerary</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "summaries" && tripInfo && (
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
                        {/* Trip Details Card */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Trip Details
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Dates</span>
                                    <span className="font-medium">{tripInfo.dates || "Not set"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Travelers</span>
                                    <span className="font-medium">{tripInfo.travelers || 1} people</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Duration</span>
                                    <span className="font-medium">{tripInfo.days || 1} days</span>
                                </div>
                            </div>
                        </div>

                        {/* Cost Estimation */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" /> Cost Estimation
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Total Budget</span>
                                    <span className="font-medium text-[#4A9B7F] font-bold">{tripInfo.budget || "$-"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
