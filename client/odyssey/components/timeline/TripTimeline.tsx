'use client';

import React, { useEffect, useState } from 'react';
import { CalendarDays, MapPin, Star, Award } from 'lucide-react';
import TimelineCard from './TimelineCard';
import TripMemoryModal from './TripMemoryModal';

interface Trip {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: string;
  isCompleted: boolean;
  image: string | null;
  memory: any;
  selectedPlaces: any[];
  itineraryData: any;
}

interface TimelineData {
  pastTrips: Trip[];
  upcomingTrips: Trip[];
  stats: {
    totalTrips: number;
    completedTrips: number;
    upcomingTrips: number;
  };
}

const TripTimeline: React.FC = () => {
  const [timeline, setTimeline] = useState<TimelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showMemoryModal, setShowMemoryModal] = useState(false);

  useEffect(() => {
    console.log('🕐 TripTimeline mounted, fetching data...');
    fetchTimeline();
    // Refresh timeline every 5 minutes to show trip status changes
    const interval = setInterval(fetchTimeline, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchTimeline = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      
      console.log('🔍 Fetching timeline... Token:', token ? 'exists' : 'missing');
      
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:4000/api/trips/timeline', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📊 Timeline API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch timeline (${response.status})`);
      }

      const data = await response.json();
      console.log('✅ Timeline data received:', data);
      setTimeline(data.data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('❌ Error fetching timeline:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTripClick = (trip: Trip) => {
    setSelectedTrip(trip);
    setShowMemoryModal(true);
  };

  const handleMemoryUpdate = () => {
    // Refresh timeline to get updated data
    fetchTimeline();
    setShowMemoryModal(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading your timeline...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-red-800 font-bold mb-2">Error Loading Timeline</h3>
        <p className="text-red-700 text-sm mb-4">{error}</p>
        <button
          onClick={fetchTimeline}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">📅</span>
          <h2 className="text-3xl font-bold text-gray-900">Your Journey Timeline</h2>
        </div>
        <p className="text-gray-600">Celebrate your completed trips and plan your next adventure</p>
      </div>

      {/* Stats Bar */}
      {timeline ? (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
            <div className="text-3xl font-bold text-amber-600">{timeline.stats.completedTrips}</div>
            <div className="text-sm text-gray-600 font-medium">Trips Completed</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
            <div className="text-3xl font-bold text-blue-600">{timeline.stats.upcomingTrips}</div>
            <div className="text-sm text-gray-600 font-medium">Upcoming Adventures</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
            <div className="text-3xl font-bold text-purple-600">{timeline.stats.totalTrips}</div>
            <div className="text-sm text-gray-600 font-medium">Total Journeys</div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 mb-8 animate-pulse">
          <div className="bg-gray-200 rounded-2xl p-6 h-24"></div>
          <div className="bg-gray-200 rounded-2xl p-6 h-24"></div>
          <div className="bg-gray-200 rounded-2xl p-6 h-24"></div>
        </div>
      )}

      {/* Past Trips Timeline */}
      {timeline && timeline.pastTrips.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-amber-600" />
            <h3 className="text-2xl font-bold text-gray-900">Your Journey So Far</h3>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-orange-400 rounded-full"></div>

            {/* Past trips - vertical timeline */}
            <div className="space-y-8 pl-8">
              {timeline.pastTrips.map((trip, index) => (
                <div
                  key={trip.id}
                  className="relative"
                  onClick={() => handleTripClick(trip)}
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-10 top-2 w-6 h-6 bg-amber-500 rounded-full border-4 border-white shadow-lg cursor-pointer hover:bg-amber-600 transition"></div>

                  <TimelineCard
                    trip={trip}
                    isCompleted={true}
                    onClick={() => handleTripClick(trip)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Trips Section */}
      {timeline && timeline.upcomingTrips.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-2xl">🔮</div>
            <h3 className="text-2xl font-bold text-gray-900">Upcoming Adventures</h3>
          </div>

          {/* Horizontal scrollable timeline */}
          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex gap-6 min-w-min">
              {timeline.upcomingTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                  onClick={() => handleTripClick(trip)}
                >
                  <TimelineCard
                    trip={trip}
                    isCompleted={false}
                    onClick={() => handleTripClick(trip)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {timeline && timeline.pastTrips.length === 0 && timeline.upcomingTrips.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-b from-amber-50 to-orange-50 rounded-2xl border-2 border-dashed border-amber-300">
          <MapPin className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <p className="text-gray-700 text-lg font-bold mb-2">Your timeline awaits adventure!</p>
          <p className="text-gray-600 text-sm max-w-md mx-auto">Start planning a trip to populate your timeline. Each completed journey becomes part of your story.</p>
        </div>
      )}

      {/* Memory Modal */}
      {selectedTrip && (
        <TripMemoryModal
          isOpen={showMemoryModal}
          onClose={() => setShowMemoryModal(false)}
          trip={selectedTrip}
          onUpdate={handleMemoryUpdate}
        />
      )}

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .space-y-8 > div {
          animation: slideInRight 0.5s ease-out forwards;
        }

        .space-y-8 > div:nth-child(1) { animation-delay: 0.1s; }
        .space-y-8 > div:nth-child(2) { animation-delay: 0.2s; }
        .space-y-8 > div:nth-child(3) { animation-delay: 0.3s; }
        .space-y-8 > div:nth-child(4) { animation-delay: 0.4s; }
        .space-y-8 > div:nth-child(5) { animation-delay: 0.5s; }

        .min-w-min > div {
          animation: slideInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TripTimeline;
