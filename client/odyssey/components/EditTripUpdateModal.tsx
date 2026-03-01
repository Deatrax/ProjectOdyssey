"use client";

import React, { useState } from 'react';
import { X, ChevronDown, MapPin, Loader2, Plus, Trash2 } from 'lucide-react';
import { updatePost } from '@/hooks/usePosts';
import type { Post } from '@/hooks/usePosts';

interface TripLocation {
  name: string;
  placeId: string;
  visitedAt: string;
  photos: string[];
  isCurrentLocation: boolean;
}

interface EditTripUpdateModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditTripUpdateModal({ post, isOpen, onClose, onUpdated }: EditTripUpdateModalProps) {
  const [tripName, setTripName] = useState(post.tripName || '');
  const [completionPercentage, setCompletionPercentage] = useState(
    post.tripProgress?.completionPercentage || 0
  );
  const [tripLocations, setTripLocations] = useState<TripLocation[]>(
    post.tripProgress?.locations?.map(l => ({
      name: l.name,
      placeId: l.placeId || '',
      visitedAt: l.visitedAt
        ? new Date(l.visitedAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      photos: l.photos || [],
      isCurrentLocation: l.isCurrentLocation || false,
    })) || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const addLocation = () => {
    setTripLocations([...tripLocations, {
      name: '',
      placeId: '',
      visitedAt: new Date().toISOString().split('T')[0],
      photos: [],
      isCurrentLocation: false,
    }]);
  };

  const updateLocation = (index: number, field: string, value: any) => {
    const updated = [...tripLocations];
    (updated[index] as any)[field] = value;
    setTripLocations(updated);
  };

  const removeLocation = (index: number) => {
    setTripLocations(tripLocations.filter((_, i) => i !== index));
  };

  const addPhotoToLocation = (index: number) => {
    const url = prompt('Enter photo URL:');
    if (url?.trim()) {
      const updated = [...tripLocations];
      updated[index].photos.push(url.trim());
      setTripLocations(updated);
    }
  };

  const handleSubmit = async () => {
    if (!tripName.trim()) {
      alert('Please enter a trip name!');
      return;
    }
    if (tripLocations.length === 0) {
      alert('Please add at least one location!');
      return;
    }

    const currentLoc = tripLocations.find(l => l.isCurrentLocation);
    setIsSubmitting(true);

    const result = await updatePost(post._id, {
      tripName: tripName.trim(),
      tripProgress: {
        locations: tripLocations,
        currentLocationName: currentLoc?.name || tripLocations[tripLocations.length - 1]?.name || '',
        totalLocations: tripLocations.length,
        completionPercentage,
      },
    } as any);

    setIsSubmitting(false);

    if (result.success) {
      onUpdated();
      onClose();
    } else {
      alert(result.error || 'Failed to update trip');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-20 animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden animate-scaleIn flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4A9B7F] to-teal-600 px-6 py-4 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronDown className="w-5 h-5 rotate-90" />
            </button>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
              🗺️
            </div>
            <div>
              <h2 className="text-xl font-bold">Update Trip Progress</h2>
              <p className="text-teal-50 text-sm">Add new locations or update your journey</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Trip Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Trip Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              placeholder="e.g., Amazing Europe Adventure"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9B7F]"
              disabled={isSubmitting}
            />
          </div>

          {/* Completion Percentage */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Trip Completion: {completionPercentage}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={completionPercentage}
              onChange={(e) => setCompletionPercentage(parseInt(e.target.value))}
              className="w-full range-slider"
              style={{
                background: `linear-gradient(to right, #4A9B7F 0%, #4A9B7F ${completionPercentage}%, #e5e7eb ${completionPercentage}%, #e5e7eb 100%)`
              }}
              disabled={isSubmitting}
            />
          </div>

          {/* Locations */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-700">
                Visited Locations <span className="text-red-500">*</span>
              </label>
              <button
                onClick={addLocation}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#4A9B7F] text-white rounded-lg hover:bg-[#3d8268] text-sm font-medium disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Add Location
              </button>
            </div>

            <div className="space-y-3">
              {tripLocations.map((location, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Location Name</label>
                      <input
                        type="text"
                        value={location.name}
                        onChange={(e) => updateLocation(index, 'name', e.target.value)}
                        placeholder="e.g., Eiffel Tower"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A9B7F]"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Visit Date</label>
                      <input
                        type="date"
                        value={location.visitedAt}
                        onChange={(e) => updateLocation(index, 'visitedAt', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A9B7F]"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={location.isCurrentLocation}
                        onChange={(e) => {
                          const updated = tripLocations.map((loc, i) => ({
                            ...loc,
                            isCurrentLocation: i === index ? e.target.checked : false,
                          }));
                          setTripLocations(updated);
                        }}
                        className="w-4 h-4 accent-[#4A9B7F]"
                        disabled={isSubmitting}
                      />
                      <span className="text-[#4A9B7F] font-medium">Current Location</span>
                    </label>
                  </div>

                  {/* Photos */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Photos ({location.photos.length})
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {location.photos.map((photo, photoIndex) => (
                        <div key={photoIndex} className="relative w-16 h-16">
                          <img src={photo} alt="" className="w-full h-full object-cover rounded-lg" />
                          <button
                            onClick={() => {
                              const updated = [...tripLocations];
                              updated[index].photos.splice(photoIndex, 1);
                              setTripLocations([...updated]);
                            }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addPhotoToLocation(index)}
                        className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-[#4A9B7F] text-gray-400 hover:text-[#4A9B7F] transition-colors text-2xl"
                        disabled={isSubmitting}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeLocation(index)}
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 text-red-500 text-sm hover:text-red-700 font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove Location
                  </button>
                </div>
              ))}

              {tripLocations.length === 0 && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
                  No locations added yet. Click "+ Add Location" to get started!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
          <p className="text-sm text-gray-500">Update your journey with the latest progress</p>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !tripName.trim() || tripLocations.length === 0}
            className="flex items-center gap-2 px-6 py-2 bg-[#4A9B7F] text-white rounded-lg hover:bg-[#3d8268] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Update 🗺️</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
