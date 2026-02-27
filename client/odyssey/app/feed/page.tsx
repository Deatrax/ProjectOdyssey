"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PenSquare, Loader2 } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';
import { fetchSavedPosts } from '@/hooks/useSavedPosts';
import PostCard from '@/components/PostCard';
import LeftSidebar from '@/components/feed/LeftSidebar';
import RightSidebar from '@/components/feed/RightSidebar';
import PostDetailModal from '@/components/PostDetailModal';

export default function FeedPage() {
  const router = useRouter();
  const { posts, loading, error, hasMore, loadMore } = usePosts(10);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'blog' | 'auto' | 'my-posts' | 'saved'>('blog');
  const [timelineFilter, setTimelineFilter] = useState<string>('all');
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [savedPostsLoading, setSavedPostsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    setIsAuthenticated(!!token);
    setCurrentUserId(userId);
  }, []);

  // Listen for save/unsave events to refresh saved posts list
  useEffect(() => {
    const handleSavedPostsChanged = () => {
      if (activeFilter === 'saved' && isAuthenticated) {
        console.log('[Feed] Refreshing saved posts due to save/unsave action');
        fetchSavedPosts()
          .then(result => {
            if (result.success && result.data) {
              setSavedPosts(result.data);
            }
          })
          .catch(err => console.error('Failed to refresh saved posts:', err));
      }
    };

    window.addEventListener('savedPostsChanged', handleSavedPostsChanged);
    return () => window.removeEventListener('savedPostsChanged', handleSavedPostsChanged);
  }, [activeFilter, isAuthenticated]);

  // Fetch saved posts when filter changes to 'saved'
  useEffect(() => {
    if (activeFilter === 'saved' && isAuthenticated) {
      setSavedPostsLoading(true);
      fetchSavedPosts()
        .then(result => {
          if (result.success && result.data) {
            console.log('[Feed] Fetched saved posts:', result.data.length);
            setSavedPosts(result.data);
          } else {
            console.log('[Feed] No saved posts found');
            setSavedPosts([]);
          }
        })
        .catch(err => {
          console.error('Failed to fetch saved posts:', err);
          setSavedPosts([]);
        })
        .finally(() => {
          setSavedPostsLoading(false);
        });
    } else if (activeFilter !== 'saved') {
      // Clear saved posts when switching away from saved filter
      setSavedPosts([]);
    }
  }, [activeFilter, isAuthenticated]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, loadMore]);

  // Filter posts based on active filters
  const filteredPosts = useMemo(() => {
    // If showing saved posts, use ONLY savedPosts array
    if (activeFilter === 'saved') {
      console.log('[Feed] Filtering - Saved posts mode, count:', savedPosts.length);
      let filtered = [...savedPosts];
      
      // Apply timeline filter to saved posts
      if (timelineFilter !== 'all') {
        const now = new Date();
        filtered = filtered.filter(post => {
          const postDate = new Date(post.createdAt);
          
          switch (timelineFilter) {
            case 'today':
              return postDate.toDateString() === now.toDateString();
            case 'week':
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              return postDate >= weekAgo;
            case 'month':
              return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
            case 'year':
              return postDate.getFullYear() === now.getFullYear();
            default:
              return true;
          }
        });
      }
      
      console.log('[Feed] Filtered saved posts:', filtered.length);
      return filtered;
    }
    
    // Otherwise use regular posts (NOT saved posts)
    console.log('[Feed] Filtering - Regular posts mode, filter:', activeFilter);
    let filtered = [...posts];

    // Filter by post type
    if (activeFilter === 'blog') {
      filtered = filtered.filter(post => post.type === 'blog');
    } else if (activeFilter === 'auto') {
      filtered = filtered.filter(post => post.type === 'auto');
    } else if (activeFilter === 'my-posts' && currentUserId) {
      filtered = filtered.filter(post => post.authorId._id === currentUserId);
    }

    // Filter by timeline
    if (timelineFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(post => {
        const postDate = new Date(post.createdAt);
        
        switch (timelineFilter) {
          case 'today':
            return postDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return postDate >= weekAgo;
          case 'month':
            return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
          case 'year':
            return postDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [posts, savedPosts, activeFilter, timelineFilter, currentUserId]);

  // Get user's posts for stats
  const userPosts = useMemo(() => {
    if (!currentUserId) return [];
    return posts.filter(post => post.authorId._id === currentUserId);
  }, [posts, currentUserId]);

  // Calculate community stats
  const communityStats = useMemo(() => {
    const now = new Date();
    const today = now.toDateString();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Count unique authors who posted today
    const authorsToday = new Set<string>();
    posts.forEach(post => {
      const postDate = new Date(post.createdAt);
      if (postDate.toDateString() === today) {
        authorsToday.add(post.authorId._id);
      }
    });

    // Count posts this week
    const postsThisWeek = posts.filter(post => {
      const postDate = new Date(post.createdAt);
      return postDate >= weekAgo;
    }).length;

    return {
      activeUsersToday: authorsToday.size,
      postsThisWeek
    };
  }, [posts]);

  const handleCreatePost = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    router.push('/feed/create');
  };

  const handleOpenPostModal = (postId: string) => {
    setSelectedPostId(postId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPostId(null);
  };

  const handlePostDeleted = () => {
    // Refresh the posts list or remove the deleted post
    window.location.reload();
  };

  if ((loading || savedPostsLoading) && posts.length === 0 && savedPosts.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF5E9] pt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
          </div>
        </div>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF5E9] pt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-[#4A9B7F] text-white rounded-lg hover:bg-[#3d8268] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5E9] pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Travel Feed</h1>
            <p className="text-gray-600">Explore travel stories from around the world</p>
          </div>
          <button
            onClick={handleCreatePost}
            className="hidden lg:flex items-center gap-2 px-6 py-3 bg-[#4A9B7F] text-white rounded-xl hover:bg-[#3d8268] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <PenSquare className="w-5 h-5" />
            <span className="font-medium">Write Story</span>
          </button>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6">
          {/* Left Sidebar - Hidden on mobile */}
          <aside className="hidden lg:block">
            <LeftSidebar
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              timelineFilter={timelineFilter}
              onTimelineChange={setTimelineFilter}
              savedPostsCount={savedPosts.length}
              activeUsersToday={communityStats.activeUsersToday}
              postsThisWeek={communityStats.postsThisWeek}
            />
          </aside>

          {/* Main Feed */}
          <main className="min-w-0">
            {filteredPosts.length === 0 && !loading && !savedPostsLoading ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">
                  {activeFilter === 'saved' ? '🔖' : '✈️'}
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  {activeFilter === 'saved' 
                    ? 'No saved posts yet'
                    : activeFilter === 'my-posts' 
                    ? 'No posts yet' 
                    : 'No posts found'}
                </h2>
                <p className="text-gray-600 mb-6">
                  {activeFilter === 'saved'
                    ? 'Posts you save will appear here for easy access later!'
                    : activeFilter === 'my-posts' 
                    ? 'Be the first to share your travel story!'
                    : 'Try adjusting your filters'}
                </p>
                {activeFilter === 'my-posts' && (
                  <button
                    onClick={handleCreatePost}
                    className="px-8 py-3 bg-[#4A9B7F] text-white rounded-xl hover:bg-[#3d8268] transition-colors"
                  >
                    Create First Post
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <PostCard 
                    key={post._id} 
                    post={post} 
                    onPostClick={handleOpenPostModal}
                  />
                ))}
              </div>
            )}

            {/* Loading More Indicator */}
            {(loading || savedPostsLoading) && (posts.length > 0 || savedPosts.length > 0) && (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
              </div>
            )}

            {/* Infinite Scroll Trigger - only for non-saved posts */}
            {hasMore && activeFilter !== 'saved' && <div ref={observerTarget} className="h-20" />}

            {/* End of Feed */}
            {!hasMore && filteredPosts.length > 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>You've reached the end of the feed! 🎉</p>
              </div>
            )}
          </main>

          {/* Right Sidebar - Hidden on mobile */}
          <aside className="hidden lg:block">
            <RightSidebar
              userPosts={userPosts}
              allPosts={posts}
              isAuthenticated={isAuthenticated}
              currentUserId={currentUserId || undefined}
            />
          </aside>
        </div>

        {/* Mobile FAB for Create Post */}
        <button
          onClick={handleCreatePost}
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-[#4A9B7F] text-white rounded-full shadow-2xl hover:bg-[#3d8268] transition-all duration-200 flex items-center justify-center z-50"
        >
          <PenSquare className="w-6 h-6" />
        </button>
      </div>

      {/* Post Detail Modal */}
      {selectedPostId && (
        <PostDetailModal
          postId={selectedPostId}
          isOpen={modalOpen}
          onClose={handleCloseModal}
          onDeleted={handlePostDeleted}
        />
      )}
    </div>
  );
}
