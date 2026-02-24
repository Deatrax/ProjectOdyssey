"use client";

import React from 'react';
import { Home, TrendingUp, Bookmark, User, Settings, Calendar } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface LeftSidebarProps {
  activeFilter: 'all' | 'blog' | 'auto' | 'my-posts';
  onFilterChange: (filter: 'all' | 'blog' | 'auto' | 'my-posts') => void;
  timelineFilter: string;
  onTimelineChange: (timeline: string) => void;
  savedPostsCount?: number;
}

export default function LeftSidebar({
  activeFilter,
  onFilterChange,
  timelineFilter,
  onTimelineChange,
  savedPostsCount = 0
}: LeftSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navigationItems = [
    { icon: Home, label: 'Home Feed', path: '/feed', badge: null },
    { icon: TrendingUp, label: 'Trending', path: '/feed?filter=trending', badge: null },
    { icon: Bookmark, label: 'Saved Posts', path: '/feed?filter=saved', badge: savedPostsCount > 0 ? savedPostsCount : null },
    { icon: User, label: 'My Profile', path: '/profile', badge: null },
    { icon: Settings, label: 'Settings', path: '/profile?tab=settings', badge: null },
  ];

  return (
    <div className="sticky top-24 space-y-6">
      {/* Navigation Menu */}
      <div className="bg-white rounded-2xl shadow-md p-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">
          Navigation
        </h3>
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Post Type Filter */}
      <div className="bg-white rounded-2xl shadow-md p-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">
          Post Type
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => onFilterChange('all')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
              activeFilter === 'all'
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Posts
          </button>
          <button
            onClick={() => onFilterChange('blog')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
              activeFilter === 'blog'
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            ✍️ Blog Stories
          </button>
          <button
            onClick={() => onFilterChange('auto')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
              activeFilter === 'auto'
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            🚀 Trip Completed
          </button>
          <button
            onClick={() => onFilterChange('my-posts')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
              activeFilter === 'my-posts'
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            👤 My Posts
          </button>
        </div>
      </div>

      {/* Timeline Filter */}
      <div className="bg-white rounded-2xl shadow-md p-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Timeline
        </h3>
        <select
          value={timelineFilter}
          onChange={(e) => onTimelineChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
        <h3 className="text-sm font-semibold uppercase tracking-wide mb-2 text-gray-900">
          Community
        </h3>
        <div className="space-y-1 text-sm">
          <p className="flex items-center justify-between text-gray-700">
            <span>Active Today</span>
            <span className="font-bold text-blue-600">2.4K</span>
          </p>
          <p className="flex items-center justify-between text-gray-700">
            <span>Posts This Week</span>
            <span className="font-bold text-blue-600">8.1K</span>
          </p>
        </div>
      </div>
    </div>
  );
}
