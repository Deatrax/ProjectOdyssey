"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PlaceDetailsModal from "../../../components/PlaceDetailsModal";

interface DestinationCardProps {
    id: string;
    name: string;
    type: string;
    country: string;
    img_url?: string;
    short_desc?: string;
}

function SearchResultsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q") || "";

    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<DestinationCardProps[]>([]);
    const [loading, setLoading] = useState(false);

    // Modal State
    const [selectedPlace, setSelectedPlace] = useState<DestinationCardProps | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (initialQuery) {
            performSearch(initialQuery);
        }
    }, [initialQuery]);

    const performSearch = async (searchTerm: string) => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:4000/api/places?search_query=${encodeURIComponent(searchTerm)}`);
            const data = await res.json();
            if (data.places) {
                setResults(data.places);
            }
        } catch (err) {
            console.error("Search failed", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/destinations/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className="bg-[#FFF5E9] min-h-screen font-body pb-20">

            {/* Modal */}
            {selectedPlace && (
                <PlaceDetailsModal
                    place={selectedPlace as any}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAddToCollection={() => { alert("Added to collection!") }}
                />
            )}

            {/* Navbar (Simplified for sub-page) */}
            <nav className="sticky top-0 z-40 px-6 py-4 bg-[#FFF5E9]/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/dashboard")}>
                        <span className="text-2xl font-bold font-odyssey text-gray-900">Odyssey</span>
                    </div>

                    <div className="flex-1 max-w-2xl mx-8">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full pl-5 pr-12 py-3 rounded-full border border-gray-300 focus:border-[#4A9B7F] focus:ring-2 focus:ring-[#4A9B7F]/20 outline-none transition-all"
                                placeholder="Search places..."
                            />
                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[#4A9B7F] text-white rounded-full hover:bg-[#3d8a6d]">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </button>
                        </form>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push("/destinations")} className="text-gray-600 hover:text-gray-900 font-medium">Back to Browse</button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {loading ? "Searching..." : `Results for "${initialQuery}"`}
                </h1>
                <p className="text-gray-500 mb-8">{!loading && `${results.length} places found`}</p>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : results.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {results.map(place => (
                            <div
                                key={place.id}
                                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer"
                                onClick={() => { setSelectedPlace(place); setIsModalOpen(true); }}
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={`https://source.unsplash.com/600x400/?${place.name}`}
                                        alt={place.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                        {place.type}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{place.name}</h3>
                                    <p className="text-gray-500 text-sm mb-3 flex items-center gap-1">
                                        <span className="text-[#4A9B7F]">📍</span> {place.country}
                                    </p>
                                    <p className="text-gray-600 text-sm line-clamp-2">{place.short_desc || "Explore this amazing destination with detailed guides and itineraries."}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-900">No results found</h3>
                        <p className="text-gray-500 mt-2">Try checking your spelling or searching for a country instead.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <SearchResultsContent />
        </Suspense>
    );
}
