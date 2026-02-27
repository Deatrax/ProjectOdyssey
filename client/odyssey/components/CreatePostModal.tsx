"use client";

import React, { useState } from 'react';
import { X, PenSquare, Lightbulb, Target, Users, Save, Loader2, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import PostEditor from './PostEditor';
import { createPost } from '@/hooks/usePosts';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

export default function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
  const [content, setContent] = useState<any>(null);
  const [tripName, setTripName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // Close on Escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isSubmitting, onClose]);

  // Reset form when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setContent(null);
      setTripName('');
      setShowInstructions(true);
    }
  }, [isOpen]);

  const handleContentChange = (newContent: any) => {
    setContent(newContent);
  };

  const handleSubmit = async () => {
    if (!content) {
      alert('Please write something before publishing!');
      return;
    }

    // Validate content has some text
    let hasText = false;
    if (content.content && Array.isArray(content.content)) {
      for (const block of content.content) {
        if (block.content && Array.isArray(block.content)) {
          for (const node of block.content) {
            if (node.type === 'text' && node.text?.trim()) {
              hasText = true;
              break;
            }
          }
        }
        if (hasText) break;
      }
    }

    if (!hasText) {
      alert('Please write some content before publishing!');
      return;
    }

    setIsSubmitting(true);

    const result = await createPost({
      type: 'blog',
      content,
      tripName: tripName.trim() || undefined,
    });

    if (result.success) {
      alert('Post published successfully! 🎉');
      onClose();
      if (onPostCreated) {
        onPostCreated();
      }
      // Refresh the page to show new post
      window.location.reload();
    } else {
      alert(result.error || 'Failed to create post');
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    const draft = {
      content,
      tripName,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('postDraft', JSON.stringify(draft));
    alert('Draft saved! ✓');
  };

  // Load draft if exists on mount
  React.useEffect(() => {
    if (!isOpen) return;

    const savedDraft = localStorage.getItem('postDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        if (confirm('You have a saved draft. Would you like to continue editing it?')) {
          setContent(draft.content);
          setTripName(draft.tripName || '');
        }
      } catch (e) {
        console.error('Error loading draft:', e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 pt-20 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={isSubmitting ? undefined : onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[85vh] overflow-hidden animate-scaleIn flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4A9B7F] to-teal-600 px-6 py-4 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <PenSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Create Your Travel Story</h2>
              <p className="text-teal-50 text-sm">Share your journey with the community</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 p-6">
            {/* Left Side - Instructions */}
            <div className="space-y-4">
              {/* Collapsible Instructions */}
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl border border-teal-200 overflow-hidden">
                <button
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/50 transition-colors"
                >
                  <h3 className="font-bold text-gray-900">✨ Writing Tips</h3>
                  {showInstructions ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                
                {showInstructions && (
                  <div className="px-4 pb-4 space-y-3">
                    <div className="flex items-start gap-2 p-3 bg-white rounded-lg border border-teal-100">
                      <Target className="w-5 h-5 text-[#4A9B7F] flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900">Be Specific</h4>
                        <p className="text-xs text-gray-600 mt-1">Share detailed experiences and personal insights</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-white rounded-lg border border-purple-100">
                      <Lightbulb className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900">Add Tips</h4>
                        <p className="text-xs text-gray-600 mt-1">Include recommendations for travelers</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-white rounded-lg border border-orange-100">
                      <Users className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900">Engage</h4>
                        <p className="text-xs text-gray-600 mt-1">Use vivid descriptions and storytelling</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Tips */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h4 className="font-bold text-sm text-gray-900 mb-2">📝 Formatting</h4>
                <ul className="space-y-1.5 text-xs text-gray-700">
                  <li>• <strong>Heading 1</strong> for title</li>
                  <li>• <strong>Heading 2-3</strong> for sections</li>
                  <li>• Use <strong>lists</strong> for tips</li>
                  <li>• Aim for <strong>200+ words</strong></li>
                </ul>
              </div>
            </div>

            {/* Right Side - Editor */}
            <div className="space-y-4">
              {/* Trip Name Input */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 text-[#4A9B7F]" />
                  Trip Name <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  placeholder="e.g., Summer Adventure in Bali"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9B7F] focus:border-transparent"
                  maxLength={100}
                  disabled={isSubmitting}
                />
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {tripName.length}/100
                </div>
              </div>

              {/* Editor */}
              <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden min-h-[400px]">
                <PostEditor
                  onChange={handleContentChange}
                  editable={!isSubmitting}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="text-sm text-gray-600">
            <span className="hidden sm:inline">Remember to save your draft regularly! 💾</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveDraft}
              disabled={isSubmitting || !content}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save Draft</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !content}
              className="flex items-center gap-2 px-6 py-2 bg-[#4A9B7F] text-white rounded-lg hover:bg-[#3d8268] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <span>Publish Story ✨</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
