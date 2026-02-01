// client/odyssey/app/my-trips/page.tsx
// My Trips Page with Progress Integration

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import TripCard, { TripCardSkeleton, TripCardProps } from '@/components/TripCard';
import NotificationBanner, { NotificationContainer } from '@/components/NotificationBanner';

export default function MyTripsPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [trips, setTrips] = useState<TripCardProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'draft'>('all');

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }

        // Fetch trips
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        try {
            setLoading(true);

            // Mock data for now
            const mockTrips: TripCardProps[] = [
                {
                    id: 'trip-1',
                    title: 'Paris Adventure',
                    destination: 'Paris, France',
                    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop',
                    startDate: '2026-02-01',
                    endDate: '2026-02-07',
                    status: 'active',
                    onClick: () => router.push('/trip/trip-1')
                },
                {
                    id: 'trip-2',
                    title: 'Tokyo Explorer',
                    destination: 'Tokyo, Japan',
                    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
                    startDate: '2025-12-15',
                    endDate: '2025-12-22',
                    status: 'completed',
                    onClick: () => router.push('/trip/trip-2')
                },
                {
                    id: 'trip-3',
                    title: 'Bali Beach Retreat',
                    destination: 'Bali, Indonesia',
                    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop',
                    status: 'draft',
                    onClick: () => router.push('/planner')
                },
                {
                    id: 'trip-4',
                    title: 'New York City Tour',
                    destination: 'New York, USA',
                    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
                    startDate: '2026-03-10',
                    endDate: '2026-03-17',
                    status: 'active',
                    onClick: () => router.push('/trip/trip-4')
                }
            ];

            setTrips(mockTrips);
        } catch (error) {
            console.error('Failed to fetch trips:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (tripId: string) => {
        if (window.confirm('Are you sure you want to delete this trip?')) {
            // In a real app, call API here
            // await tripService.deleteTrip(tripId);

            // For now, just update local state
            setTrips(currentTrips => currentTrips.filter(t => t.id !== tripId));
        }
    };

    const countTrips = (status: string) => trips.filter(t => t.status === status).length;

    const filteredTrips = trips.filter(trip => {
        if (filter === 'all') return true;
        return trip.status === filter;
    });

    const getFilterCounts = () => ({
        all: trips.length,
        active: trips.filter(t => t.status === 'active').length,
        completed: trips.filter(t => t.status === 'completed').length,
        draft: trips.filter(t => t.status === 'draft').length
    });

    const counts = getFilterCounts();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FFF5E9]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-black/20 border-t-black/80 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-800 font-medium">Loading Odyssey...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFF5E9] font-body">
            <NotificationBanner userId={user.id} />
            <NotificationContainer />

            {/* Navigation */}
            <nav className="sticky top-4 z-50 px-4 sm:px-8 py-4 bg-[#FFF5E9]/10 backdrop-blur-lg border border-white/30 rounded-2xl mx-4 sm:mx-16 my-4 sm:my-8 shadow-lg">
                <div className="flex items-center justify-between">
                    {/* Logo + Text */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/dashboard')}>
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
                        <a onClick={() => router.push('/dashboard')} className="text-black hover:font-bold transition-all cursor-pointer">Home</a>
                        <a onClick={() => router.push('/planner')} className="text-black hover:font-bold transition-all cursor-pointer">Planner</a>
                        <a href="#" className="text-gray-900 font-semibold underline">My Trips</a>
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
                        <button onClick={() => router.push('/profile')} className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors">
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
                        <a onClick={() => router.push('/dashboard')} className="text-black font-medium hover:pl-2 transition-all cursor-pointer">Home</a>
                        <a onClick={() => router.push('/planner')} className="text-black font-medium hover:pl-2 transition-all cursor-pointer">Planner</a>
                        <a href="#" className="text-black font-medium hover:pl-2 transition-all">My Trips</a>
                        <a href="#" className="text-black font-medium hover:pl-2 transition-all">Saved places</a>
                        <a href="#" className="text-black font-medium hover:pl-2 transition-all">Co-Travellers</a>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
                        My Trips ✈️
                    </h1>
                    <p className="text-gray-600">
                        Track your adventures and plan new ones
                    </p>
                </motion.div>

                {/* Filter Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="flex flex-wrap gap-3">
                        <FilterTab
                            label="All Trips"
                            count={counts.all}
                            active={filter === 'all'}
                            onClick={() => setFilter('all')}
                        />
                        <FilterTab
                            label="Active"
                            count={counts.active}
                            active={filter === 'active'}
                            onClick={() => setFilter('active')}
                            color="blue"
                        />
                        <FilterTab
                            label="Completed"
                            count={counts.completed}
                            active={filter === 'completed'}
                            onClick={() => setFilter('completed')}
                            color="green"
                        />
                        <FilterTab
                            label="Drafts"
                            count={counts.draft}
                            active={filter === 'draft'}
                            onClick={() => setFilter('draft')}
                            color="gray"
                        />
                    </div>
                </motion.div>

                {/* Trip Cards Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <TripCardSkeleton key={i} />
                        ))}
                    </div>
                ) : filteredTrips.length > 0 ? (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: {
                                transition: {
                                    staggerChildren: 0.1
                                }
                            }
                        }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredTrips.map((trip, index) => (
                            <motion.div
                                key={trip.id}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                            >
                                <TripCard
                                    {...trip}
                                    userId={user.id}
                                    onDelete={() => handleDelete(trip.id)}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <div className="text-6xl mb-4">🗺️</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            No {filter !== 'all' && filter} trips found
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Start planning your next adventure!
                        </p>
                        <button
                            onClick={() => router.push('/planner')}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                        >
                            Create New Trip
                        </button>
                    </motion.div>
                )}

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    <ActionCard
                        icon="✈️"
                        title="Plan New Trip"
                        description="Start planning your next adventure"
                        onClick={() => router.push('/planner')}
                        color="from-blue-500 to-purple-600"
                    />
                    <ActionCard
                        icon="📊"
                        title="View Analytics"
                        description="See your travel statistics"
                        onClick={() => router.push('/progress-demo')}
                        color="from-green-500 to-teal-600"
                    />
                    <ActionCard
                        icon="🌍"
                        title="Explore Destinations"
                        description="Discover new places to visit"
                        onClick={() => router.push('/destinations')}
                        color="from-orange-500 to-pink-600"
                    />
                </motion.div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-300 py-6 text-center mt-16">
                <p className="text-gray-800 text-sm">
                    ©Odyssey. Made with <span className="text-red-500">❤️</span> by Route6
                </p>
                <p className="text-xs text-gray-500 mt-2">
                    Group 3 Implementation: Progress & Notifications System Active
                </p>
            </footer>
        </div>
    );
}

/**
 * Filter Tab Component
 */
function FilterTab({
    label,
    count,
    active,
    onClick,
    color = 'purple'
}: {
    label: string;
    count: number;
    active: boolean;
    onClick: () => void;
    color?: 'blue' | 'green' | 'gray' | 'purple';
}) {
    const colors = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        gray: 'from-gray-500 to-gray-600',
        purple: 'from-purple-500 to-purple-600'
    };

    return (
        <button
            onClick={onClick}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${active
                ? `bg-gradient-to-r ${colors[color]} text-white shadow-lg`
                : 'bg-white text-gray-700 hover:shadow-md'
                }`}
        >
            {label} ({count})
        </button>
    );
}

/**
 * Action Card Component
 */
function ActionCard({
    icon,
    title,
    description,
    onClick,
    color
}: {
    icon: string;
    title: string;
    description: string;
    onClick: () => void;
    color: string;
}) {
    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`bg-gradient-to-r ${color} p-6 rounded-2xl shadow-lg cursor-pointer text-white`}
        >
            <div className="text-4xl mb-3">{icon}</div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-sm opacity-90">{description}</p>
        </motion.div>
    );
}
