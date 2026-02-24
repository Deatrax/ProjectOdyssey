"use client";

import React, { useMemo } from 'react';
import { Heart, MessageCircle, FileText, MapPin, TrendingUp, PenSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Post } from '@/hooks/usePosts';

interface RightSidebarProps {
  userPosts: Post[];
  allPosts: Post[];
  isAuthenticated: boolean;
  currentUserId?: string;
}

export default function RightSidebar({ userPosts, allPosts, isAuthenticated, currentUserId }: RightSidebarProps) {
  const router = useRouter();

  // Calculate user activity stats
  const userStats = useMemo(() => {
    const totalLikes = userPosts.reduce((sum, post) => sum + (post.likesCount || 0), 0);
    const totalComments = userPosts.reduce((sum, post) => sum + (post.commentsCount || 0), 0);
    
    return {
      totalPosts: userPosts.length,
      totalLikes,
      totalComments,
      thisMonth: userPosts.filter(post => {
        const postDate = new Date(post.createdAt);
        const now = new Date();
        return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
      }).length
    };
  }, [userPosts]);

  // Get popular destinations from posts
  const popularDestinations = useMemo(() => {
    const destinationMap = new Map<string, number>();
    
    allPosts.forEach(post => {
      if (post.tripName) {
        const current = destinationMap.get(post.tripName) || 0;
        destinationMap.set(post.tripName, current + 1);
      }
    });

    return Array.from(destinationMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [allPosts]);

  // Get most liked posts this week
  const popularPosts = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return allPosts
      .filter(post => new Date(post.createdAt) >= oneWeekAgo)
      .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
      .slice(0, 3);
  }, [allPosts]);

  return (
    <div className="sticky top-24 space-y-6">
      {/* User Activity Stats */}
      {isAuthenticated && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Your Activity</h3>
            <PenSquare className="w-5 h-5 text-gray-600" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-[#4A9B7F]" />
                <span className="text-xs text-gray-600">Posts</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{userStats.totalPosts}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-xs text-gray-600">Likes</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{userStats.totalLikes}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <MessageCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-600">Comments</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{userStats.totalComments}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-xs text-gray-600">This Month</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{userStats.thisMonth}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Create Post */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-bold mb-2 text-gray-900">Share Your Journey</h3>
        <p className="text-sm text-gray-600 mb-4">Write about your latest adventure and inspire others!</p>
        <button
          onClick={() => router.push('/feed/create')}
          className="w-full bg-[#4A9B7F] text-white font-semibold py-3 rounded-xl hover:bg-[#3d8268] transition-all duration-200 flex items-center justify-center gap-2"
        >
          <PenSquare className="w-5 h-5" />
          Create Post
        </button>
      </div>

      {/* Popular Destinations */}
      {popularDestinations.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-[#4A9B7F]" />
            <h3 className="text-lg font-bold text-gray-900">Popular Destinations</h3>
          </div>
          <div className="space-y-2">
            {popularDestinations.map((dest, index) => (
              <div
                key={dest.name}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => {
                  // Could add filter by destination functionality
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{dest.name}</p>
                    <p className="text-xs text-gray-500">{dest.count} posts</p>
                  </div>
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Most Liked This Week */}
      {popularPosts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold text-gray-900">Trending This Week</h3>
          </div>
          <div className="space-y-3">
            {popularPosts.map((post) => {
              // Extract title from post
              const getTitle = () => {
                if (!post.content || !post.content.content) return 'Untitled';
                for (const node of post.content.content) {
                  if (node.type === 'heading' && node.content && node.content[0]?.text) {
                    return node.content[0].text;
                  }
                }
                return post.tripName || 'Untitled';
              };

              return (
                <div
                  key={post._id}
                  onClick={() => router.push(`/feed/${post._id}`)}
                  className="p-3 rounded-lg border border-gray-100 hover:border-teal-200 hover:bg-teal-50/30 transition-all cursor-pointer"
                >
                  <p className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">
                    {getTitle()}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-red-500" />
                      {post.likesCount || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {post.commentsCount || 0}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span>@{post.authorId.username}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="bg-gray-50 rounded-2xl shadow-sm p-4 text-xs text-gray-600">
        <div className="flex flex-wrap gap-2 mb-2">
          <a href="#" className="hover:text-[#4A9B7F]">About</a>
          <span>•</span>
          <a href="#" className="hover:text-[#4A9B7F]">Help</a>
          <span>•</span>
          <a href="#" className="hover:text-[#4A9B7F]">Terms</a>
          <span>•</span>
          <a href="#" className="hover:text-[#4A9B7F]">Privacy</a>
        </div>
        <p className="text-gray-500">© 2026 Odyssey Travel</p>
      </div>
    </div>
  );
}
