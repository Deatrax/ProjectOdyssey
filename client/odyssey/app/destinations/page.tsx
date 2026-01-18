// app/destinations/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// --- Types & Interfaces ---
interface DestinationCardProps {
  id: string;
  name: string;
  type: "COUNTRY" | "CITY" | "POI";
  image: string;
  description?: string;
}

interface TrendingDestination {
  name: string;
  type: "COUNTRY" | "CITY";
  slug: string;
  popularity: number;
}

// --- Mock Data ---
const recentSearches: DestinationCardProps[] = [
  {
    id: "1",
    name: "Bali",
    type: "CITY",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop",
    description: "Island of the Gods"
  },
  {
    id: "2",
    name: "Bhutan",
    type: "COUNTRY",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    description: "Land of the Thunder Dragon"
  },
  {
    id: "3",
    name: "Santorini",
    type: "CITY",
    image: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=600&h=400&fit=crop",
    description: "Greek Island Paradise"
  },
  {
    id: "4",
    name: "Dubai",
    type: "CITY",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop",
    description: "City of Gold"
  }
];

const trendingDestinations: TrendingDestination[] = [
  { name: "Khulna", type: "CITY", slug: "khulna", popularity: 9500 },
  { name: "Tangail", type: "CITY", slug: "tangail", popularity: 9200 },
  { name: "Satkhira", type: "CITY", slug: "satkhira", popularity: 8900 },
  { name: "Sylhet", type: "CITY", slug: "sylhet", popularity: 8700 },
  { name: "Cox's Bazar", type: "CITY", slug: "coxs-bazar", popularity: 9800 },
  { name: "Rangamati", type: "CITY", slug: "rangamati", popularity: 8500 },
  { name: "Bandarban", type: "CITY", slug: "bandarban", popularity: 8300 },
  { name: "Chittagong", type: "CITY", slug: "chittagong", popularity: 9100 }
];

const popularCountries: DestinationCardProps[] = [
  {
    id: "c1",
    name: "Japan",
    type: "COUNTRY",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop",
    description: "Land of the Rising Sun"
  },
  {
    id: "c2",
    name: "Italy",
    type: "COUNTRY",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&h=400&fit=crop",
    description: "The Eternal Beauty"
  },
  {
    id: "c3",
    name: "Thailand",
    type: "COUNTRY",
    image: "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=600&h=400&fit=crop",
    description: "Land of Smiles"
  },
  {
    id: "c4",
    name: "France",
    type: "COUNTRY",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop",
    description: "Romance & Culture"
  },
  {
    id: "c5",
    name: "United States",
    type: "COUNTRY",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop",
    description: "Land of Opportunity"
  },
  {
    id: "c6",
    name: "Australia",
    type: "COUNTRY",
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&h=400&fit=crop",
    description: "Down Under"
  }
];

const DestinationsPage: React.FC = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DestinationCardProps[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showBrowseCountries, setShowBrowseCountries] = useState(false);

  // Simulate search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      // In real app, this would be an API call
      const mockResults: DestinationCardProps[] = [
        {
          id: "search-1",
          name: searchQuery,
          type: "CITY",
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
        }
      ];
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 500);
  };

  return (
    <div className="bg-[#FFF5E9] min-h-screen font-body">
      {/* --- Navigation --- */}
      <nav className="sticky top-4 z-50 px-4 sm:px-8 py-4 bg-[#FFF5E9]/10 backdrop-blur-lg border border-white/30 rounded-2xl mx-4 sm:mx-16 my-4 sm:my-8 shadow-lg">
        <div className="flex items-center justify-between">
          {/* Logo + Text */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center">
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
            <a onClick={() => router.push("/dashboard")} className="text-black hover:font-bold transition-all cursor-pointer">Home</a>
            <a onClick={() => router.push("/planner")} className="text-black hover:font-bold transition-all cursor-pointer">Planner</a>
            <a href="#" className="text-black hover:font-bold transition-all">My Trips</a>
            <a href="#" className="text-gray-900 font-semibold underline">Destinations</a>
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
            <a onClick={() => router.push("/dashboard")} className="text-black font-medium hover:pl-2 transition-all cursor-pointer">Home</a>
            <a onClick={() => router.push("/planner")} className="text-black font-medium hover:pl-2 transition-all cursor-pointer">Planner</a>
            <a href="#" className="text-black font-medium hover:pl-2 transition-all">My Trips</a>
            <a href="#" className="text-black font-bold pl-2">Destinations</a>
            <a href="#" className="text-black font-medium hover:pl-2 transition-all">Co-Travellers</a>
          </div>
        )}
      </nav>

      {/* --- Main Content --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        
        {/* Hero Search Section */}
        <div className="mb-12">
          <form onSubmit={handleSearch} className="relative max-w-4xl mx-auto">
            <div className="flex items-center bg-gray-900 rounded-full overflow-hidden shadow-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your next destination....."
                className="flex-1 px-6 sm:px-8 py-4 sm:py-5 bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg"
              />
              <button 
                type="submit"
                className="mr-3 p-3 bg-white hover:bg-gray-200 rounded-full transition-colors"
                disabled={isSearching}
              >
                <svg 
                  className="w-6 h-6 text-gray-900" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </form>

          {/* Browse by Country Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowBrowseCountries(!showBrowseCountries)}
              className="bg-[#4A9B7F] hover:bg-[#3d8a6d] text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Browse by Country
            </button>
          </div>
        </div>

        {/* Browse by Country Section (Collapsible) */}
        {showBrowseCountries && (
          <div className="mb-12 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Popular Countries</h2>
              <button 
                onClick={() => setShowBrowseCountries(false)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularCountries.map((country) => (
                <div 
                  key={country.id}
                  className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
                  onClick={() => router.push(`/destinations/country/${country.name.toLowerCase()}`)}
                >
                  <img 
                    src={country.image} 
                    alt={country.name} 
                    className="w-full h-full object-cover brightness-75 group-hover:scale-110 transition duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white text-2xl font-bold mb-1">{country.name}</h3>
                    <p className="text-gray-200 text-sm">{country.description}</p>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#4A9B7F] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Searches Section */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Recent Searches:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentSearches.map((search) => (
              <div 
                key={search.id}
                className="relative h-56 rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
                onClick={() => router.push(`/destinations/${search.type.toLowerCase()}/${search.name.toLowerCase()}`)}
              >
                <img 
                  src={search.image} 
                  alt={search.name} 
                  className="w-full h-full object-cover brightness-75 group-hover:scale-110 transition duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-xl font-bold">{search.name}</h3>
                  {search.description && (
                    <p className="text-gray-200 text-sm mt-1">{search.description}</p>
                  )}
                </div>
                {/* Type badge */}
                <div className="absolute top-3 right-3">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-xs font-semibold">
                    {search.type}
                  </span>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#4A9B7F] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Section */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            Trending
            <span className="text-3xl">�</span>
            :
          </h2>
          
          {/* Trending list in a card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingDestinations.map((destination, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-4 hover:bg-[#FFF5E9] rounded-xl cursor-pointer transition-colors group"
                  onClick={() => router.push(`/destinations/${destination.type.toLowerCase()}/${destination.slug}`)}
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-[#4A9B7F] text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#4A9B7F] transition-colors">
                      {destination.name}
                    </h3>
                    <p className="text-xs text-gray-500 capitalize">{destination.type.toLowerCase()}</p>
                  </div>
                  <svg 
                    className="w-5 h-5 text-gray-400 group-hover:text-[#4A9B7F] transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Explore by Category Section */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Explore by Interest</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Urban Category */}
            <div 
              className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
              onClick={() => router.push("/destinations/category/urban")}
            >
              <img 
                src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=400&fit=crop" 
                alt="Urban" 
                className="w-full h-full object-cover brightness-75 group-hover:scale-110 transition duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-3">�️</div>
                  <h3 className="text-white text-3xl font-bold">Urban</h3>
                  <p className="text-gray-200 text-sm mt-2">Cities & Culture</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-[#4A9B7F] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>

            {/* Nature Category */}
            <div 
              className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
              onClick={() => router.push("/destinations/category/nature")}
            >
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop" 
                alt="Nature" 
                className="w-full h-full object-cover brightness-75 group-hover:scale-110 transition duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-3">�️</div>
                  <h3 className="text-white text-3xl font-bold">Nature</h3>
                  <p className="text-gray-200 text-sm mt-2">Parks & Wildlife</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-[#4A9B7F] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>

            {/* History Category */}
            <div 
              className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
              onClick={() => router.push("/destinations/category/history")}
            >
              <img 
                src="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&h=400&fit=crop" 
                alt="History" 
                className="w-full h-full object-cover brightness-75 group-hover:scale-110 transition duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-3">�️</div>
                  <h3 className="text-white text-3xl font-bold">History</h3>
                  <p className="text-gray-200 text-sm mt-2">Heritage & Monuments</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-[#4A9B7F] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>

        {/* Featured Destinations */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Editor's Picks</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Large featured card */}
            <div 
              className="relative h-96 rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
              onClick={() => router.push("/destinations/city/tokyo")}
            >
              <img 
                src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop" 
                alt="Tokyo" 
                className="w-full h-full object-cover brightness-75 group-hover:scale-110 transition duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold">
                  ⭐ FEATURED
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-white text-4xl font-bold mb-2">Tokyo</h3>
                <p className="text-gray-200 text-lg mb-4">Where tradition meets innovation</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-white font-semibold">4.9</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-300">1,234 reviews</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-[#4A9B7F] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>

            {/* Grid of smaller cards */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { name: "Paris", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=400&fit=crop", rating: 4.8 },
                { name: "Maldives", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=400&fit=crop", rating: 4.9 },
                { name: "New York", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=400&fit=crop", rating: 4.7 },
                { name: "Iceland", image: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=400&h=400&fit=crop", rating: 4.8 }
              ].map((dest, index) => (
                <div 
                  key={index}
                  className="relative h-44 rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
                  onClick={() => router.push(`/destinations/city/${dest.name.toLowerCase()}`)}
                >
                  <img 
                    src={dest.image} 
                    alt={dest.name} 
                    className="w-full h-full object-cover brightness-75 group-hover:scale-110 transition duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white text-lg font-bold">{dest.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-400 text-sm">⭐</span>
                      <span className="text-white text-sm font-semibold">{dest.rating}</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-[#4A9B7F] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
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

export default DestinationsPage;