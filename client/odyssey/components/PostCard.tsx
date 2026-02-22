"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Calendar, MapPin } from 'lucide-react';
import LikeButton from './LikeButton';
import type { Post } from '@/hooks/usePosts';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const [likesCount, setLikesCount] = useState(post.likesCount);

  // Extract text content from BlockNote JSON
  const extractTextContent = (content: any): string => {
    if (!content || !content.content) return '';
    
    let text = '';
    const traverse = (node: any) => {
      if (node.type === 'text') {
        text += node.text + ' ';
      }
      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(traverse);
      }
    };
    
    content.content.forEach(traverse);
    return text.trim();
  };

  const textContent = extractTextContent(post.content);
  const preview = textContent.slice(0, 200) + (textContent.length > 200 ? '...' : '');
  
  // Get the first heading as title if available
  const getTitle = () => {
    if (!post.content || !post.content.content) return 'Untitled Post';
    
    for (const node of post.content.content) {
      if (node.type === 'heading' && node.content && node.content[0]?.text) {
        return node.content[0].text;
      }
    }
    return post.tripName || 'Untitled Post';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div
      onClick={() => router.push(`/feed/${post._id}`)}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100"
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
            {post.authorId.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{post.authorId.username}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.createdAt)}</span>
              {post.type === 'auto' && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Trip Complete
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{getTitle()}</h2>
        
        {post.tripName && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4" />
            <span>{post.tripName}</span>
          </div>
        )}

        <p className="text-gray-700 leading-relaxed">{preview}</p>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div onClick={(e) => e.stopPropagation()}>
            <LikeButton
              postId={post._id}
              initialLikesCount={likesCount}
              onLikeChange={setLikesCount}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 hover:bg-white/80 transition-all duration-200">
            <MessageCircle className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {post.commentsCount > 0 ? post.commentsCount : ''}
            </span>
          </button>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/feed/${post._id}`);
          }}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Read More →
        </button>
      </div>
    </div>
  );
}
