
// components/dashboard/Navbar.tsx
'use client';


import { useState, useEffect, useRef } from 'react';
import { Bell, Search, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (search.trim().length > 0) {
      handleSearch();
    } else {
      setResults([]);
      setShowDropdown(false);
    }
    setHighlighted(-1);
  }, [search]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    const response = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
    }
  };

  // Real search API: aggregate notes, quizzes, posts
  const handleSearch = async () => {
    setLoading(true);
    const token = localStorage.getItem('authToken');
    try {
      // Fetch notes
      const notesRes = await fetch(`/api/notes?page=1&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const notesData = notesRes.ok ? await notesRes.json() : { notes: [] };
      // Fetch quizzes
      const quizzesRes = await fetch(`/api/quizzes?limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const quizzesData = quizzesRes.ok ? await quizzesRes.json() : { quizzes: [] };
      // Fetch posts
      const postsRes = await fetch(`/api/posts?page=1&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const postsData = postsRes.ok ? await postsRes.json() : { posts: [] };

      // Map and filter results
      const noteResults = (notesData.notes || [])
        .filter((n: any) => n.title?.toLowerCase().includes(search.toLowerCase()))
        .map((n: any) => ({
          type: 'Note',
          title: n.title,
          href: `/notes/${n._id}`,
        }));
      const quizResults = (quizzesData.quizzes || [])
        .filter((q: any) => q.title?.toLowerCase().includes(search.toLowerCase()))
        .map((q: any) => ({
          type: 'Quiz',
          title: q.title,
          href: `/quizzes/${q._id}`,
        }));
      const postResults = (postsData.posts || [])
        .filter((p: any) => p.caption?.toLowerCase().includes(search.toLowerCase()))
        .map((p: any) => ({
          type: 'Post',
          title: p.caption || 'Post',
          href: `/community/${p._id}`,
        }));

      const allResults = [...noteResults, ...quizResults, ...postResults];
      setResults(allResults);
      setShowDropdown(true);
    } catch (err) {
      setResults([]);
      setShowDropdown(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      setHighlighted((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      setHighlighted((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && highlighted >= 0) {
      window.location.href = results[highlighted].href;
      setShowDropdown(false);
    }
  };

  return (
    <div className="flex h-16 py-2 items-center justify-between border-b bg-white px-6">
      {/* Search */}
      <div className="flex-1 max-w-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search notes, quizzes..."
            className="pl-11 pr-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-indigo-400 transition-colors shadow-sm h-11 rounded-xl text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => search && setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            aria-label="Search notes, quizzes"
          />
          {search && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full focus:outline-none"
              onClick={() => { setSearch(''); setShowDropdown(false); inputRef.current?.focus(); }}
              tabIndex={-1}
              aria-label="Clear search"
            >
              {/* <X className="w-5 h-5" /> */}
            </button>
          )}
          {/* Dropdown */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute left-0 mt-2 w-full z-30"
            >
              <Card className="rounded-xl border border-gray-200 shadow-lg bg-white p-0 overflow-hidden animate-fade-in">
                {loading ? (
                  <div className="p-6 flex flex-col items-center justify-center text-gray-500 text-sm">
                    <Search className="w-7 h-7 mb-2 animate-spin" />
                    Searching...
                  </div>
                ) : results.length === 0 ? (
                  <div className="p-6 flex flex-col items-center justify-center text-gray-400 text-sm">
                    <Search className="w-7 h-7 mb-2" />
                    No results found
                  </div>
                ) : (
                  <div>
                    {/* Sectioned results */}
                    {['Note', 'Quiz', 'Post'].map((section) => {
                      const sectionResults = results.filter(r => r.type === section);
                      if (sectionResults.length === 0) return null;
                      return (
                        <div key={section}>
                          <div className="px-4 pt-4 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {section === 'Note' && 'Notes'}
                            {section === 'Quiz' && 'Quizzes'}
                            {section === 'Post' && 'Posts'}
                          </div>
                          <ul className="divide-y divide-gray-100">
                            {sectionResults.map((item, idx) => {
                              // Calculate global index for highlight
                              const globalIdx = results.findIndex(r => r === item);
                              return (
                                <li
                                  key={item.href}
                                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                                    highlighted === globalIdx ? 'bg-indigo-50' : 'hover:bg-gray-50'
                                  }`}
                                  onMouseEnter={() => setHighlighted(globalIdx)}
                                  onMouseDown={() => { window.location.href = item.href; setShowDropdown(false); }}
                                  tabIndex={-1}
                                >
                                  <span className={`inline-flex w-8 h-8 rounded-lg items-center justify-center text-lg font-bold ${
                                    item.type === 'Note'
                                      ? 'bg-green-100 text-green-600'
                                      : item.type === 'Quiz'
                                      ? 'bg-indigo-100 text-indigo-600'
                                      : 'bg-pink-100 text-pink-600'
                                  }`}>
                                    {item.type === 'Note' && <span>📝</span>}
                                    {item.type === 'Quiz' && <span>❓</span>}
                                    {item.type === 'Post' && <span>💬</span>}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 text-sm truncate">{item.title}</div>
                                    <div className="text-xs text-gray-500">{item.type}</div>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 hover:bg-gray-100">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>
              {user?.displayName?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{user?.displayName}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
