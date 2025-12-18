// app/dashboard/page.tsx
"use client";

import React from "react";
import Image from "next/image";


const DashboardPage: React.FC = () => {
  return (
    <div className="bg-[#FFF5E9] min-h-screen font-body">
      {/* Navigation */}
      <nav className="bg-[#FFF5E9] px-8 py-4 bg-stone-900/15 backdrop-blur-xl border border-white/20 rounded-full mx-16 my-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#F19E39"
              >
                <path d="m300-300 280-80 80-280-280 80-80 280Zm180-120q-25 0-42.5-17.5T420-480q0-25 17.5-42.5T480-540q25 0 42.5 17.5T540-480q0 25-17.5 42.5T480-420Zm0 340q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Zm0-320Z"/>
              </svg>
            </div>
            <span className="text-2xl font-medium font-odyssey tracking-wider">Odyssey</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-900 font-semibold underline">Home</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Planner</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">My Trips</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Saved places</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Co-Travellers</a>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#141414"
              >
                <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Hero Section */}
        <div className="relative mb-12 rounded-3xl overflow-hidden h-96 shadow-xl">
        <Image
            src="/dashboard-bg.jpg"
            alt="Travel"
            fill
            className="object-cover"
        />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="w-full max-w-xl px-4">
              <div className="flex items-center bg-gray-900 bg-opacity-70 rounded-full overflow-hidden">
                <input
                  type="text"
                  placeholder="Search your next destination..."
                  className="flex-1 px-6 py-3 bg-transparent text-white placeholder-gray-300 focus:outline-none"
                />
                <button className="bg-white text-gray-800 px-4 py-1 m-2 rounded-full text-sm font-medium hover:bg-gray-100 transition flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#F19E39"
                  >
                    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                  </svg>
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Drafts */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Recent Drafts</h2>
          <div className="flex gap-4">
            <div className="relative w-40 h-32 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition shadow-lg">
              <img src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=300&h=300&fit=crop" alt="Bali Trip" className="w-full h-full object-cover brightness-75"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <span className="absolute bottom-3 left-3 text-white text-sm font-semibold">Bali Trip</span>
            </div>
            <div className="relative w-40 h-32 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition shadow-lg">
              <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop" alt="Darjeeling Trip" className="w-full h-full object-cover brightness-75"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <span className="absolute bottom-3 left-3 text-white text-sm font-semibold">Darjeeling Trip</span>
            </div>
            <div className="w-40 h-32 rounded-2xl bg-gray-300 bg-opacity-60 flex items-center justify-center cursor-pointer hover:bg-gray-400 transition shadow-lg">
              <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Recommended For You */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6 text-center">Recommended For You:</h2>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="relative h-36 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition shadow-lg">
              <img src="https://images.unsplash.com/photo-1509233725247-49e657c54213?w=400&h=300&fit=crop" alt="Summer Vibes" className="w-full h-full object-cover brightness-75"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <span className="absolute bottom-3 left-3 text-white text-sm font-semibold">Summer Vibes</span>
            </div>
            <div className="relative h-36 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition shadow-lg">
              <img src="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400&h=300&fit=crop" alt="Winter Trips near you" className="w-full h-full object-cover brightness-75"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <span className="absolute bottom-3 left-3 text-white text-sm font-semibold">Winter Trips near you</span>
            </div>
            <div className="relative h-36 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition shadow-lg">
              <img src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop" alt="Shopping this season" className="w-full h-full object-cover brightness-75"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <span className="absolute bottom-3 left-3 text-white text-sm font-semibold">Shopping this season</span>
            </div>
            <div className="relative h-36 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition shadow-lg">
              <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop" alt="Safari" className="w-full h-full object-cover brightness-75"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <span className="absolute bottom-3 left-3 text-white text-sm font-semibold">Safari</span>
            </div>
          </div>
          <div className="w-1/4">
            <div className="relative h-36 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition shadow-lg">
              <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" alt="Scotland Trip" className="w-full h-full object-cover brightness-75"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <span className="absolute bottom-3 left-3 text-white text-sm font-semibold">Scotland Trip</span>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#3A3A3A] text-white rounded-2xl p-8 flex flex-col items-center justify-center h-52 shadow-xl">
            <h3 className="text-4xl font-bold mb-6 text-center">Check out what your Friends are doing!</h3>
            <button className="bg-gray-300 text-gray-800 px-8 py-3 rounded-full flex items-center justify-center hover:bg-gray-400 transition">
              <span className="font-bold text-2xl">→</span>
            </button>
          </div>
          <div className="grid grid-rows-2 gap-4">
            <div className="bg-[#ADC4CE] text-gray-900 rounded-2xl flex items-center justify-center shadow-xl">
              <h3 className="text-4xl font-bold">Share Pictures</h3>
            </div>
            <div className="bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-xl">
              <h3 className="text-4xl font-bold">Review a place</h3>
            </div>
          </div>
        </div>

        {/* Timeline */}
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
