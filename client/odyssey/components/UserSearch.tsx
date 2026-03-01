'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, Lock } from 'lucide-react';
import type { UserSearchResult } from '@/lib/types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

interface Props {
  token?: string;
}

export default function UserSearch({ token }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    // Debounce — wait 350ms after user stops typing
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const headers: HeadersInit = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(
          `${BASE}/api/users/search?q=${encodeURIComponent(query)}&limit=8`,
          { headers }
        );
        const json = await res.json();
        setResults(json.data ?? []);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
  }, [query, token]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserClick = (userId: string) => {
    setShowResults(false);
    setQuery('');
    router.push(`/profile/${userId}`);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query && setShowResults(true)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A9B7F] focus:border-transparent"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
        )}
      </div>

      {showResults && results.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-96 overflow-y-auto">
          {results.map(user => (
            <li
              key={user._id}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleUserClick(user._id)}
            >
              <img
                src={user.profileImage}
                alt={user.displayName}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm truncate">{user.displayName}</p>
                  {user.isPrivate && (
                    <Lock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-gray-500">@{user.username}</p>
                {!user.isPrivate && user.bio && (
                  <p className="text-xs text-gray-600 truncate mt-0.5">{user.bio}</p>
                )}
              </div>
              {!user.isPrivate && (
                <div className="flex flex-col items-end text-xs text-gray-500">
                  {user.level && <span className="text-[#4A9B7F] font-semibold">Lvl {user.level}</span>}
                  {user.xp !== undefined && <span>{user.xp} XP</span>}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {showResults && results.length === 0 && query && !loading && (
        <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 p-4 text-center text-sm text-gray-500">
          No users found for "{query}"
        </div>
      )}
    </div>
  );
}
