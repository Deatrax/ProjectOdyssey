"use client";

import React, { useState } from 'react';
import { MapPin, Calendar, Navigation } from 'lucide-react';
import LikeButton from './LikeButton';
import SaveButton from './SaveButton';
import ShareButton from './ShareButton';
import type { Post } from '@/hooks/usePosts';

interface TripUpdateCardProps {
  post: Post;
  onPostClick?: (postId: string) => void;
}

export default function TripUpdateCard({ post, onPostClick }: TripUpdateCardProps) {
  const [likesCount, setLikesCount] = useState(Math.max(0, post.likesCount));

  const handleCardClick = () => {
    if (onPostClick) {
      onPostClick(post._id);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const tripProgress = post.tripProgress || {
    locations: [],
    currentLocationName: 'Unknown',
    totalLocations: 0,
    completionPercentage: 0
  };

  // Get photos from all locations
  const allPhotos = tripProgress.locations
    ?.flatMap((loc: any) => loc.photos || [])
    .filter(Boolean)
    .slice(0, 4) || [];

  return (
    <article 
      className="bg-gradient-to-br from-teal-50 via-white to-teal-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border-2 border-teal-200"
      onClick={handleCardClick}
    >
      {/* Header with special styling for trip update */}
      <div className="bg-gradient-to-r from-[#4A9B7F] to-teal-600 p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
            <img
              src={post.authorId?.profilePicture || 'https://via.placeholder.com/48'}
              alt={post.authorId?.username || 'User'}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <span>{post.authorId?.username || 'User'}</span>
              <span className="text-white/90 font-normal">shared trip progress</span>
            </h3>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
          {post.type === 'auto' && (
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-white text-xs font-semibold">✨ Auto-generated</span>
            </div>
          )}
        </div>
      </div>

      {/* Trip Info */}
      <div className="p-4 bg-white/60 border-b border-teal-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#4A9B7F]" />
            <h4 className="font-bold text-gray-900 text-lg">{post.tripName || 'Travel Journey'}</h4>
          </div>
          <div className="flex items-center gap-2 bg-teal-100 px-3 py-1 rounded-full">
            <Navigation className="w-4 h-4 text-[#4A9B7F]" />
            <span className="text-sm font-semibold text-[#4A9B7F]">
              {tripProgress.completionPercentage || 0}% Complete
            </span>
          </div>
        </div>
        
        {tripProgress.currentLocationName && (
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>Currently at: <span className="font-semibold text-gray-900">{tripProgress.currentLocationName}</span></span>
          </div>
        )}
      </div>

      {/* Locations Grid */}
      <div className="p-4">
        <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Visited Locations ({tripProgress.locations?.length || 0})
        </h5>
        
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {tripProgress.locations && tripProgress.locations.length > 0 ? (
            tripProgress.locations.map((location: any, index: number) => (
              <div 
                key={index}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  location.isCurrentLocation 
                    ? 'bg-green-100 border-2 border-green-400' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {location.isCurrentLocation && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                )}
                <MapPin className={`w-4 h-4 ${location.isCurrentLocation ? 'text-green-600' : 'text-gray-400'}`} />
                <div className="flex-1">
                  <p className={`text-sm font-medium ${location.isCurrentLocation ? 'text-green-900' : 'text-gray-900'}`}>
                    {location.name}
                  </p>
                  {location.visitedAt && (
                    <p className="text-xs text-gray-500">
                      {new Date(location.visitedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {location.isCurrentLocation && (
                  <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-semibold">
                    Current
                  </span>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No locations visited yet</p>
          )}
        </div>
      </div>

      {/* Photos Grid (if available) */}
      {allPhotos.length > 0 && (
        <div className="px-4 pb-4">
          <h5 className="text-sm font-semibold text-gray-700 mb-3">Trip Photos</h5>
          <div className={`grid gap-2 ${
            allPhotos.length === 1 ? 'grid-cols-1' :
            allPhotos.length === 2 ? 'grid-cols-2' :
            allPhotos.length === 3 ? 'grid-cols-3' :
            'grid-cols-2'
          }`}>
            {allPhotos.map((photo: string, index: number) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                <img
                  src={photo}
                  alt={`Trip photo ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interaction Bar */}
      <div className="px-4 py-3 bg-gradient-to-r from-teal-50 to-teal-100 border-t border-teal-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div onClick={(e) => e.stopPropagation()}>
            <LikeButton
              postId={post._id}
              initialLikesCount={likesCount}
              onLikeChange={setLikesCount}
            />
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="flex items-center space-x-1 text-gray-600 hover:text-[#3d8268] transition-colors"
          >
            <span className="text-sm">{post.commentsCount || 0} Comments</span>
          </button>
        </div>
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <SaveButton postId={post._id} />
          <ShareButton 
            postId={post._id} 
            postTitle={`${post.authorId?.username}'s trip to ${post.tripName}`}
          />
        </div>
      </div>
    </article>
  );
}
