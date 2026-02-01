// app/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react"; // Import useEffect
import { useRouter } from "next/navigation";
import Image from "next/image";

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

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  // --- PROTECTION LOGIC ---
  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem("token");

      // 1. Immediate check: No token? Go to login.
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // 2. Verification check: Ask backend if token is valid
        // NOTE: Use the same IP/URL that worked for your login (e.g., localhost:4000 or your PC IP)
        const res = await fetch("http://localhost:4000/api/user/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        // 3. If backend says error (401/403), the token is bad/expired
        if (!res.ok) {
          throw new Error("Invalid token");
        }

        // 4. Token is good! Load user data
        const data = await res.json();
        setUser(data.user);

        // Optional: Update local storage with fresh user data
        localStorage.setItem("user", JSON.stringify(data.user));

      } catch (err) {
        console.error("Session expired:", err);
        alert("session expired, please login again");
        // 5. CRITICAL: Wipe storage so Login page doesn't bounce us back
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, [router]);

  // Prevent flash of content while checking auth
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FFF5E9]">Loading Odyssey...</div>;
  }

  return (
    <div className="bg-[#FFF5E9] min-h-screen font-body">
      {/* --- Navigation --- */}
      <nav className="sticky top-4 z-50 px-4 sm:px-8 py-4 bg-[#FFF5E9]/10 backdrop-blur-lg border border-white/30 rounded-2xl mx-4 sm:mx-16 my-4 sm:my-8 shadow-lg">
        <div className="flex items-center justify-between">
          {/* Logo + Text */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center">
              {/* Ensure this path points to your public folder */}
              <img
                src="/Odyssey_Logo.png"
                alt="Odyssey Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl sm:text-2xl font-medium font-odyssey tracking-wider">
              Odyssey
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <a href="#" className="text-gray-900 font-semibold underline">Home</a>
            <a onClick={() => router.push("/planner")} className="text-black hover:font-bold transition-all cursor-pointer">Planner</a>
            <a onClick={() => router.push("/my-trips")} className="text-black hover:font-bold transition-all cursor-pointer">My Trips</a>
            <a href="#" className="text-black hover:font-bold transition-all">Saved places</a>
            <a href="#" className="text-black hover:font-bold transition-all">Co-Travellers</a>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#141414">
                <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
              </svg>
            </button>
            <button onClick={() => router.push("/profile")} className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="flex flex-col gap-3 mt-4 md:hidden pb-2">
            <a href="#" className="text-black font-medium hover:pl-2 transition-all">Home</a>
            <a onClick={() => router.push("/planner")} className="text-black font-medium hover:pl-2 transition-all cursor-pointer">Planner</a>
            <a onClick={() => router.push("/my-trips")} className="text-black font-medium hover:pl-2 transition-all cursor-pointer">My Trips</a>
            <a href="#" className="text-black font-medium hover:pl-2 transition-all">Saved places</a>
            <a href="#" className="text-black font-medium hover:pl-2 transition-all">Co-Travellers</a>
          </div>
        )}
      </nav>

      {/* --- Main Content --- */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">

        {/* Hero Section with Search */}
        <div className="relative mb-12 rounded-3xl overflow-hidden h-64 sm:h-96 shadow-xl">
          {/* Ensure this path points to your public folder */}
          <img
            src="dashboard-bg.jpg"
            alt="Travel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="w-full max-w-xl px-4">
              <div
                onClick={() => router.push('/destinations')}
                className="flex items-center bg-gray-900 bg-opacity-70 rounded-full overflow-hidden cursor-pointer hover:bg-opacity-80 transition"
              >
                <input
                  type="text"
                  placeholder="Search your next destination..."
                  className="flex-1 px-4 sm:px-6 py-3 bg-transparent text-white placeholder-gray-300 focus:outline-none pointer-events-none"
                  readOnly
                />
                <button className="mt-2 mx-4 sm:mt-0 sm:ml-2 bg-white text-gray-800 px-4 py-1 rounded-full text-sm font-medium hover:bg-gray-100 transition flex items-center gap-1 mb-2 sm:mb-0 pointer-events-none">
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
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Recent Drafts</h2>
          <div className="flex flex-wrap gap-4">
            {recentDrafts.map((draft, index) => (
              <div key={index} className="relative w-1/2 sm:w-40 h-32 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition shadow-lg">
                <img src={draft.image} alt={draft.title} className="w-full h-full object-cover brightness-75" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <span className="absolute bottom-3 left-3 text-white text-sm font-semibold">{draft.title}</span>
              </div>
            ))}

            {/* 'Add New' Placeholder */}
            <div className="w-1/2 sm:w-40 h-32 rounded-2xl bg-gray-300 bg-opacity-60 flex items-center justify-center cursor-pointer hover:bg-gray-400 transition shadow-lg">
              <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Recommended Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6 text-center text-gray-900">Recommended For You:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {recommendations.map((item, index) => (
              <div key={index} className="relative h-36 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition shadow-lg">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover brightness-75" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <span className="absolute bottom-3 left-3 text-white text-sm font-semibold">{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-[#3A3A3A] text-white rounded-2xl p-8 flex flex-col items-center justify-center h-52 shadow-xl">
            <h3 className="text-4xl font-bold mb-6 text-center">Check out what your Friends are doing!</h3>
            <button className="bg-gray-300 text-gray-800 px-8 py-3 rounded-full flex items-center justify-center hover:bg-gray-400 transition">
              <span className="font-bold text-2xl">→</span>
            </button>
          </div>
          <div className="grid grid-rows-2 gap-4">
            <div className="bg-[#ADC4CE] text-gray-900 rounded-2xl flex items-center justify-center shadow-xl h-32 sm:h-full">
              <h3 className="text-4xl font-bold">Share Pictures</h3>
            </div>
            <div className="bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-xl h-32 sm:h-full">
              <h3 className="text-4xl font-bold">Review a place</h3>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-gray-300 rounded-2xl p-8 text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-700">Your Timeline</h2>
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

export default DashboardPage;
