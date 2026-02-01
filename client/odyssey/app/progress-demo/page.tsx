// client/odyssey/app/progress-demo/page.tsx
// Group 3 Feature Demo Page

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressBar, { LinearProgressBar } from '@/components/ProgressBar';
import TripSummary from '@/components/TripSummary';
import NotificationBanner, { NotificationContainer } from '@/components/NotificationBanner';
import ProgressDashboard from '@/components/ProgressDashboard';
import notificationService from '@/services/notificationService';

export default function ProgressDemoPage() {
    const [userId, setUserId] = useState('demo-user-123');
    const [itineraryId, setItineraryId] = useState('demo-itinerary-456');
    const [activeTab, setActiveTab] = useState<'visuals' | 'notifications' | 'dashboard' | 'api'>('visuals');

    const handleTestNotification = (type: 'arrival' | 'departure' | 'progress' | 'completion') => {
        const placeName = "Eiffel Tower";

        switch (type) {
            case 'arrival':
                notificationService.templates.arrival(placeName, itineraryId, 'place-1');
                (window as any).showNotification?.({
                    title: '📍 Arrived at Destination',
                    body: `You have arrived at ${placeName}. Don't forget to check in!`,
                    type: 'arrival'
                });
                break;
            case 'departure':
                notificationService.templates.departure(placeName, itineraryId, 'place-1');
                (window as any).showNotification?.({
                    title: '👋 Departure',
                    body: `You have left ${placeName}. Heading to your next stop!`,
                    type: 'departure'
                });
                break;
            case 'progress':
                notificationService.templates.progress(60, 3, 5);
                (window as any).showNotification?.({
                    title: '📊 Trip Progress Update',
                    body: `You're 60% through your trip! 3 out of 5 places visited.`,
                    type: 'progress'
                });
                break;
            case 'completion':
                notificationService.templates.completion('Paris Adventure');
                (window as any).showNotification?.({
                    title: '🎊 Trip Completed!',
                    body: `Congratulations! You've completed your 'Paris Adventure' trip.`,
                    type: 'completion'
                });
                break;
        }
    };

    const mockSummary = {
        itinerary: {
            id: itineraryId,
            name: 'Paris Adventure',
            destination: 'Paris, France',
            created_at: new Date().toISOString()
        },
        progress: {
            total_places: 5,
            completed_places: 5,
            completion_percentage: 100
        },
        enriched: {
            total_time_formatted: '15h 30m',
            total_distance_formatted: '42.5 km',
            trip_duration_formatted: '4 days',
            average_time_formatted: '2h 15m',
            favorite_place: {
                name: 'Eiffel Tower',
                rating: 5,
                time_spent: '3h 45m'
            },
            completion_date: new Date().toISOString()
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            {/* Nav & Banner Area */}
            <NotificationBanner userId={userId} />
            <NotificationContainer />

            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span>🚀</span> Group 3 Features Demo
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Progress Tracking & Notifications System</p>
                    </div>
                    <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl overflow-x-auto no-scrollbar">
                        <TabButton active={activeTab === 'visuals'} onClick={() => setActiveTab('visuals')} label="Visuals" />
                        <TabButton active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} label="Notifications" />
                        <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} label="Dashboard" />
                        <TabButton active={activeTab === 'api'} onClick={() => setActiveTab('api')} label="API" />
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 mt-8">
                {activeTab === 'visuals' && (
                    <div className="space-y-8">
                        <Section title="Progress Indicators" subtitle="Circular and Linear components for various UI contexts">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center">
                                    <h4 className="text-sm font-semibold text-gray-500 mb-6">Circular Variant</h4>
                                    <ProgressBar completed={3} total={5} size="lg" animated={true} />
                                    <div className="mt-8 grid grid-cols-3 gap-4 w-full text-center">
                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                                            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase">Small</p>
                                            <div className="mt-2 flex justify-center"><ProgressBar completed={1} total={4} size="sm" showLabel={false} /></div>
                                        </div>
                                        <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                                            <p className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase">Medium</p>
                                            <div className="mt-2 flex justify-center"><ProgressBar completed={2} total={4} size="md" /></div>
                                        </div>
                                        <div className="p-3 bg-pink-50 dark:bg-pink-900/30 rounded-xl">
                                            <p className="text-xs text-pink-600 dark:text-pink-400 font-bold uppercase">Static</p>
                                            <div className="mt-2 flex justify-center"><ProgressBar completed={4} total={4} size="sm" animated={false} /></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <h4 className="text-sm font-semibold text-gray-500 mb-6">Linear Variant</h4>
                                    <div className="space-y-8">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Standard Bar</p>
                                            <LinearProgressBar completed={65} total={100} height="h-3" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Thick Bar (No Label)</p>
                                            <LinearProgressBar completed={3} total={10} height="h-6" showLabel={false} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Animated Segmented</p>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <div key={i} className={`h-2 flex-1 rounded-full ${i <= 3 ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Section>

                        <Section title="Trip Summary (Post-Trip)" subtitle="A celebratory UI shown when 100% complete">
                            <div className="bg-white dark:bg-gray-800 p-2 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                                <TripSummary summary={mockSummary} showConfetti={false} onShare={() => alert('Sharing...')} onExport={() => alert('Exporting...')} />
                            </div>
                        </Section>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <Section title="Notification System" subtitle="Test browser-level and in-app notifications">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Trigger Events</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <TestButton icon="📍" label="Arrival" sub="Near place" onClick={() => handleTestNotification('arrival')} color="green" />
                                    <TestButton icon="👋" label="Departure" sub="Left place" onClick={() => handleTestNotification('departure')} color="blue" />
                                    <TestButton icon="📊" label="Progress" sub="Milestone" onClick={() => handleTestNotification('progress')} color="orange" />
                                    <TestButton icon="🎊" label="Complete" sub="End of trip" onClick={() => handleTestNotification('completion')} color="purple" />
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Service Status</h4>
                                <p className="text-sm text-gray-500 mb-6">Real-time status of the notification engine</p>
                                <div className="space-y-4">
                                    <StatusRow label="Browser Permission" value={typeof window !== 'undefined' ? (window as any).Notification?.permission : 'N/A'} active={typeof window !== 'undefined' && (window as any).Notification?.permission === 'granted'} />
                                    <StatusRow label="Push Service" value="Connected" active={true} />
                                    <StatusRow label="User Preferences" value="Arrival: On, Dev: On" active={true} />
                                </div>
                            </div>
                        </div>
                    </Section>
                )}

                {activeTab === 'dashboard' && (
                    <Section title="Complete Dashboard" subtitle="The production-ready integrated view">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <ProgressDashboard itineraryId={itineraryId} userId={userId} showSummary={true} />
                            </div>
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <h4 className="font-bold mb-4">Compact View</h4>
                                    <ProgressDashboard itineraryId={itineraryId} userId={userId} compact={true} />
                                </div>
                                <div className="bg-blue-600 p-6 rounded-2xl shadow-lg text-white">
                                    <h4 className="font-bold mb-2">Pro Tip 💡</h4>
                                    <p className="text-sm opacity-90 leading-relaxed">The Progress Dashboard automatically refreshes every 30 seconds to keep you updated on your journey without needing a page reload.</p>
                                </div>
                            </div>
                        </div>
                    </Section>
                )}

                {activeTab === 'api' && (
                    <Section title="API Reference" subtitle="Endpoints serving Group 3 features">
                        <div className="bg-gray-900 rounded-2xl p-6 text-blue-300 font-mono text-sm overflow-x-auto">
                            <p className="mb-4 text-gray-500 font-sans italic">// Progress API (Port 4000)</p>
                            <div className="space-y-2">
                                <ApiRow method="GET" path={`/api/progress/${itineraryId}`} desc="Get real-time trip stats (%, visits, time)" />
                                <ApiRow method="GET" path={`/api/progress/summary/${itineraryId}`} desc="Get full trip retrospective & highlights" />
                                <ApiRow method="POST" path={`/api/progress/notify`} desc="Log & trigger a notification" />
                                <ApiRow method="GET" path={`/api/progress/notifications/preferences/${userId}`} desc="Fetch user alert settings" />
                            </div>
                        </div>
                    </Section>
                )}
            </div>
        </div>
    );
}

// Internal Helper Components
function TabButton({ active, onClick, label }: any) {
    return (
        <button onClick={onClick} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${active ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>
            {label}
        </button>
    );
}

function Section({ title, subtitle, children }: any) {
    return (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{subtitle}</p>
            {children}
        </motion.section>
    );
}

function TestButton({ icon, label, sub, onClick, color }: any) {
    const colors = {
        green: 'hover:bg-green-50 border-green-100 text-green-700',
        blue: 'hover:bg-blue-50 border-blue-100 text-blue-700',
        orange: 'hover:bg-orange-50 border-orange-100 text-orange-700',
        purple: 'hover:bg-purple-50 border-purple-100 text-purple-700'
    };
    return (
        <button onClick={onClick} className={`p-4 border text-left rounded-2xl transition-all active:scale-95 flex flex-col items-center justify-center gap-2 ${colors[color as keyof typeof colors]}`}>
            <span className="text-3xl">{icon}</span>
            <div className="text-center">
                <p className="font-bold text-sm">{label}</p>
                <p className="text-[10px] opacity-70 uppercase tracking-tighter">{sub}</p>
            </div>
        </button>
    );
}

function StatusRow({ label, value, active }: any) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-700 last:border-0">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{label}</span>
            <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${active ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{value}</span>
            </div>
        </div>
    );
}

function ApiRow({ method, path, desc }: any) {
    const methodColors = { GET: 'text-green-400', POST: 'text-yellow-400', PUT: 'text-blue-400' };
    return (
        <div className="flex items-baseline gap-4 py-1">
            <span className={`w-12 font-bold ${methodColors[method as keyof typeof methodColors]}`}>{method}</span>
            <span className="text-white flex-1">{path}</span>
            <span className="text-gray-500 text-xs hidden md:inline">{desc}</span>
        </div>
    );
}
