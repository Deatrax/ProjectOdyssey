"use client";

import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Edit2, Trash2, Loader2 } from 'lucide-react';
import { usePost, deletePost } from '@/hooks/usePosts';
import LikeButton from './LikeButton';
import SaveButton from './SaveButton';
import ShareButton from './ShareButton';
import CommentSection from './CommentSection';
import PostContentViewer from './PostContentViewer';
import EditTripUpdateModal from './EditTripUpdateModal';

interface PostDetailModalProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
  onDeleted?: () => void;
}

export default function PostDetailModal({ postId, isOpen, onClose, onDeleted }: PostDetailModalProps) {
  const { post, loading, error } = usePost(postId);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [editTripModalOpen, setEditTripModalOpen] = useState(false);

  useEffect(() => {
    if (post) {
      setLikesCount(Math.max(0, post.likesCount));
      setCommentsCount(Math.max(0, post.commentsCount));
    }
  }, [post]);

  useEffect(() => {
    // Get current user ID
    const userId = localStorage.getItem('userId');
    if (userId) {
      setCurrentUserId(userId);
    }
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTitle = () => {
    if (!post || !post.content || !post.content.content) return 'Untitled Post';
    
    for (const node of post.content.content) {
      if (node.type === 'heading' && node.content && node.content[0]?.text) {
        return node.content[0].text;
      }
    }
    return post.tripName || 'Untitled Post';
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    const result = await deletePost(postId);
    if (result.success) {
      onClose();
      if (onDeleted) onDeleted();
    } else {
      alert(result.error || 'Failed to delete post');
    }
  };

  const handleEdit = () => {
    if (post?.type === 'auto') {
      setEditTripModalOpen(true);
    } else {
      alert('Edit functionality coming soon for blog posts!');
    }
  };

  if (!isOpen) return null;

  return (
    <>
    {editTripModalOpen && post && post.type === 'auto' && (
      <EditTripUpdateModal
        post={post}
        isOpen={editTripModalOpen}
        onClose={() => setEditTripModalOpen(false)}
        onUpdated={() => {
          setEditTripModalOpen(false);
          // Re-fetch post by closing and reopening would reload; trigger onDeleted-style refresh
          window.location.reload();
        }}
      />
    )}
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 pt-24 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col animate-scaleIn mt-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {post?.authorId.username}'s post
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
            </div>
          ) : error || !post ? (
            <div className="text-center py-20 px-4">
              <div className="text-6xl mb-4">😞</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Post not found</h3>
              <p className="text-gray-600">{error || 'The post you are looking for does not exist.'}</p>
            </div>
          ) : (
            <>
              {/* Post Header */}
              <div className="px-6 py-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#4A9B7F] to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                      {post.authorId.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{post.authorId.username}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                        {post.type === 'auto' && (
                          <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold">
                            ✨ Trip Complete
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions for author */}
                  {currentUserId === post.authorId._id && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={handleEdit}
                        className="p-2 text-gray-600 hover:text-[#4A9B7F] hover:bg-teal-50 rounded-lg transition-colors"
                        title="Edit post"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleDelete}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Trip Name */}
                {post.tripName && (
                  <div className="flex items-center gap-2 text-sm text-gray-700 bg-teal-50 px-3 py-2 rounded-lg inline-flex">
                    <MapPin className="w-4 h-4 text-[#4A9B7F]" />
                    <span className="font-medium">{post.tripName}</span>
                  </div>
                )}
              </div>

              {/* Post Content */}
              <div className="px-6 py-6 border-b border-gray-100">
                <PostContentViewer content={post.content} />
              </div>

              {/* Trip Progress Details (for trip update posts) */}
              {post.type === 'auto' && post.tripProgress && (
                <div className="px-6 py-6 border-b border-gray-100 space-y-5">
                  {/* Completion Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">Trip Completion</h4>
                      <span className="text-sm font-bold text-[#4A9B7F]">{post.tripProgress.completionPercentage || 0}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#4A9B7F] rounded-full transition-all"
                        style={{ width: `${post.tripProgress.completionPercentage || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Locations */}
                  {post.tripProgress.locations && post.tripProgress.locations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#4A9B7F]" />
                        Visited Locations ({post.tripProgress.locations.length})
                      </h4>
                      <div className="space-y-2">
                        {post.tripProgress.locations.map((location: any, index: number) => (
                          <div
                            key={index}
                            className={`flex items-center gap-3 p-3 rounded-xl border ${
                              location.isCurrentLocation
                                ? 'border-[#4A9B7F] bg-teal-50'
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            <MapPin className={`w-4 h-4 flex-shrink-0 ${location.isCurrentLocation ? 'text-[#4A9B7F]' : 'text-gray-400'}`} />
                            <div className="flex-1">
                              <p className={`font-medium ${location.isCurrentLocation ? 'text-[#4A9B7F]' : 'text-gray-900'}`}>{location.name}</p>
                              {location.visitedAt && (
                                <p className="text-xs text-gray-500">{new Date(location.visitedAt).toLocaleDateString()}</p>
                              )}
                            </div>
                            {location.isCurrentLocation && (
                              <span className="text-xs bg-[#4A9B7F] text-white px-2 py-1 rounded-full font-semibold">Current</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Photos */}
                  {post.tripProgress.locations?.some((loc: any) => loc.photos?.length > 0) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Trip Photos</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {post.tripProgress.locations
                          .flatMap((loc: any) => loc.photos || [])
                          .filter(Boolean)
                          .map((photo: string, index: number) => (
                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden">
                              <img
                                src={photo}
                                alt={`Trip photo ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Interaction Bar */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <LikeButton
                      postId={post._id}
                      initialLikesCount={likesCount}
                      onLikeChange={setLikesCount}
                    />
                    <SaveButton postId={post._id} />
                    <ShareButton postId={post._id} postTitle={getTitle()} />
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">{commentsCount}</span>
                    <span className="ml-1">{commentsCount === 1 ? 'comment' : 'comments'}</span>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="px-6 py-6">
                <CommentSection
                  postId={post._id}
                  onCommentCountChange={setCommentsCount}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>

    </>
  );
}

