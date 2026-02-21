"use client";

import React from "react";
import { Send, MapPin, Sparkles, Plus, Calendar, Users, DollarSign, X, Loader2 } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import ClusteringView from "../../components/ClusteringView";
import MultiOptionSelector from "../../components/MultiOptionSelector";
import { VisitTrackingPanel } from "../../components/visit/VisitTrackingPanel";

// Types
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
    activeTab: "chat" | "destinations" | "summaries" | "visits";
    onTabChange: (tab: "chat" | "destinations" | "summaries" | "visits") => void;
    // Chat props
    chatMessages: any[];
    chatInput: string;
    setChatInput: (val: string) => void;
    onSendMessage: (e: React.FormEvent) => void;
    onAddCard: (item: Item) => void;
    onAddToCollections?: (item: Item) => void;
    // Destinations props
    searchResults: Item[];
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    onSearch: () => void;
    // Collections props
    collections?: Item[];
    onRemoveFromCollections?: (id: string) => void;
    // Summary props
    tripInfo?: any;
    onViewDetails: (item: Item) => void;
    // Destinations View Mode
    destinationsView?: "search" | "collections";
    setDestinationsView?: (view: "search" | "collections") => void;
    // AI Stage Props
    loading?: boolean;
    chatHistoryLoading?: boolean;
    stage?: "chat" | "clustering" | "options" | "confirmation";
    clusteringData?: any;
    clusteringLoading?: boolean;
    onClusteringContinue?: (selectedPlaces: any[]) => void;
    onClusteringCancel?: () => void;
    itineraryOptions?: any[];
    onSelectItineraryOption?: (option: any) => void;
    // Custom Requirements
    customRequirements?: string[];
    requirementInput?: string;
    onRequirementInputChange?: (val: string) => void;
    onAddRequirement?: () => void;
    onRemoveRequirement?: (index: number) => void;
    // Visit Tracking
    visitCount?: number;
    savedItinerary?: any;
    savedItineraryId?: string | null;
    onVisitChange?: (count: number) => void;
    // Itinerary places for Visits tab (manual drag-and-drop items)
    itineraryPlaces?: { day: number; name: string; time?: string; category?: string; isBreak?: boolean }[];
}

// Draggable source item for drag and drop
function SourceItem({ item, onAdd, onViewDetails, onRemove }: {
    item: Item;
    onAdd: (item: Item) => void;
    onViewDetails: (item: Item) => void;
    onRemove?: (id: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `source-${item.id}`,
        data: { ...item, type: "source-item" }
    });

    const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-move group mb-2 relative">
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h4>
                    {item.category && (
                        <span className="text-xs text-black/60 bg-gray-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                            {item.category}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); onViewDetails(item); }}
                        className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-full transition-colors"
                        title="View Details"
                    >
                        <span className="font-serif italic font-bold text-xs w-4 h-4 flex items-center justify-center border border-current rounded-full">i</span>
                    </button>
                    <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); onAdd(item); }}
                        className="p-1.5 hover:bg-[#4A9B7F] hover:text-white rounded-full text-gray-400 transition-colors"
                        title="Add to Itinerary"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                    {onRemove && (
                        <button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
                            className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                            title="Remove from Collections"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
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
    onAddToCollections,
    searchResults,
    searchQuery,
    setSearchQuery,
    onSearch,
    collections = [],
    onRemoveFromCollections,
    tripInfo,
    onViewDetails,
    destinationsView = "search",
    setDestinationsView,
    // AI Stage Props
    loading = false,
    chatHistoryLoading = false,
    stage = "chat",
    clusteringData,
    clusteringLoading = false,
    onClusteringContinue,
    onClusteringCancel,
    itineraryOptions = [],
    onSelectItineraryOption,
    // Custom Requirements
    customRequirements = [],
    requirementInput = "",
    onRequirementInputChange,
    onAddRequirement,
    onRemoveRequirement,
    // Visit Tracking
    visitCount = 0,
    savedItinerary,
    savedItineraryId,
    onVisitChange,
    itineraryPlaces,
}: ResourcePanelProps) {

    const tabs: Array<"chat" | "destinations" | "summaries" | "visits"> = ["chat", "destinations", "summaries", "visits"];

    return (
        <div className="h-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="p-2 border-b border-gray-100 flex gap-2 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => onTabChange(tab)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex-1 whitespace-nowrap relative ${activeTab === tab
                            ? "bg-black text-white shadow-md"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        {tab === "visits" && visitCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                                {visitCount}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col relative">

                {/* ========== CHAT TAB ========== */}
                {activeTab === "chat" && (
                    <>
                        {/* Clustering Stage */}
                        {stage === "clustering" && clusteringData && onClusteringContinue && (
                            <div className="flex-1 overflow-y-auto p-4">
                                <ClusteringView
                                    data={clusteringData}
                                    loading={clusteringLoading}
                                    onContinue={onClusteringContinue}
                                    onCancel={onClusteringCancel || (() => { })}
                                />
                            </div>
                        )}

                        {/* Options Selection Stage */}
                        {stage === "options" && itineraryOptions.length > 0 && onSelectItineraryOption && (
                            <div className="flex-1 overflow-y-auto p-4">
                                <MultiOptionSelector
                                    itineraries={itineraryOptions}
                                    onSelect={onSelectItineraryOption}
                                />
                            </div>
                        )}

                        {/* Regular Chat */}
                        {stage === "chat" && (
                            <>
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                    {chatHistoryLoading ? (
                                        <div className="flex items-center justify-center py-12 text-gray-400">
                                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                            Loading chat...
                                        </div>
                                    ) : (
                                        chatMessages.map((msg: any, idx: number) => (
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
                                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                                    {/* Render cards if any */}
                                                    {msg.cards && msg.cards.length > 0 && (
                                                        <div className="mt-3 space-y-2">
                                                            {msg.cards.map((card: Item, cIdx: number) => (
                                                                <SourceItem
                                                                    key={card.id || `${idx}-${cIdx}`}
                                                                    item={card}
                                                                    onAdd={() => onAddToCollections ? onAddToCollections(card) : onAddCard(card)}
                                                                    onViewDetails={onViewDetails}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    {loading && (
                                        <div className="flex justify-start">
                                            <div className="bg-gray-100 rounded-2xl p-4 rounded-tl-sm">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Thinking...
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Custom Requirements Box - visible when editing after generation */}
                                {itineraryOptions.length > 0 && onAddRequirement && onRemoveRequirement && (
                                    <div className="mx-3 mb-2 p-3 bg-amber-50 rounded-xl border-2 border-amber-200">
                                        <div className="text-xs font-semibold text-amber-700 mb-2">📋 Custom Requirements</div>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={requirementInput}
                                                onChange={(e) => onRequirementInputChange?.(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && onAddRequirement()}
                                                placeholder="e.g., 'visit museum first'"
                                                className="flex-1 px-3 py-1.5 text-xs border border-amber-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                                            />
                                            <button
                                                onClick={onAddRequirement}
                                                disabled={!requirementInput.trim()}
                                                className="px-3 py-1.5 text-xs font-semibold bg-amber-200 text-amber-800 rounded-lg disabled:opacity-50 hover:bg-amber-300 transition-colors"
                                            >
                                                + Add
                                            </button>
                                        </div>
                                        {customRequirements.length > 0 && (
                                            <div className="space-y-1">
                                                {customRequirements.map((req, idx) => (
                                                    <div key={idx} className="flex items-center justify-between bg-white px-2 py-1 rounded-md text-xs text-amber-800 border border-amber-200">
                                                        <span>✓ {req}</span>
                                                        <button onClick={() => onRemoveRequirement(idx)} className="text-red-400 hover:text-red-600 font-bold text-sm ml-2">×</button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {customRequirements.length === 0 && (
                                            <p className="text-[11px] text-amber-600 italic">No custom requirements yet.</p>
                                        )}
                                    </div>
                                )}

                                <form onSubmit={onSendMessage} className="p-3 bg-white border-t border-gray-100">
                                    <div className="relative flex items-center bg-gray-50 rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-[#4A9B7F] transition-all px-2">
                                        <input
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            placeholder="Ask Odyssey..."
                                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-2 outline-none"
                                        />
                                        <button type="submit" disabled={loading} className="p-2 bg-[#4A9B7F] text-white rounded-full hover:bg-[#3d8269] transition-transform active:scale-95 disabled:opacity-50">
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </>
                )}

                {/* ========== DESTINATIONS TAB ========== */}
                {activeTab === "destinations" && (
                    <div className="flex flex-col h-full">
                        {/* Sub-tabs */}
                        <div className="flex border-b border-gray-100">
                            <button
                                onClick={() => setDestinationsView?.("search")}
                                className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider ${destinationsView === "search" ? "text-[#4A9B7F] border-b-2 border-[#4A9B7F]" : "text-gray-400"}`}
                            >
                                Search
                            </button>
                            <button
                                onClick={() => setDestinationsView?.("collections")}
                                className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider ${destinationsView === "collections" ? "text-[#4A9B7F] border-b-2 border-[#4A9B7F]" : "text-gray-400"}`}
                            >
                                Collections ({collections.length})
                            </button>
                        </div>

                        {destinationsView === "search" ? (
                            <>
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
                                            <SourceItem
                                                key={item.id}
                                                item={item}
                                                onAdd={() => onAddCard(item)}
                                                onViewDetails={onViewDetails}
                                            />
                                        ))}
                                        {searchResults.length === 0 && (
                                            <p className="text-center text-gray-400 text-sm py-8 italic">Search for places to add to your itinerary</p>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">My Collections</h3>
                                <div className="space-y-2">
                                    {collections.map((item) => (
                                        <SourceItem
                                            key={item.id}
                                            item={item}
                                            onAdd={() => onAddCard(item)}
                                            onViewDetails={onViewDetails}
                                            onRemove={onRemoveFromCollections}
                                        />
                                    ))}
                                    {collections.length === 0 && (
                                        <p className="text-center text-gray-400 text-sm py-8 italic">No items in collections yet.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ========== SUMMARIES TAB ========== */}
                {activeTab === "summaries" && tripInfo && (
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
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

                {/* ========== VISITS TAB ========== */}
                {activeTab === "visits" && (
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {savedItinerary && savedItineraryId ? (
                            <VisitTrackingPanel
                                itineraryId={savedItineraryId}
                                places={savedItinerary.schedule?.flatMap((day: any) =>
                                    day.items?.map((item: any) => ({
                                        id: item.placeId || item.id || `place-${Math.random()}`,
                                        name: item.place || item.name,
                                        category: item.activity || item.category,
                                        expectedDuration: 3600
                                    })) || []
                                ) || []}
                                token={typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''}
                                onVisitChange={onVisitChange || (() => { })}
                            />
                        ) : itineraryPlaces && itineraryPlaces.filter(p => !p.isBreak).length > 0 ? (
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm mb-3">📋 Planned Visits</h4>
                                <p className="text-xs text-gray-400 mb-4">Items from your itinerary timeline. Save the trip to start tracking visits.</p>
                                {(() => {
                                    const days = [...new Set(itineraryPlaces.filter(p => !p.isBreak).map(p => p.day))].sort();
                                    return days.map(day => (
                                        <div key={day} className="mb-4">
                                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Day {day}</div>
                                            {itineraryPlaces.filter(p => p.day === day && !p.isBreak).map((place, idx) => (
                                                <div key={idx} className="flex items-center gap-3 py-2 px-3 bg-gray-50 rounded-lg mb-1.5">
                                                    <span className="font-mono text-xs font-bold text-[#4A9B7F] bg-[#4A9B7F]/10 px-2 py-0.5 rounded">
                                                        {place.time || '--:--'}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-800 truncate">{place.name}</p>
                                                        {place.category && <p className="text-xs text-gray-400">{place.category}</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ));
                                })()}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <p className="text-sm italic">No planned visits yet.</p>
                                <p className="text-xs mt-2">Add places to your itinerary to see them here.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
