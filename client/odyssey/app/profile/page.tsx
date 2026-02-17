// app/profile/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// --- Types & Interfaces ---
interface TripCardProps {
  id: string;
  title: string;
  destination: string;
  image: string;
  dates: string;
  collaborators: number;
  isPublic: boolean;
}

interface ReviewProps {
  id: string;
  placeName: string;
  placeImage: string;
  rating: number;
  comment: string;
  date: string;
  location: string;
}

interface CollectionProps {
  id: string;
  name: string;
  count: number;
  coverImage: string;
}

// --- Mock Data ---
const userProfile = {
  name: "Alex Rivera",
  username: "@alexrivera",
  bio: "Adventure seeker | Photography enthusiast | Always planning the next trip ✈️",
  joinDate: "January 2024",
  profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
  coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop",
  stats: {
    tripsCompleted: 24,
    placesVisited: 87,
    reviewsWritten: 45,
    followers: 342,
    countriesVisited: 12
  },
  travelStyle: ["Adventure", "Photography", "Budget-Friendly", "Solo Travel"]
};

const sharedTrips: TripCardProps[] = [
  {
    id: "1",
    title: "Bali Adventure 2024",
    destination: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&h=300&fit=crop",
    dates: "Jan 15 - Jan 25, 2024",
    collaborators: 3,
    isPublic: true
  },
  {
    id: "2",
    title: "Darjeeling Tea Tour",
    destination: "Darjeeling, India",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    dates: "Dec 1 - Dec 10, 2023",
    collaborators: 2,
    isPublic: true
  },
  {
    id: "3",
    title: "Tokyo Cherry Blossoms",
    destination: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
    dates: "Mar 20 - Apr 2, 2024",
    collaborators: 1,
    isPublic: true
  }
];



const collections: CollectionProps[] = [
  {
    id: "1",
    name: "Beach Paradises",
    count: 15,
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=300&fit=crop"
  },
  {
    id: "2",
    name: "Mountain Escapes",
    count: 23,
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop"
  },
  {
    id: "3",
    name: "Urban Adventures",
    count: 18,
    coverImage: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=300&h=300&fit=crop"
  }
];

// Helper to get relative time string
const getRelativeTime = (dateStr: string): string => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
};

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "trips" | "reviews" | "collections" | "settings">("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [trips, setTrips] = useState<any[]>([]);
  const [tripsLoading, setTripsLoading] = useState(true);

  // Reviews state
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // New state for Collections
  const [collectionTrip, setCollectionTrip] = useState<any>(null);
  const [collectionsLoading, setCollectionsLoading] = useState(true);

  // Stats
  const [stats, setStats] = useState({
    placesVisited: 12, // Mock for now or could be calculated
    countries: 4,
    tripsPlanned: 0,
    reviews: 0,
    collections: 0
  });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ placeName: "", location: "", rating: 5, comment: "", images: [] as string[] });
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch user trips on mount
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { setTripsLoading(false); return; }
        const res = await fetch("http://localhost:4000/api/trips", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            const tripsData = data.data;
            setTrips(tripsData as any);
            const drafts = tripsData.filter((t: any) => t.status === 'draft').length;
            const confirmed = tripsData.filter((t: any) => t.status === 'confirmed').length;

            // Find collection trip
            const collection = tripsData.find((t: any) => t.status === 'collection');
            setCollectionTrip(collection);
            const collectionCount = collection && Array.isArray(collection.selected_places)
              ? collection.selected_places.length
              : 0;

            setStats(prev => ({
              ...prev,
              tripsPlanned: drafts + confirmed,
              collections: collectionCount
            }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch trips:", err);
      } finally {
        setTripsLoading(false);
        setCollectionsLoading(false);
      }
    };
    fetchTrips();
  }, []);

  // Fetch user reviews on mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { setReviewsLoading(false); return; }
        const res = await fetch("http://localhost:4000/api/reviews", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            setUserReviews(data.data);
            setStats(prev => ({ ...prev, reviews: data.data.length }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Submit a new review
  const handleSubmitReview = async () => {
    if (!newReview.placeName || !newReview.rating) return;
    setSubmittingReview(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newReview),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUserReviews((prev) => [data.data, ...prev]);
          setNewReview({ placeName: "", location: "", rating: 5, comment: "", images: [] });
          setCurrentImageUrl("");
          setShowReviewModal(false);
          setStats(prev => ({ ...prev, reviews: prev.reviews + 1 }));
        }
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
    } finally {
      setSubmittingReview(false);
    }
  };

  // Handle adding an image URL to the new review
  const handleAddImage = () => {
    if (!currentImageUrl.trim()) return;
    setNewReview(prev => ({ ...prev, images: [...prev.images, currentImageUrl.trim()] }));
    setCurrentImageUrl("");
  };

  // Handle file upload from device
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // Content-Type is auto-set for FormData
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.url) {
          setNewReview((prev) => ({ ...prev, images: [...prev.images, data.url] }));
        }
      } else {
        console.error("Upload failed");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
    } finally {
      setUploadingImage(false);
      // Reset input value so same file can be selected again if needed
      if (e.target) e.target.value = "";
    }
  };

  // Handle removing an image URL
  const handleRemoveImage = (index: number) => {
    setNewReview(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  // Delete a review
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUserReviews((prev) => prev.filter((r) => r.id !== reviewId));
        setStats(prev => ({ ...prev, reviews: prev.reviews - 1 }));
      }
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? "fill-yellow-400" : "fill-gray-300"}`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-[#FFF5E9] min-h-screen font-body">


      {/* --- Main Profile Content --- */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-16">

        {/* Cover Image + Profile Header */}
        <div className="relative mb-8">
          {/* Cover Image */}
          <div className="h-48 sm:h-64 rounded-3xl overflow-hidden shadow-xl">
            <img
              src={userProfile.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Profile Picture (overlapping cover) */}
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-[#FFF5E9] overflow-hidden shadow-xl">
              <img
                src={userProfile.profileImage}
                alt={userProfile.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button className="bg-white hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-full font-semibold shadow-lg transition">
              Edit Profile
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/");
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="mt-20 sm:mt-24 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{userProfile.name}</h1>
              <p className="text-gray-600 text-lg mt-1">{userProfile.username}</p>
              <p className="text-gray-700 mt-3 max-w-2xl">{userProfile.bio}</p>
              <p className="text-gray-500 text-sm mt-2">Joined {userProfile.joinDate}</p>
            </div>
          </div>

          {/* Travel Style Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {userProfile.travelStyle.map((style, index) => (
              <span
                key={index}
                className="bg-[#4A9B7F] text-white px-4 py-1.5 rounded-full text-sm font-medium"
              >
                {style}
              </span>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <p className="text-3xl font-bold text-gray-900">{trips.filter(t => t.status === 'confirmed').length}</p>
            <p className="text-gray-600 text-sm mt-1">Trips Completed</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <p className="text-3xl font-bold text-gray-900">{userProfile.stats.placesVisited}</p>
            <p className="text-gray-600 text-sm mt-1">Places Visited</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <p className="text-3xl font-bold text-gray-900">{userReviews.length}</p>
            <p className="text-gray-600 text-sm mt-1">Reviews</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <p className="text-3xl font-bold text-gray-900">{userProfile.stats.followers}</p>
            <p className="text-gray-600 text-sm mt-1">Followers</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <p className="text-3xl font-bold text-gray-900">{stats.collections}</p>
            <p className="text-gray-600 text-sm mt-1">Collections</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 rounded-full font-semibold transition whitespace-nowrap ${activeTab === "overview"
              ? "bg-[#4A9B7F] text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("trips")}
            className={`px-6 py-3 rounded-full font-semibold transition whitespace-nowrap ${activeTab === "trips"
              ? "bg-[#4A9B7F] text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            Shared Trips
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-6 py-3 rounded-full font-semibold transition whitespace-nowrap ${activeTab === "reviews"
              ? "bg-[#4A9B7F] text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            Reviews
          </button>
          <button
            onClick={() => setActiveTab("collections")}
            className={`px-6 py-3 rounded-full font-semibold transition whitespace-nowrap ${activeTab === "collections"
              ? "bg-[#4A9B7F] text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            Collections
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-6 py-3 rounded-full font-semibold transition whitespace-nowrap ${activeTab === "settings"
              ? "bg-[#4A9B7F] text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-8">

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Recent Activity */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {tripsLoading ? (
                    <p className="text-gray-500 text-sm italic">Loading activity...</p>
                  ) : trips.length === 0 ? (
                    <div className="bg-[#FFF5E9] rounded-xl p-6 text-center">
                      <p className="text-gray-600">No activity yet — plan your first trip!</p>
                      <button
                        onClick={() => router.push("/planner")}
                        className="mt-4 bg-[#4A9B7F] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#3d8a6d] transition"
                      >
                        Plan a Trip
                      </button>
                    </div>
                  ) : (
                    trips.slice(0, 5).map((trip, index) => {
                      const placeCount = Array.isArray(trip.selected_places) ? trip.selected_places.length : 0;
                      const isConfirmed = trip.status === "confirmed";
                      return (
                        <div
                          key={trip.id}
                          className={`flex items-start gap-4 pb-4 cursor-pointer hover:bg-gray-50 rounded-xl px-2 -mx-2 transition ${index < trips.length - 1 ? 'border-b border-gray-200' : ''}`}
                          onClick={() => router.push('/planner')}
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${isConfirmed ? 'bg-[#4A9B7F]' : 'bg-amber-400'
                            }`}>
                            {isConfirmed ? '✓' : '✏️'}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 font-semibold">
                              {isConfirmed ? 'Confirmed' : 'Planned'} trip: {trip.trip_name}
                            </p>
                            <p className="text-gray-600 text-sm mt-1">
                              {placeCount} place{placeCount !== 1 ? 's' : ''} • {trip.status} • {getRelativeTime(trip.updated_at || trip.created_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Travel Map Placeholder */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Places I've Been</h3>
                <div className="h-64 bg-gray-200 rounded-xl flex items-center justify-center">
                  <p className="text-gray-500 font-semibold">Interactive Travel Map Coming Soon</p>
                </div>
              </div>

              {/* Upcoming Trips (Draft trips) */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Trips</h3>
                {(() => {
                  const draftTrips = trips.filter(t => t.status === 'draft');
                  if (tripsLoading) return <p className="text-gray-500 text-sm italic">Loading...</p>;
                  if (draftTrips.length === 0) return (
                    <div className="bg-[#FFF5E9] rounded-xl p-6 text-center">
                      <p className="text-gray-600">No upcoming trips planned yet</p>
                      <button
                        onClick={() => router.push("/planner")}
                        className="mt-4 bg-[#4A9B7F] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#3d8a6d] transition"
                      >
                        Plan a Trip
                      </button>
                    </div>
                  );
                  return (
                    <div className="space-y-3">
                      {draftTrips.slice(0, 3).map((trip) => (
                        <div
                          key={trip.id}
                          onClick={() => router.push('/planner')}
                          className="flex items-center gap-4 p-4 bg-[#FFF5E9] rounded-xl cursor-pointer hover:bg-amber-100/60 transition"
                        >
                          <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                            ✈️
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 font-semibold">{trip.trip_name}</p>
                            <p className="text-gray-600 text-sm">{Array.isArray(trip.selected_places) ? trip.selected_places.length : 0} places • Draft</p>
                          </div>
                          <span className="text-gray-400">→</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* SHARED TRIPS TAB */}
          {activeTab === "trips" && (
            <div>
              {tripsLoading ? (
                <p className="text-gray-500 text-sm italic">Loading trips...</p>
              ) : trips.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                  <p className="text-gray-600 mb-4">No trips yet</p>
                  <button
                    onClick={() => router.push("/planner")}
                    className="bg-[#4A9B7F] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#3d8a6d] transition"
                  >
                    Plan Your First Trip
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trips.map((trip) => {
                    const placeCount = Array.isArray(trip.selected_places) ? trip.selected_places.length : 0;
                    // Try to find an image from the trip data
                    let tripImage: string | null = null;
                    if (Array.isArray(trip.selected_places)) {
                      for (const p of trip.selected_places) {
                        if (p?.images?.[0]) { tripImage = p.images[0]; break; }
                        if (p?.image) { tripImage = p.image; break; }
                      }
                    }
                    if (!tripImage) {
                      const schedule = trip.selected_itinerary?.schedule;
                      if (Array.isArray(schedule)) {
                        for (const d of schedule) {
                          for (const item of (d?.items || [])) {
                            if (item?.images?.[0]) { tripImage = item.images[0]; break; }
                            if (item?.image) { tripImage = item.image; break; }
                          }
                          if (tripImage) break;
                        }
                      }
                    }
                    return (
                      <div
                        key={trip.id}
                        onClick={() => router.push('/planner')}
                        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer"
                      >
                        <div className="h-48 overflow-hidden">
                          {tripImage ? (
                            <img src={tripImage} alt={trip.trip_name} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400" />
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{trip.trip_name}</h3>
                          <p className="text-gray-600 text-sm mb-1">📍 {placeCount} place{placeCount !== 1 ? 's' : ''}</p>
                          <p className="text-gray-600 text-sm mb-3">📅 {getRelativeTime(trip.created_at)}</p>
                          <div className="flex items-center justify-between">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${trip.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-amber-100 text-amber-700'
                              }`}>
                              {trip.status === 'confirmed' ? 'Confirmed' : 'Draft'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* COLLECTIONS TAB */}
          {activeTab === "collections" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">My Collection</h3>
              </div>

              {!collectionTrip || !collectionTrip.selected_places || collectionTrip.selected_places.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                  <div className="text-6xl mb-4">🔖</div>
                  <p className="text-gray-600 text-lg mb-2">Your collection is empty</p>
                  <p className="text-gray-500 text-sm mb-6">Explore destinations and add them to your collection to see them here.</p>
                  <button
                    onClick={() => router.push("/destinations")}
                    className="bg-[#4A9B7F] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-[#3d8a6d] transition"
                  >
                    Explore Places
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {collectionTrip.selected_places.map((place: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition group cursor-pointer"
                      onClick={() => router.push(`/destinations?search=${encodeURIComponent(place.name)}`)}
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={place.img_url || place.image || `https://source.unsplash.com/400x300/?${place.name}`}
                          alt={place.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
                          <svg className="w-4 h-4 text-[#4A9B7F] fill-current" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                        </div>
                      </div>
                      <div className="p-5">
                        <h4 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{place.name}</h4>
                        <p className="text-gray-500 text-xs uppercase font-semibold tracking-wider mb-2">{place.type || 'Dest'} • {place.country || 'Unknown'}</p>
                        {place.short_desc && (
                          <p className="text-gray-600 text-sm line-clamp-2">{place.short_desc}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {/* Header with Add Review button */}
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">My Reviews</h3>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="bg-[#4A9B7F] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-[#3d8a6d] transition shadow-lg flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Write a Review
                </button>
              </div>

              {/* Reviews List */}
              {reviewsLoading ? (
                <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                  <p className="text-gray-500 italic">Loading reviews...</p>
                </div>
              ) : userReviews.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-gray-600 text-lg mb-2">No reviews yet</p>
                  <p className="text-gray-500 text-sm mb-6">Share your travel experiences by writing a review for places you've visited!</p>
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="bg-[#4A9B7F] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-[#3d8a6d] transition"
                  >
                    Write Your First Review
                  </button>
                </div>
              ) : (
                userReviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-2xl p-6 shadow-lg flex flex-col sm:flex-row gap-6">

                    {/* Left Side: Main Image */}
                    {review.review_images && review.review_images.length > 0 ? (
                      <div className="w-full sm:w-56 h-48 sm:h-40 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 group">
                        <img
                          src={review.review_images[0].url}
                          alt={review.place_name || "Place"}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        {review.review_images.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                            +{review.review_images.length - 1} more
                          </div>
                        )}
                      </div>
                    ) : (
                      // Placeholder to maintain "picture at left" request consistently
                      <div className="hidden sm:flex w-56 h-40 rounded-xl bg-gray-50 items-center justify-center flex-shrink-0 text-gray-300 border border-gray-100">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    )}

                    {/* Right Side: Content */}
                    <div className="flex-1 w-full relative">
                      {/* Close Button as Absolute or Flex Item - trying Flex for alignment */}
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 leading-tight">{review.place_name}</h3>
                          <div className="text-[#4A9B7F] text-sm font-medium flex items-center gap-2 mt-1">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                              {review.location || "Location"}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-500 font-normal">{getRelativeTime(review.created_at)}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-start gap-4 flex-shrink-0">
                          {/* Rating */}
                          <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                            <span className="text-yellow-500 mr-1.5">★</span>
                            <span className="font-bold text-gray-800">{review.rating}</span>
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="bg-gray-100 p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
                            title="Delete review"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>

                      {/* Review Text */}
                      {review.comment && <p className="text-gray-700 leading-relaxed mb-3 text-base">{review.comment}</p>}

                      {/* Secondary Images Row (if more than 1) */}
                      {review.review_images && review.review_images.length > 1 && (
                        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                          {review.review_images.slice(1).map((img: any, idx: number) => (
                            <div key={idx} className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100 cursor-pointer hover:opacity-80 transition">
                              <img src={img.url} alt="Gallery" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}

              {/* Add Review Modal */}
              {showReviewModal && (

                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">Write a Review</h3>
                      <button
                        onClick={() => setShowReviewModal(false)}
                        className="text-gray-400 hover:text-gray-600 transition"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>

                    <div className="space-y-5">
                      {/* Place Name */}
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">Place Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Tanah Lot Temple"
                          value={newReview.placeName}
                          onChange={(e) => setNewReview({ ...newReview, placeName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9B7F]"
                        />
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">Location</label>
                        <input
                          type="text"
                          placeholder="e.g. Bali, Indonesia"
                          value={newReview.location}
                          onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9B7F]"
                        />
                      </div>

                      {/* Star Rating */}
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">Rating *</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewReview({ ...newReview, rating: star })}
                              className="focus:outline-none transition transform hover:scale-110"
                            >
                              <svg
                                className={`w-8 h-8 ${star <= newReview.rating ? "fill-yellow-400" : "fill-gray-300"}`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Comment */}
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">Your Review</label>
                        <textarea
                          placeholder="Share your experience..."
                          rows={4}
                          value={newReview.comment}
                          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9B7F] resize-none"
                        />
                      </div>

                      {/* Image URLs */}
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">Add Photos</label>

                        {/* URL Input */}
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            placeholder="Paste image URL here..."
                            value={currentImageUrl}
                            onChange={(e) => setCurrentImageUrl(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddImage()}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9B7F]"
                          />
                          <button
                            onClick={handleAddImage}
                            type="button"
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 font-medium whitespace-nowrap"
                          >
                            Add URL
                          </button>
                        </div>

                        {/* File Upload Button */}
                        <div className="mb-2">
                          <label className="cursor-pointer bg-[#FFF5E9] border-2 border-dashed border-[#4A9B7F] rounded-xl px-4 py-8 flex flex-col items-center justify-center hover:bg-[#ffeacc] transition group">
                            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                            {uploadingImage ? (
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A9B7F]"></div>
                            ) : (
                              <>
                                <svg className="w-8 h-8 text-[#4A9B7F] mb-2 group-hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                <span className="text-[#4A9B7F] font-semibold">Upload from Device</span>
                                <span className="text-gray-500 text-sm mt-1">Supports JPG, PNG</span>
                              </>
                            )}
                          </label>
                        </div>

                        {/* Image Previews */}
                        {newReview.images.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {newReview.images.map((url, index) => (
                              <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 group">
                                <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                  onClick={() => handleRemoveImage(index)}
                                  className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setShowReviewModal(false)}
                        className="flex-1 px-6 py-3 border border-gray-300 rounded-full font-semibold text-gray-700 hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitReview}
                        disabled={!newReview.placeName || submittingReview}
                        className="flex-1 bg-[#4A9B7F] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#3d8a6d] transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submittingReview ? "Submitting..." : "Submit Review"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="space-y-6">

              {/* Account Settings */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Display Name</label>
                    <input
                      type="text"
                      defaultValue={userProfile.name}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9B7F]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Username</label>
                    <input
                      type="text"
                      defaultValue={userProfile.username}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9B7F]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Bio</label>
                    <textarea
                      defaultValue={userProfile.bio}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9B7F]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="alex.rivera@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9B7F]"
                    />
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Privacy Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-semibold text-gray-900">Public Profile</p>
                      <p className="text-sm text-gray-600">Allow others to see your profile</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A9B7F]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-semibold text-gray-900">Show Trip History</p>
                      <p className="text-sm text-gray-600">Display your completed trips</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A9B7F]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-semibold text-gray-900">Show Reviews Publicly</p>
                      <p className="text-sm text-gray-600">Let others see your reviews</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A9B7F]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Travel Preferences */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Travel Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Preferred Currency</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9B7F]">
                      <option>USD - US Dollar</option>
                      <option>EUR - Euro</option>
                      <option>GBP - British Pound</option>
                      <option>INR - Indian Rupee</option>
                      <option>JPY - Japanese Yen</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Budget Range (per day)</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9B7F]">
                      <option>$0 - $50 (Budget)</option>
                      <option>$50 - $100 (Moderate)</option>
                      <option>$100 - $200 (Comfortable)</option>
                      <option>$200+ (Luxury)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Preferred Accommodation</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9B7F]">
                      <option>Hostels</option>
                      <option>Budget Hotels</option>
                      <option>Mid-range Hotels</option>
                      <option>Luxury Hotels</option>
                      <option>Vacation Rentals</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Travel Style</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["Adventure", "Relaxation", "Culture", "Photography", "Food", "Shopping", "Nature", "History"].map((style) => (
                        <label key={style} className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full cursor-pointer hover:bg-gray-200 transition">
                          <input type="checkbox" defaultChecked={userProfile.travelStyle.includes(style)} className="rounded" />
                          <span className="text-sm font-medium text-gray-700">{style}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-semibold text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive updates via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A9B7F]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-semibold text-gray-900">Trip Reminders</p>
                      <p className="text-sm text-gray-600">Get reminded about upcoming trips</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A9B7F]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-semibold text-gray-900">Friend Activity</p>
                      <p className="text-sm text-gray-600">See when friends plan new trips</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A9B7F]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button className="bg-[#4A9B7F] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#3d8a6d] transition shadow-lg">
                  Save All Changes
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-300 py-6 text-center mt-16">
        <p className="text-gray-800 text-sm">
          ©Odyssey. Made with <span className="text-red-500">❤️</span> by Route6
        </p>
      </footer>
    </div>
  );
};

export default ProfilePage;