'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import './dbnew.css';

// --- Types & Interfaces ---
interface TripCardProps {
  title: string;
  image: string;
}

interface RecommendationProps {
  title: string;
  image: string;
}

// --- Mock Data ---
const recentDrafts: TripCardProps[] = [
  {
    title: "Bali Trip",
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=300&h=300&fit=crop"
  },
  {
    title: "Darjeeling Trip",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop"
  }
];

const recommendations: RecommendationProps[] = [
  {
    title: "Summer Vibes",
    image: "https://images.unsplash.com/photo-1509233725247-49e657c54213?w=400&h=300&fit=crop"
  },
  {
    title: "Winter Trips near you",
    image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400&h=300&fit=crop"
  },
  {
    title: "Shopping this season",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop"
  },
  {
    title: "Safari",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop"
  }
];

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ placeName: "", location: "", rating: 5, comment: "", images: [] as string[] });
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);


  // --- PROTECTION LOGIC & OAUTH HANDLING ---
  useEffect(() => {
    const validateSession = async () => {
      // Check for OAuth callback token in URL
      const tokenFromUrl = searchParams.get("token");
      const userFromUrl = searchParams.get("user");

      if (tokenFromUrl) {
        // OAuth callback - store token and user
        localStorage.setItem("token", tokenFromUrl);
        if (userFromUrl) {
          localStorage.setItem("user", userFromUrl);
        }
        // Clean URL
        router.replace("/dashboard");
        return;
      }

      const token = localStorage.getItem("token");

      // 1. Immediate check: No token? Go to login.
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // 2. Verification check: Ask backend if token is valid
        const res = await fetch("http://localhost:4000/api/user/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        // 3. If backend says error (401/403), the token is bad/expired
        if (!res.ok) {
          const errorData = await res.json();
          console.error("Backend error:", errorData);
          throw new Error(errorData.message || "Invalid token");
        }

        // 4. Token is good! Load user data
        const data = await res.json();
        setUser(data.user);

        // Optional: Update local storage with fresh user data
        localStorage.setItem("user", JSON.stringify(data.user));

      } catch (err: any) {
        console.error("Full error:", err);
        console.error("Error message:", err.message);
        // Only redirect if it's an auth error, not a network error
        if (err.message.includes("Invalid token") || err.message.includes("not authorized")) {
          alert("Session expired, please login again");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/login");
        } else {
          // For other errors, still clear and redirect
          console.error("Unexpected error:", err);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    validateSession();
    validateSession();
  }, [router, searchParams]);

  // --- Review Handlers ---

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
          alert("Review submitted successfully!");
          setNewReview({ placeName: "", location: "", rating: 5, comment: "", images: [] });
          setCurrentImageUrl("");
          setShowReviewModal(false);
        }
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddImage = () => {
    if (!currentImageUrl.trim()) return;
    setNewReview((prev: any) => ({ ...prev, images: [...prev.images, currentImageUrl.trim()] }));
    setCurrentImageUrl("");
  };

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
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.url) {
          setNewReview((prev: any) => ({ ...prev, images: [...prev.images, data.url] }));
        }
      } else {
        console.error("Upload failed");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setNewReview((prev: any) => ({ ...prev, images: prev.images.filter((_: any, i: number) => i !== index) }));
  };



  // Prevent flash of content while checking auth
  if (!user) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF5E9' }}>Loading Odyssey...</div>;
  }

  return (
    <div className="dashboard-wrapper">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          {/* Logo + Text */}
          <div className="nav-logo">
            <div className="logo-image">
              <img src="/Odyssey_Logo.png" alt="Odyssey Logo" />
            </div>
            <span className="logo-text">Odyssey</span>
          </div>

          {/* Desktop Links */}
          <div className="nav-links">
            <a href="#" className="nav-link active">Home</a>
            <a onClick={() => router.push("/planner")} className="nav-link">Planner</a>
            <a href="#" className="nav-link">My Trips</a>
            <a href="#" className="nav-link">Saved places</a>
            <a href="#" className="nav-link">Co-Travellers</a>
          </div>

          {/* Buttons */}
          <div className="nav-buttons">
            <button className="icon-button">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#141414">
                <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
              </svg>
            </button>
            <div
              className="profile-dropdown"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
              style={{ position: "relative" }}
            >
              <button
                className="icon-button profile-icon"
                onClick={() => router.push("/profile")}
              >
                <svg className="user-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <a onClick={() => router.push("/profile")}>My Destinations</a>
                  <a onClick={() => router.push("/saved-places")}>Saved Places</a>
                  <a onClick={() => router.push("/settings")}>Settings</a>
                  <a onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    router.push("/login");
                  }}>Logout</a>
                </div>
              )}
            </div>


          </div>

          {/* Mobile Menu Button */}
          <div className="mobile-menu-btn-wrapper">
            <button
              id="mobile-menu-button"
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* Hero Section with Search */}
        <div className="hero-section">
          <img src="/dashboard-bg.jpg" alt="Travel" className="hero-image" />
          <div className="hero-overlay">
            <div className="search-wrapper">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search your next destination..."
                  className="search-input"
                />
                <button className="search-button">
                  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#F19E39">
                    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                  </svg>
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Drafts Section */}
        <div className="section">
          <h2 className="section-title">Recent Drafts</h2>
          <div className="drafts-grid">
            {recentDrafts.map((draft, index) => (
              <div key={index} className="draft-card">
                <img src={draft.image} alt={draft.title} className="draft-image" />
                <div className="draft-gradient"></div>
                <span className="draft-label">{draft.title}</span>
              </div>
            ))}
            <div className="draft-card add-card">
              <svg className="add-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Recommended Section */}
        <div className="section">
          <h2 className="section-title-center">Recommended For You:</h2>
          <div className="recommended-grid">
            {recommendations.map((item, index) => (
              <div key={index} className="recommended-card">
                <img src={item.image} alt={item.title} className="recommended-image" />
                <div className="recommended-gradient"></div>
                <span className="recommended-label">{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Cards */}
        <div className="action-cards">
          <div className="action-card-large">
            <h3 className="action-title-large">Check out what your Friends are doing!</h3>
            <button className="action-button">
              <span className="arrow">→</span>
            </button>
          </div>
          <div className="action-cards-right">
            <div className="action-card-small pictures">
              <h3 className="action-title-small">Share Pictures</h3>
            </div>
            <button
              className="action-card-small review w-full"
              onClick={() => {
                console.log("Review clicked");
                setShowReviewModal(true);
              }}
              type="button"
            >
              <h3 className="action-title-small">Review a place</h3>
            </button>
          </div>
        </div>

        {/* Your Timeline Section */}
        <div className="timeline-section">
          <h2 className="timeline-title">Your Timeline</h2>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">
          ©Odyssey. Made with <span className="heart">❤️</span> by Route6
        </p>
      </footer>

      {/* Add Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewReview({ ...newReview, placeName: e.target.value })}
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewReview({ ...newReview, location: e.target.value })}
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
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewReview({ ...newReview, comment: e.target.value })}
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentImageUrl(e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleAddImage()}
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
                    {newReview.images.map((url: string, index: number) => (
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
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={submittingReview || !newReview.placeName}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition flex items-center justify-center gap-2 ${submittingReview || !newReview.placeName
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#4A9B7F] hover:bg-[#3d8a6d]"
                  }`}
              >
                {submittingReview ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Post Review"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
