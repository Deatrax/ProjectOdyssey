// app/profile/page.tsx
"use client";

import React, { useState } from "react";
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

const reviews: ReviewProps[] = [
  {
    id: "1",
    placeName: "Tanah Lot Temple",
    placeImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&h=200&fit=crop",
    rating: 5,
    comment: "Absolutely breathtaking sunset views! The temple sits on a rock formation surrounded by the ocean. Best time to visit is during sunset. Can get crowded but totally worth it.",
    date: "2 weeks ago",
    location: "Bali, Indonesia"
  },
  {
    id: "2",
    placeName: "Tiger Hill Sunrise Point",
    placeImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
    rating: 4,
    comment: "Worth the early morning wake up! The sunrise over Kanchenjunga is spectacular. Dress warmly as it gets very cold at 4 AM.",
    date: "1 month ago",
    location: "Darjeeling, India"
  },
  {
    id: "3",
    placeName: "Senso-ji Temple",
    placeImage: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=300&h=200&fit=crop",
    rating: 5,
    comment: "Tokyo's oldest temple is a must-visit! The surrounding Nakamise shopping street has amazing traditional snacks and souvenirs.",
    date: "3 months ago",
    location: "Tokyo, Japan"
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

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "trips" | "reviews" | "collections" | "settings">("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <p className="text-3xl font-bold text-gray-900">{userProfile.stats.tripsCompleted}</p>
            <p className="text-gray-600 text-sm mt-1">Trips Completed</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <p className="text-3xl font-bold text-gray-900">{userProfile.stats.placesVisited}</p>
            <p className="text-gray-600 text-sm mt-1">Places Visited</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <p className="text-3xl font-bold text-gray-900">{userProfile.stats.reviewsWritten}</p>
            <p className="text-gray-600 text-sm mt-1">Reviews</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <p className="text-3xl font-bold text-gray-900">{userProfile.stats.followers}</p>
            <p className="text-gray-600 text-sm mt-1">Followers</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <p className="text-3xl font-bold text-gray-900">{userProfile.stats.countriesVisited}</p>
            <p className="text-gray-600 text-sm mt-1">Countries</p>
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
                  <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                    <div className="w-12 h-12 bg-[#4A9B7F] rounded-full flex items-center justify-center text-white font-bold">
                      ✓
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-semibold">Completed Trip to Bali</p>
                      <p className="text-gray-600 text-sm mt-1">Visited 8 amazing places • 2 weeks ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold">
                      ⭐
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-semibold">Left a review for Tanah Lot Temple</p>
                      <p className="text-gray-600 text-sm mt-1">5 stars • 2 weeks ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                    <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                      📍
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-semibold">Added 12 places to "Beach Paradises"</p>
                      <p className="text-gray-600 text-sm mt-1">3 weeks ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Travel Map Placeholder */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Places I've Been</h3>
                <div className="h-64 bg-gray-200 rounded-xl flex items-center justify-center">
                  <p className="text-gray-500 font-semibold">Interactive Travel Map Coming Soon</p>
                </div>
              </div>

              {/* Upcoming Trips */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Trips</h3>
                <div className="bg-[#FFF5E9] rounded-xl p-6 text-center">
                  <p className="text-gray-600">No upcoming trips planned yet</p>
                  <button
                    onClick={() => router.push("/planner")}
                    className="mt-4 bg-[#4A9B7F] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#3d8a6d] transition"
                  >
                    Plan a Trip
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SHARED TRIPS TAB */}
          {activeTab === "trips" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sharedTrips.map((trip) => (
                  <div key={trip.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={trip.image}
                        alt={trip.title}
                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{trip.title}</h3>
                      <p className="text-gray-600 text-sm mb-1">📍 {trip.destination}</p>
                      <p className="text-gray-600 text-sm mb-3">📅 {trip.dates}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="text-gray-600 text-sm">{trip.collaborators} collaborators</span>
                        </div>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Public
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl p-6 shadow-lg flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-48 h-32 sm:h-40 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={review.placeImage}
                      alt={review.placeName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{review.placeName}</h3>
                        <p className="text-gray-600 text-sm">📍 {review.location}</p>
                      </div>
                      <div className="text-right">
                        {renderStars(review.rating)}
                        <p className="text-gray-500 text-sm mt-1">{review.date}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-3 leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* COLLECTIONS TAB */}
          {activeTab === "collections" && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection) => (
                  <div key={collection.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={collection.coverImage}
                        alt={collection.name}
                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{collection.name}</h3>
                      <p className="text-gray-600">{collection.count} places saved</p>
                    </div>
                  </div>
                ))}
              </div>
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