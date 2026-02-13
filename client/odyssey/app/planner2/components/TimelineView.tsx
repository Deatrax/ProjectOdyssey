"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Clock, GripVertical, Trash2, Edit2, Plus } from "lucide-react";

type ItineraryItem = {
    id: string;
    name: string;
    category?: string;
    visitDurationMin?: number;
    time?: string;
    description?: string;
    source?: "db" | "ai";
};

interface TimelineViewProps {
    day: number;
    items: ItineraryItem[];
    onRemoveItem: (id: string) => void;
    onEditItem: (item: ItineraryItem) => void;
    onAddItem?: (time: string) => void;
    onUpdateItemTime?: (id: string, newTime: string) => void;
}

function SortableTimelineItem({ item, onRemove, onEdit }: { item: ItineraryItem; onRemove: () => void; onEdit: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: item.id,
        data: { ...item, type: "timeline-item" }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="group relative pl-4 pr-3 py-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all mb-3 flex gap-3 items-start z-10 w-[95%] ml-auto">
            {/* Time Indicator Line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#4A9B7F] rounded-l-xl"></div>

            <div className="mt-1 text-gray-400 cursor-grab active:cursor-grabbing" {...listeners} {...attributes}>
                <GripVertical size={16} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-[#4A9B7F] bg-[#4A9B7F]/10 px-2 py-0.5 rounded-md">
                        {item.time || "09:00"}
                    </span>
                    <h4 className="font-bold text-gray-900 text-sm truncate">{item.name}</h4>
                </div>
                {item.category && (
                    <p className="text-xs text-gray-500 mb-1">{item.category}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock size={12} />
                    <span>{item.visitDurationMin || 60} min</span>
                </div>
            </div>

            <div className="flex flex-col gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={onEdit} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit2 size={14} />
                </button>
                <button onClick={onRemove} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
}

export default function TimelineView({ day, items = [], onRemoveItem, onEditItem, onAddItem }: TimelineViewProps) {
    // Generate hours 08:00 to 22:00
    const hours = Array.from({ length: 15 }, (_, i) => {
        const h = i + 8;
        return `${h.toString().padStart(2, '0')}:00`;
    });

    // We need to render the droppable area for the DAY
    const { setNodeRef } = useDroppable({
        id: `timeline-day-${day}`,
    });

    // Sort items by time
    const safeItems = Array.isArray(items) ? items : [];
    const sortedItems = [...safeItems].sort((a, b) => (a.time || "00:00").localeCompare(b.time || "00:00"));

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden">

            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    Day {day} <span className="text-xs font-normal text-gray-500 bg-white border px-2 py-0.5 rounded-full">{safeItems.length} Activities</span>
                </h3>
                <button
                    onClick={() => onAddItem?.("09:00")}
                    className="text-xs flex items-center gap-1 font-medium text-[#4A9B7F] hover:bg-[#4A9B7F]/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                    <Plus size={14} /> Add Item
                </button>
            </div>

            {/* Scrollable Timeline */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar relative" ref={setNodeRef}>
                <SortableContext items={sortedItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
                    {/* Render Hour Slots Visualization */}
                    <div className="relative min-h-[800px]">
                        {/* Background Grid */}
                        <div className="absolute inset-0 pointer-events-none">
                            {hours.map((hour, i) => (
                                <div key={hour} className="flex h-16 border-b border-dashed border-gray-100 last:border-0" style={{ top: `${i * 64}px`, position: 'absolute', width: '100%' }}>
                                    <span className="text-xs font-mono text-gray-300 w-12 pt-2">{hour}</span>
                                    <div className="flex-1"></div>
                                </div>
                            ))}
                        </div>

                        {/* Items Layer - Positioning logic could be absolute based on time, but for now specific DnD list is safer */}
                        {/* If we want strict time slots, we'd map items to slots. But DnD list is requested. 
                           Let's overlay the list ON TOP of the grid for visual cue. 
                           Ideally, dragging releases into a 'slot'. 
                           For V1, keep list but sort by time. 
                        */}
                        <div className="pl-12 pt-2 space-y-2">
                            {sortedItems.length > 0 ? (
                                sortedItems.map((item) => (
                                    <SortableTimelineItem
                                        key={item.id}
                                        item={item}
                                        onRemove={() => onRemoveItem(item.id)}
                                        onEdit={() => onEditItem(item)}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-20 text-gray-400 italic">
                                    Drag places here from the right
                                </div>
                            )}
                        </div>

                    </div>
                </SortableContext>
            </div>
        </div>
    );
}
