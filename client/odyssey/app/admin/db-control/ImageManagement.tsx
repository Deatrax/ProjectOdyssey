"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface SearchResult {
  id: string;
  name: string;
  type: string; // 'COUNTRY' | 'DISTRICT' | 'POI'
  country?: string;
  district?: string;
  google_place_id?: string;
}

interface PlaceImage {
  id: string;
  url: string;
  display_order: number;
  caption: string;
}

export default function ImageManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<SearchResult | null>(null);

  const [images, setImages] = useState<PlaceImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [isPopulating, setIsPopulating] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const res = await fetch(`http://localhost:4000/api/places?search_query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.places) {
        setSearchResults(data.places);
      }
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPlace = (place: SearchResult) => {
    setSelectedPlace(place);
    setSearchQuery("");
    setSearchResults([]);
    fetchImages(place);
  };

  const fetchImages = async (place: SearchResult) => {
    setIsLoadingImages(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await fetch(`http://localhost:4000/api/admin/images/${place.type}/${place.id}`);
      const data = await res.json();
      if (data.success) {
        setImages(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setMessage({ text: "Failed to load images", type: "error" });
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handlePopulate = async () => {
    if (!selectedPlace) return;

    setIsPopulating(true);
    setMessage({ text: "Fetching and uploading images... This might take a minute.", type: "info" });

    try {
      const payload = {
        placeId: selectedPlace.id,
        placeType: selectedPlace.type,
        name: selectedPlace.name,
        cityName: selectedPlace.district || selectedPlace.country,
        googlePlaceId: selectedPlace.google_place_id
      };

      const res = await fetch(`http://localhost:4000/api/admin/images/populate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (data.success) {
        setMessage({ text: `Successfully added ${data.count} images!`, type: "success" });
        fetchImages(selectedPlace); // Refresh images
      } else {
        throw new Error(data.error || "Unknown error occurred.");
      }
    } catch (err: any) {
      setMessage({ text: `Failed to populate: ${err.message}`, type: "error" });
    } finally {
      setIsPopulating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <div className="relative z-50">
        <label className="block text-sm font-bold text-gray-700 mb-2">Search Destination to Manage Images</label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search country, district, or place..."
            className="w-full p-4 pl-12 border rounded-xl shadow-sm focus:ring-2 focus:ring-[#4A9B7F] focus:outline-none text-lg"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
             {isSearching ? (
                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
             ) : (
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
             )}
          </div>
        </div>

        {/* Dropdown Results */}
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-80 overflow-y-auto w-full z-50">
            {searchResults.map((place) => (
              <div
                key={place.id}
                onClick={() => handleSelectPlace(place)}
                className="p-4 hover:bg-gray-50 border-b border-gray-50 cursor-pointer flex justify-between items-center transition-colors"
              >
                <div>
                  <h4 className="font-bold text-gray-900">{place.name}</h4>
                  <p className="text-xs text-gray-500">
                    {place.type === 'POI' && place.district ? `${place.district}, ` : ''}{place.country}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  place.type === 'COUNTRY' ? 'bg-blue-100 text-blue-700' :
                  place.type === 'DISTRICT' ? 'bg-purple-100 text-purple-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {place.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Place Section */}
      {selectedPlace && (
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedPlace.name}</h2>
              <p className="text-gray-500 text-sm">
                Managing images for {selectedPlace.type.toLowerCase()} in {selectedPlace.type === 'POI' ? selectedPlace.district : ''} {selectedPlace.country}
              </p>
            </div>
            <button
              onClick={handlePopulate}
              disabled={isPopulating}
              className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                isPopulating ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#4A9B7F] to-[#2d6b55] hover:scale-105'
              }`}
            >
              {isPopulating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Populating...
                </>
              ) : (
                <>
                  <span>📥</span> Auto-Populate Images
                </>
              )}
            </button>
          </div>

          {/* Messages */}
          {message.text && (
            <div className={`p-4 mb-6 rounded-lg text-sm font-semibold flex items-center gap-2 ${
              message.type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' :
              message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' :
              'bg-blue-100 text-blue-700 border border-blue-200'
            }`}>
              {message.type === 'success' && '✅'}
              {message.type === 'error' && '❌'}
              {message.type === 'info' && '⏳'}
              {message.text}
            </div>
          )}

          {/* Image Grid */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              Existing Images <span className="text-gray-400 text-sm font-normal">({images.length})</span>
            </h3>
            
            {isLoadingImages ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-[#4A9B7F]"></div>
              </div>
            ) : images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div key={img.id} className="relative aspect-video rounded-xl overflow-hidden shadow-md group">
                    <img 
                      src={img.url} 
                      alt={img.caption || 'Place Image'} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                       <p className="text-white text-xs truncate">Order: {img.display_order}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 text-center rounded-xl border border-dashed border-gray-300">
                <span className="text-4xl mb-4 block">📸</span>
                <p className="text-gray-500 font-medium">No images found for this place.</p>
                <p className="text-gray-400 text-sm mt-1">Click "Auto-Populate" to fetch some.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
