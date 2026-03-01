"use client";

import React, { useState, useEffect } from "react";

interface PlaceOption {
  id: string;
  name: string;
  type: string;
  google_place_id?: string;
}

interface ImageRecord {
  id: string;
  url: string;
  caption: string;
  alt_text: string;
  display_order: number;
  place_id: string;
  place_type: string;
}

export default function ImageManagerTab() {
  // Place selection
  const [searchQuery, setSearchQuery] = useState("");
  const [placeResults, setPlaceResults] = useState<PlaceOption[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceOption | null>(null);
  const [placeType, setPlaceType] = useState<"POI" | "CITY" | "COUNTRY">("POI");

  // Images
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  // Populate
  const [populating, setPopulating] = useState(false);
  const [populateLog, setPopulateLog] = useState<string[]>([]);

  // Search for places in admin DB
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const table = placeType === "POI" ? "places" : placeType === "CITY" ? "cities" : "countries";
      const res = await fetch(
        `http://localhost:4000/api/admin/${table}?search=${encodeURIComponent(searchQuery)}&limit=20`
      );
      const data = await res.json();
      if (data.success && data.data) {
        setPlaceResults(
          data.data.map((item: any) => ({
            id: String(item.id || item.place_id),
            name: item.name,
            type: placeType,
            google_place_id: item.google_place_id,
          }))
        );
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // Select a place and load its images
  const selectPlace = async (place: PlaceOption) => {
    setSelectedPlace(place);
    setPlaceResults([]);
    setSearchQuery(place.name);
    await loadImages(place.id);
  };

  // Load images for a place
  const loadImages = async (placeId: string) => {
    setLoadingImages(true);
    try {
      const res = await fetch(`http://localhost:4000/api/admin/images/${placeId}`);
      const data = await res.json();
      if (data.success) {
        setImages(data.images || []);
      }
    } catch (err) {
      console.error("Load images error:", err);
    } finally {
      setLoadingImages(false);
    }
  };

  // Populate images
  const handlePopulate = async () => {
    if (!selectedPlace) return;
    setPopulating(true);
    setPopulateLog(["Starting image population..."]);

    try {
      const res = await fetch("http://localhost:4000/api/admin/images/populate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          place_id: selectedPlace.id,
          place_type: selectedPlace.type,
          place_name: selectedPlace.name,
          google_place_id: selectedPlace.google_place_id,
        }),
      });

      const data = await res.json();
      setPopulateLog((prev) => [
        ...prev,
        data.message || `Done: ${data.total || 0} images uploaded`,
        ...(data.errors || []).map((e: string) => `⚠️ ${e}`),
      ]);

      // Reload images
      await loadImages(selectedPlace.id);
    } catch (err: any) {
      setPopulateLog((prev) => [...prev, `❌ Error: ${err.message}`]);
    } finally {
      setPopulating(false);
    }
  };

  // Delete image
  const handleDelete = async (imageId: string) => {
    if (!confirm("Delete this image?")) return;
    try {
      await fetch(`http://localhost:4000/api/admin/images/${imageId}`, { method: "DELETE" });
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">🖼️ Image Manager</h2>
        <p className="text-sm text-gray-500">
          Select a place and populate its images from Google Maps + Unsplash
        </p>
      </div>

      {/* Place Type + Search */}
      <div className="flex gap-3 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>
          <select
            value={placeType}
            onChange={(e) => {
              setPlaceType(e.target.value as any);
              setSelectedPlace(null);
              setImages([]);
            }}
            className="p-2 border border-gray-300 rounded-lg bg-white text-sm font-medium focus:ring-2 focus:ring-[#F19E39] focus:outline-none"
          >
            <option value="POI">Place (POI)</option>
            <option value="CITY">City</option>
            <option value="COUNTRY">Country</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Search Place</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Type a place name..."
              className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F19E39] focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-[#4A9B7F] text-white rounded-lg text-sm font-semibold hover:bg-[#3d8a6d] transition"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {placeResults.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto divide-y divide-gray-100">
          {placeResults.map((place) => (
            <div
              key={place.id}
              onClick={() => selectPlace(place)}
              className="flex items-center justify-between px-4 py-3 hover:bg-amber-50 cursor-pointer transition"
            >
              <div>
                <span className="font-semibold text-gray-900 text-sm">{place.name}</span>
                {place.google_place_id && (
                  <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">
                    Google ID ✓
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">{place.id.slice(0, 8)}...</span>
            </div>
          ))}
        </div>
      )}

      {/* Selected Place */}
      {selectedPlace && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                Selected {selectedPlace.type}
              </span>
              <h3 className="text-lg font-bold text-gray-900">{selectedPlace.name}</h3>
              <span className="text-xs text-gray-500">ID: {selectedPlace.id}</span>
            </div>

            <button
              onClick={handlePopulate}
              disabled={populating}
              className={`px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 ${
                populating
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-[#F19E39] hover:bg-[#e08c2a] text-white hover:scale-105"
              }`}
            >
              {populating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Populating...
                </>
              ) : (
                <>🚀 Populate Images</>
              )}
            </button>
          </div>

          {/* Populate Log */}
          {populateLog.length > 0 && (
            <div className="mt-3 bg-white/80 rounded-lg p-3 max-h-32 overflow-y-auto">
              {populateLog.map((log, i) => (
                <p key={i} className="text-xs text-gray-600 font-mono">
                  {log}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Image Grid */}
      {selectedPlace && (
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            Images
            <span className="text-sm font-normal text-gray-400">({images.length})</span>
          </h3>

          {loadingImages ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-40 bg-gray-200 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <div className="text-4xl mb-3">📷</div>
              <p className="text-gray-500 font-medium">No images yet</p>
              <p className="text-gray-400 text-sm">
                Click "Populate Images" to fetch from Google Maps + Unsplash
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
                >
                  <img
                    src={img.url}
                    alt={img.alt_text || img.caption || "Place image"}
                    className="w-full h-40 object-cover"
                  />

                  {/* Source badge */}
                  <div className="absolute top-2 left-2">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        img.caption === "google_maps"
                          ? "bg-blue-500 text-white"
                          : "bg-purple-500 text-white"
                      }`}
                    >
                      {img.caption === "google_maps" ? "Google" : "Unsplash"}
                    </span>
                  </div>

                  {/* Order badge */}
                  <div className="absolute top-2 right-2">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-black/50 text-white">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Delete overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <button
                      onClick={() => handleDelete(img.id)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
