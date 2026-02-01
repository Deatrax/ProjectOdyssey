"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Clock, Plus, MapPin, Edit2, Trash2 } from "lucide-react";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Re-using Item type from parent roughly
type Item = {
    id: string;
    name: string;
    category?: string;
    visitDurationMin?: number;
    time?: string; // "09:00"
    description?: string;
};

interface TimelineViewProps {
    day: number;
    items: Item[];
    onRemoveItem: (id: string) => void;
    onEditItem?: (item: Item) => void;
    onAddItem?: (time: string) => void;
}

function SortableTimelineItem({ item, onRemove, onEdit }: { item: Item; onRemove: () => void; onEdit?: () => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id, data: { ...item, type: "timeline-item" } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 50 : "auto",
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative pl-14 py-2 group ${isDragging ? "z-50" : ""}`}
        >
            {/* Time Line Connector */}
            <div className="absolute left-[29px] top-0 bottom-0 w-[2px] bg-gray-100 group-last:bottom-auto group-last:h-1/2"></div>

            {/* Time Marker */}
            <div className="absolute left-0 top-6 flex items-center justify-center w-[60px]">
                <span className="text-xs font-semibold text-gray-400 bg-white px-1 z-10">{item.time}</span>
            </div>

            {/* Dot on line */}
            <div className="absolute left-[25px] top-8 w-2.5 h-2.5 rounded-full bg-black border-2 border-white shadow-sm z-10"></div>

            {/* Card */}
            <div
                {...attributes}
                {...listeners}
                className="ml-4 bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing hover:border-[#4A9B7F]/30"
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">{item.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            {item.category && (
                                <span className="px-2 py-0.5 bg-gray-50 rounded-md border border-gray-100 capitalize">
                                    {item.category}
                                </span>
                            )}
                            {item.visitDurationMin && (
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {item.visitDurationMin}m
                                </span>
                            )}
                        </div>
                        {item.description && (
                            <p className="text-xs text-gray-400 mt-2 line-clamp-2">{item.description}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onEdit && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <Edit2 className="w-3.5 h-3.5" />
                            </button>
                        )}
                        <button
                            onClick={(e) => { e.stopPropagation(); onRemove(); }}
                            className="p-1.5 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TimelineView({ day, items, onRemoveItem, onEditItem, onAddItem }: TimelineViewProps) {
    // We treat the entire timeline as a droppable container
    const { setNodeRef } = useDroppable({
        id: `timeline-day-${day}`,
        data: { type: "timeline-container", day }
    });

    // Sort items by time string if needed, but usually parent handles order or dnd-kit
    // Assuming items are already sorted or parent handles it.

    // Generate hours for empty slots visualization or just list items?
    // User requested "hour by hour view like on a calender but vertically".
    // For simplicity, we list the items and maybe add "Add Activity" buttons in between or at bottom.
    // Given the complexity of rigid 24h grids, a sequential list with time headers is often better for itineraries.

    // Let's stick to the sequential list like the example but with vertical line connector.

    return (
        <div className="h-full flex flex-col bg-gray-50/50 rounded-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                        {day}
                    </div>
                    <h3 className="font-semibold text-gray-900">Day {day} Itinerary</h3>
                </div>
                <button title="Add Item" onClick={() => onAddItem?.("09:00")} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div ref={setNodeRef} className="flex-1 overflow-y-auto p-4 custom-scrollbar relative min-h-[500px]">
                {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4 min-h-[300px]">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                            <Clock className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-sm">No activities planned yet.</p>
                        <p className="text-xs max-w-[200px] text-center text-gray-400">Drag items from the suggestions or options panel to add them here.</p>
                    </div>
                ) : (
                    <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                        <div className="pb-10">
                            {items.map((item) => (
                                <SortableTimelineItem
                                    key={item.id}
                                    item={item}
                                    onRemove={() => onRemoveItem(item.id)}
                                    onEdit={() => onEditItem?.(item)}
                                />
                            ))}

                            {/* Add Button at end */}
                            <div className="relative pl-14 pt-2 group">
                                <div className="absolute left-[29px] top-0 h-8 w-[2px] bg-gray-100"></div>
                                <button
                                    onClick={() => onAddItem?.("12:00")}
                                    className="ml-4 w-[calc(100%-1rem)] border-2 border-dashed border-gray-200 rounded-xl p-4 flex items-center justify-center gap-2 text-gray-400 hover:border-[#4A9B7F] hover:text-[#4A9B7F] transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span className="text-sm font-medium">Add Activity</span>
                                </button>
                            </div>
                        </div>
                    </SortableContext>
                )}
            </div>
        </div>
    );
}
