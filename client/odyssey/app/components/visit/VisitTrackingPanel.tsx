'use client';

import { useState, useEffect } from 'react';
import { useVisitTracking } from '../../hooks/useVisitTracking';
import {
  CheckInButton,
  CheckOutModal,
  ActiveVisitCard,
  VisitHistory,
  TripProgress,
  VisitStats,
} from './index';

interface Place {
  id: string;
  name: string;
  category?: string;
  expectedDuration?: number;
  visited?: boolean;
}

interface VisitTrackingPanelProps {
  itineraryId: string;
  places: Place[];
  token: string;
  onVisitChange?: (visitCount: number) => void;
}

/**
 * VisitTrackingPanel Component
 * Complete integration of all visit tracking components
 * Displays current visit, history, progress, and summary
 */
export const VisitTrackingPanel: React.FC<VisitTrackingPanelProps> = ({
  itineraryId,
  places,
  token,
  onVisitChange,
}) => {
  const [checkOutModalOpen, setCheckOutModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'progress' | 'summary'>('current');
  const [showStats, setShowStats] = useState(false);
  const [checkingInPlaceId, setCheckingInPlaceId] = useState<string | null>(null);

  const {
    currentVisit,
    visitHistory,
    progress,
    tripSummary,
    loading,
    error,
    checkIn,
    checkOut,
    addFeedback,
    skipPlace,
    fetchProgress,
    fetchSummary,
  } = useVisitTracking(itineraryId, token);

  // Notify parent of visit changes
  useEffect(() => {
    if (onVisitChange) {
      onVisitChange(visitHistory.length);
    }
  }, [visitHistory.length, onVisitChange]);

  // Auto-refresh summary when showing stats
  useEffect(() => {
    if (showStats) {
      fetchSummary();
    }
  }, [showStats, fetchSummary]);

  const handleCheckIn = async (checkInData: any) => {
    setCheckingInPlaceId(checkInData.placeId);
    try {
      await checkIn(checkInData);
    } finally {
      setCheckingInPlaceId(null);
    }
  };

  const unvisitedPlaces = places.filter(
    (p) => !visitHistory.some((v) => v.place_id === p.id)
  );

  return (
    <div className="w-full space-y-4">
      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-lg">
          <p className="font-semibold">⚠️ Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveTab('current')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'current'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Current Visit
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'history'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          History ({visitHistory.length})
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'progress'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Progress
        </button>
        <button
          onClick={() => {
            setShowStats(!showStats);
            if (!showStats) setActiveTab('summary');
          }}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            showStats
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Summary
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        {/* Current Visit Tab */}
        {activeTab === 'current' && (
          <div className="space-y-4">
            {currentVisit ? (
              <>
                <ActiveVisitCard
                  currentVisit={currentVisit}
                  onOpenCheckOut={() => setCheckOutModalOpen(true)}
                  loading={loading}
                />
              </>
            ) : (
              <div className="text-center p-6">
                <p className="text-gray-600 mb-4">No active visit. Select a place to check in.</p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800 mb-3">Unvisited Places</h4>
                  {unvisitedPlaces.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                      {unvisitedPlaces.map((place) => (
                        <div
                          key={place.id}
                          className="bg-gray-50 p-3 rounded-lg flex justify-between items-center"
                        >
                          <div>
                            <p className="font-semibold text-gray-800">{place.name}</p>
                            {place.category && (
                              <p className="text-xs text-gray-600">{place.category}</p>
                            )}
                          </div>
                          <CheckInButton
                            placeId={place.id}
                            placeName={place.name}
                            category={place.category}
                            expectedDuration={place.expectedDuration}
                            onCheckIn={handleCheckIn}
                            loading={checkingInPlaceId === place.id}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm">All places visited!</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <VisitHistory
            visits={visitHistory}
            onAddFeedback={addFeedback}
            loading={loading}
          />
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <TripProgress progress={progress} loading={loading} />
        )}

        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <VisitStats summary={tripSummary} loading={loading} />
        )}
      </div>

      {/* Check Out Modal */}
      <CheckOutModal
        isOpen={checkOutModalOpen}
        currentVisit={currentVisit}
        onCheckOut={checkOut}
        onSkip={skipPlace}
        onClose={() => setCheckOutModalOpen(false)}
        loading={loading}
      />
    </div>
  );
};
