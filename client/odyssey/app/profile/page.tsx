// app/profile/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import VisitMap from "./VisitMap";
import TravelStatsCard from "./TravelStatsCard";

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

const getApiBase = () => {
  if (typeof window !== "undefined") {
    // If we're on a non-localhost domain, use that host with port 4000
    const { hostname, protocol } = window.location;
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      return `${protocol}//${hostname}:4000`;
    }
  }
  return "http://localhost:4000";
};

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "trips" | "reviews" | "collections" | "settings">("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [trips, setTrips] = useState<any[]>([]);
  const [tripsLoading, setTripsLoading] = useState(true);

  // User profile state
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // New state for visit stats
  const [visitStats, setVisitStats] = useState<Record<string, number>>({});
  const [statsLoading, setStatsLoading] = useState(true);

  // Image upload state
  const [showEditModal, setShowEditModal] = useState(false);
  const [imagePreview, setImagePreview] = useState<{ profile?: string, cover?: string }>({});

  // Settings form state
  const [settings, setSettings] = useState({
    displayName: "",
    username: "",
    bio: "",
    email: "",
    profileImage: "",
    coverImage: "",
    travelStyle: [] as string[],
    privacy: {
      publicProfile: true,
      showTripHistory: true,
      showReviewsPublicly: true
    },
    preferences: {
      currency: "USD - US Dollar",
      budgetRange: "$50 - $100 (Moderate)",
      accommodation: "Mid-range Hotels"
    },
    notifications: {
      emailNotifications: true,
      tripReminders: true,
      friendActivity: true
    }
  });

  // Fetch visit stats on mount
  useEffect(() => {
    const fetchVisitStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${getApiBase()}/api/visits/user/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const result = await res.json();
          if (result.success) {
            setVisitStats(result.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch visit stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchVisitStats();
  }, []);

  // Fetch user profile and trips on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Fetch user profile
        const userRes = await fetch(`${getApiBase()}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          setUserData(userData.user);

          // Initialize settings from user data
          setSettings({
            displayName: userData.user.displayName || userData.user.username,
            username: userData.user.username,
            bio: userData.user.bio || "",
            email: userData.user.email || "",
            profileImage: userData.user.profileImage || "",
            coverImage: userData.user.coverImage || "",
            travelStyle: userData.user.travelStyle || [],
            privacy: userData.user.privacy || {
              publicProfile: true,
              showTripHistory: true,
              showReviewsPublicly: true
            },
            preferences: userData.user.preferences || {
              currency: "USD - US Dollar",
              budgetRange: "$50 - $100 (Moderate)",
              accommodation: "Mid-range Hotels"
            },
            notifications: userData.user.notifications || {
              emailNotifications: true,
              tripReminders: true,
              friendActivity: true
            }
          });
        }

        // Fetch trips
        const tripsRes = await fetch(`${getApiBase()}/api/trips`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (tripsRes.ok) {
          const tripsData = await tripsRes.json();
          if (tripsData.success && Array.isArray(tripsData.data)) {
            setTrips(tripsData.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      } finally {
        setLoading(false);
        setTripsLoading(false);
      }
    };
    fetchUserData();
  }, [router]);

  // Save settings handler
  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setSaveMessage(null);

      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch("http://localhost:4000/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          displayName: settings.displayName,
          bio: settings.bio,
          email: settings.email,
          travelStyle: settings.travelStyle,
          privacy: settings.privacy,
          preferences: settings.preferences,
          notifications: settings.notifications
        })
      });

      const data = await res.json();

      if (data.success) {
        setUserData(data.user);
        setSaveMessage({ type: 'success', text: 'Settings saved successfully!' });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage({ type: 'error', text: data.error || 'Failed to save settings' });
      }
    } catch (err: any) {
      console.error("Save error:", err);
      setSaveMessage({ type: 'error', text: err.message || 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  // Toggle travel style
  const toggleTravelStyle = (style: string) => {
    setSettings(prev => ({
      ...prev,
      travelStyle: prev.travelStyle.includes(style)
        ? prev.travelStyle.filter(s => s !== style)
        : [...prev.travelStyle, style]
    }));
  };

  // Image upload handlers
  const handleImageUpload = (type: 'profile' | 'cover', file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;

        if (type === 'profile') {
          setImagePreview(prev => ({ ...prev, profile: base64String }));
        } else {
          setImagePreview(prev => ({ ...prev, cover: base64String }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImages = async () => {
    try {
      setSaving(true);
      setSaveMessage(null);

      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const updates: any = {};
      if (imagePreview.profile) updates.profileImage = imagePreview.profile;
      if (imagePreview.cover) updates.coverImage = imagePreview.cover;

      const res = await fetch(`${getApiBase()}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (data.success) {
        setUserData(data.user);
        setSaveMessage({ type: 'success', text: 'Images updated successfully!' });
        setShowEditModal(false);
        setImagePreview({});
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage({ type: 'error', text: data.error || 'Failed to update images' });
      }
    } catch (err: any) {
      console.error("Image save error:", err);
      setSaveMessage({ type: 'error', text: err.message || 'Failed to update images' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#FFF5E9] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4A9B7F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading profile...</p>
        </div>
      </div>
    );
  }

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

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Edit Profile Images</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setImagePreview({});
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {saveMessage && (
                <div className={`rounded-xl p-4 mb-6 ${saveMessage.type === 'success' ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'}`}>
                  <p className={`font-semibold ${saveMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                    {saveMessage.text}
                  </p>
                </div>
              )}

              <div className="space-y-8">
                {/* Profile Picture Section */}
                <div>
                  <label className="block text-gray-700 font-bold text-lg mb-4">Profile Picture</label>

                  {/* URL Input */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      placeholder="Paste image URL here..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9B7F]"
                      value={settings.profileImage}
                      onChange={(e) => setSettings({ ...settings, profileImage: e.target.value })}
                    />
                    <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-xl font-semibold hover:bg-gray-50 transition">
                      Add URL
                    </button>
                  </div>

                  {/* Device Upload Zone */}
                  <div className="border-2 border-dashed border-[#4A9B7F]/30 rounded-2xl p-8 bg-[#FFF5E9]/50 hover:bg-[#FFF5E9] transition-all group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload('profile', e.target.files[0])}
                      className="hidden"
                      id="profile-upload"
                    />
                    <label
                      htmlFor="profile-upload"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-[#4A9B7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <span className="text-lg font-semibold text-[#4A9B7F] mb-1">Upload from Device</span>
                      <span className="text-sm text-gray-500">Supports JPG, PNG</span>
                    </label>
                  </div>

                  {/* Live Preview */}
                  {(imagePreview.profile || settings.profileImage) && (
                    <div className="mt-4 flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100">
                      <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#4A9B7F]">
                        <img
                          src={imagePreview.profile || settings.profileImage}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">Profile Picture Preview</p>
                        <p className="text-xs text-gray-500">This is how your avatar will look</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cover Photo Section */}
                <div>
                  <label className="block text-gray-700 font-bold text-lg mb-4">Cover Photo</label>

                  {/* URL Input */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      placeholder="Paste image URL here..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9B7F]"
                      value={settings.coverImage}
                      onChange={(e) => setSettings({ ...settings, coverImage: e.target.value })}
                    />
                    <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-xl font-semibold hover:bg-gray-50 transition">
                      Add URL
                    </button>
                  </div>

                  {/* Device Upload Zone */}
                  <div className="border-2 border-dashed border-[#4A9B7F]/30 rounded-2xl p-8 bg-[#FFF5E9]/50 hover:bg-[#FFF5E9] transition-all group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload('cover', e.target.files[0])}
                      className="hidden"
                      id="cover-upload"
                    />
                    <label
                      htmlFor="cover-upload"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-[#4A9B7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <span className="text-lg font-semibold text-[#4A9B7F] mb-1">Upload from Device</span>
                      <span className="text-sm text-gray-500">Supports JPG, PNG</span>
                    </label>
                  </div>

                  {/* Live Preview */}
                  {(imagePreview.cover || settings.coverImage) && (
                    <div className="mt-4 p-4 bg-white rounded-2xl border border-gray-100">
                      <p className="font-semibold text-gray-900 text-sm mb-3">Cover Photo Preview</p>
                      <div className="w-full h-32 rounded-xl overflow-hidden border-2 border-[#4A9B7F]">
                        <img
                          src={imagePreview.cover || settings.coverImage}
                          alt="Cover Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-4 mt-10">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setImagePreview({});
                  }}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-2xl font-semibold hover:bg-gray-50 transition shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveImages}
                  disabled={saving || (!imagePreview.profile && !imagePreview.cover && !settings.profileImage && !settings.coverImage)}
                  className="flex-1 bg-[#A5D7C6]/80 text-[#4A9B7F] hover:bg-[#A5D7C6] px-6 py-3 rounded-2xl font-bold transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Submit Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-16">

        {/* Cover Image + Profile Header */}
        <div className="relative mb-8">
          {/* Cover Image */}
          <div className="h-48 sm:h-64 rounded-3xl overflow-hidden shadow-xl">
            <img
              src={userData?.coverImage || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop"}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Profile Picture (overlapping cover) */}
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-[#FFF5E9] overflow-hidden shadow-xl">
              <img
                src={userData?.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"}
                alt={userData?.displayName || userData?.username}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="bg-white hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-full font-semibold shadow-lg transition"
            >
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
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{userData?.displayName || userData?.username}</h1>
              <p className="text-gray-600 text-lg mt-1">@{userData?.username}</p>
              <p className="text-gray-700 mt-3 max-w-2xl">{userData?.bio || "No bio yet"}</p>
              <p className="text-gray-500 text-sm mt-2">Joined {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}</p>
            </div>
          </div>

          {/* Travel Style Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {(userData?.travelStyle || []).map((style: string, index: number) => (
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
            <p className="text-3xl font-bold text-gray-900">87</p>
            <p className="text-gray-600 text-sm mt-1">Places Visited</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <p className="text-3xl font-bold text-gray-900">45</p>
            <p className="text-gray-600 text-sm mt-1">Reviews</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <p className="text-3xl font-bold text-gray-900">342</p>
            <p className="text-gray-600 text-sm mt-1">Followers</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <p className="text-3xl font-bold text-gray-900">12</p>
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
              {/* Travel Stats Card (Gamification) */}
              <TravelStatsCard />

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

              {/* Travel Map Section */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Places I've Been</h3>
                </div>
                {statsLoading ? (
                  <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
                    <p className="text-gray-500 animate-pulse font-semibold">Loading Map Data...</p>
                  </div>
                ) : Object.keys(visitStats).length === 0 ? (
                  <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center flex-col gap-4 text-center px-4">
                    <p className="text-gray-500 font-semibold">No travel history found yet</p>
                    <p className="text-sm text-gray-400">Venture out and check-in to places to see them on your map!</p>
                  </div>
                ) : (
                  <VisitMap stats={visitStats} />
                )}
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

              {/* Success/Error Message */}
              {saveMessage && (
                <div className={`rounded-xl p-4 ${saveMessage.type === 'success' ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'}`}>
                  <p className={`font-semibold ${saveMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                    {saveMessage.text}
                  </p>
                </div>
              )}

              {/* Account Settings */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Display Name</label>
                    <input
                      type="text"
                      value={settings.displayName}
                      onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9B7F]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Username</label>
                    <input
                      type="text"
                      value={settings.username}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Bio</label>
                    <textarea
                      value={settings.bio}
                      onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9B7F]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
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
                      <input
                        type="checkbox"
                        checked={settings.privacy.publicProfile}
                        onChange={(e) => setSettings({ ...settings, privacy: { ...settings.privacy, publicProfile: e.target.checked } })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A9B7F]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-semibold text-gray-900">Show Trip History</p>
                      <p className="text-sm text-gray-600">Display your completed trips</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.privacy.showTripHistory}
                        onChange={(e) => setSettings({ ...settings, privacy: { ...settings.privacy, showTripHistory: e.target.checked } })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A9B7F]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-semibold text-gray-900">Show Reviews Publicly</p>
                      <p className="text-sm text-gray-600">Let others see your reviews</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.privacy.showReviewsPublicly}
                        onChange={(e) => setSettings({ ...settings, privacy: { ...settings.privacy, showReviewsPublicly: e.target.checked } })}
                        className="sr-only peer"
                      />
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
                    <select
                      value={settings.preferences.currency}
                      onChange={(e) => setSettings({ ...settings, preferences: { ...settings.preferences, currency: e.target.value } })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9B7F]"
                    >
                      <option>USD - US Dollar</option>
                      <option>EUR - Euro</option>
                      <option>GBP - British Pound</option>
                      <option>INR - Indian Rupee</option>
                      <option>JPY - Japanese Yen</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Budget Range (per day)</label>
                    <select
                      value={settings.preferences.budgetRange}
                      onChange={(e) => setSettings({ ...settings, preferences: { ...settings.preferences, budgetRange: e.target.value } })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9B7F]"
                    >
                      <option>$0 - $50 (Budget)</option>
                      <option>$50 - $100 (Moderate)</option>
                      <option>$100 - $200 (Comfortable)</option>
                      <option>$200+ (Luxury)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Preferred Accommodation</label>
                    <select
                      value={settings.preferences.accommodation}
                      onChange={(e) => setSettings({ ...settings, preferences: { ...settings.preferences, accommodation: e.target.value } })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A9B7F]"
                    >
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
                          <input
                            type="checkbox"
                            checked={settings.travelStyle.includes(style)}
                            onChange={() => toggleTravelStyle(style)}
                            className="rounded"
                          />
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
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailNotifications}
                        onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, emailNotifications: e.target.checked } })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A9B7F]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-semibold text-gray-900">Trip Reminders</p>
                      <p className="text-sm text-gray-600">Get reminded about upcoming trips</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.tripReminders}
                        onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, tripReminders: e.target.checked } })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A9B7F]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-semibold text-gray-900">Friend Activity</p>
                      <p className="text-sm text-gray-600">See when friends plan new trips</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.friendActivity}
                        onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, friendActivity: e.target.checked } })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A9B7F]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="bg-[#4A9B7F] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#3d8a6d] transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save All Changes'}
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