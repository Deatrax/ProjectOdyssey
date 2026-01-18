"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// --- Mock Data simulating the OOP Structure ---
const MOCK_COUNTRIES = [
  { id: "c1", name: "Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800", count: 12 },
  { id: "c2", name: "Switzerland", image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800", count: 8 },
];

const MOCK_CITIES = [
  { id: "ct1", name: "Kyoto", country: "Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800", tags: ["History", "Nature"] },
  { id: "ct2", name: "Interlaken", country: "Switzerland", image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800", tags: ["Nature", "Adventure"] },
  { id: "ct3", name: "New York", country: "USA", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800", tags: ["Urban", "Food"] },
];

export default function DestinationsPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#FFF5E9] font-sans flex flex-col">
      
      {/* 1. Header Section */}
      <header className="px-8 py-6 flex items-center justify-between bg-[#FFF5E9]">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌐</span>
          <span className="font-bold text-xl tracking-wide text-stone-800">Odyssey</span>
        </div>
        <div className="flex gap-4">
           {/* Navigation Links from your uploaded image */}
           <nav className="hidden md:flex gap-6 text-sm font-medium text-stone-600">
             <a href="/dashboard" className="hover:text-black">Dashboard</a>
             <a href="/destinations" className="text-black font-bold border-b-2 border-black pb-1">Destinations</a>
             <a href="/planner" className="hover:text-black">Planner</a>
           </nav>
        </div>
        <div className="w-10 h-10 rounded-full bg-stone-300 overflow-hidden">
           {/* Profile Pic Placeholder */}
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
        </div>
      </header>

      <main className="flex-1 px-8 pb-12 max-w-7xl mx-auto w-full">
        
        {/* 2. Hero Search */}
        <div className="relative h-[300px] rounded-3xl overflow-hidden mb-12 shadow-2xl group">
          <Image 
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600" 
            alt="Hero" 
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white">
            <h1 className="text-5xl font-bold mb-4 font-serif">Explore the World</h1>
            <p className="text-lg opacity-90 mb-8">Find your next adventure from over 10,000 locations.</p>
            
            {/* Search Bar */}
            <div className="w-[60%] max-w-2xl bg-white rounded-full p-2 flex shadow-xl transform translate-y-4">
              <span className="pl-4 pr-2 flex items-center text-xl">🔍</span>
              <input 
                type="text" 
                placeholder="Search for a city, country, or landmark (e.g. Disneyland)..." 
                className="flex-1 outline-none text-gray-700 text-lg placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-stone-800 transition">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* 3. Browse by Country (Horizontal Scroll) */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-3xl font-bold text-stone-800">Browse by Country</h2>
            <button className="text-sm font-bold underline">View All</button>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {MOCK_COUNTRIES.map((country) => (
              <div 
                key={country.id}
                onClick={() => window.open(`/destinations/country/${country.id}`, '_blank')}
                className="min-w-[280px] h-[350px] relative rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 group"
              >
                <Image src={country.image} alt={country.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white text-2xl font-bold">{country.name}</h3>
                  <p className="text-stone-300 text-sm">{country.count} Destinations</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Popular Cities (Masonry-ish Grid) */}
        <div>
          <h2 className="text-3xl font-bold text-stone-800 mb-6">Trending Cities</h2>
          
          {/* Filters */}
          <div className="flex gap-3 mb-8">
            {["All", "Urban", "Nature", "History"].map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveFilter(cat.toLowerCase())}
                className={`px-6 py-2 rounded-full border border-stone-300 font-medium transition-all
                  ${activeFilter === cat.toLowerCase() ? "bg-black text-white border-black" : "bg-transparent text-stone-600 hover:bg-stone-100"}
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_CITIES.map((city) => (
              <div 
                key={city.id}
                onClick={() => window.open(`/destinations/city/${city.id}`, '_blank')} // Opens in new tab as requested
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border border-stone-100 group"
              >
                <div className="h-48 relative overflow-hidden">
                  <Image 
                    src={city.image} 
                    alt={city.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    {city.tags.map(tag => (
                      <span key={tag} className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-stone-900">{city.name}</h3>
                      <p className="text-stone-500 text-sm">📍 {city.country}</p>
                    </div>
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">
                      4.9 ★
                    </div>
                  </div>
                  
                  <p className="mt-4 text-stone-600 text-sm line-clamp-2">
                    Discover the perfect blend of {city.tags.join(" and ").toLowerCase()} in this amazing destination.
                  </p>

                  <div className="mt-6 pt-4 border-t border-stone-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-stone-400">12 POIs Inside</span>
                    <button className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-[#1db954] transition-colors">
                      →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}