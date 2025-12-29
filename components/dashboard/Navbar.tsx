
// components/dashboard/Navbar.tsx
'use client';


import { useState, useEffect, useRef } from 'react';
import { Bell, Search, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NotificationBell from '@/components/NotificationBell';
import { useAuth } from '../../context/AuthContext';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const { user: authUser } = useAuth();
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
    if (!authUser) return;
    const token = await authUser.getIdToken();
    const response = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
    }
  };

  // Real search API: aggregate notes, quizzes, posts, flashcards
  const handleSearch = async () => {
    setLoading(true);
    if (!authUser) return;
    const token = await authUser.getIdToken();
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
      // Fetch flashcards
      const flashcardsRes = await fetch(`/api/flashcards?limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const flashcardsData = flashcardsRes.ok ? await flashcardsRes.json() : { flashcards: [] };

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
      const flashcardResults = (flashcardsData.flashcards || [])
        .filter((f: any) => f.title?.toLowerCase().includes(search.toLowerCase()))
        .map((f: any) => ({
          type: 'Flashcard',
          title: f.title,
          href: `/flashcards/${f._id}/study`,
        }));

      const allResults = [...noteResults, ...quizResults, ...flashcardResults, ...postResults];
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
    <div className="flex h-17 py-4 items-center justify-between border-b bg-linear-to-r from-indigo-50 via-white to-indigo-100 px-10 shadow-md">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-indigo-400 pointer-events-none" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search notes, quizzes..."
            className="pl-14 pr-4 bg-white border border-indigo-200 focus:bg-indigo-50 focus:border-indigo-400 transition-colors shadow-lg h-12 rounded-2xl text-lg font-semibold"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => search && setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            aria-label="Search notes, quizzes"
          />
          {search && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-600 p-2 rounded-full focus:outline-none bg-indigo-50 shadow-sm"
              onClick={() => { setSearch(''); setShowDropdown(false); inputRef.current?.focus(); }}
              tabIndex={-1}
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {/* Dropdown */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute left-0 mt-3 w-full z-30"
            >
              <Card className="rounded-2xl border border-indigo-200 shadow-2xl bg-white p-0 overflow-hidden animate-fade-in">
                {loading ? (
                  <div className="p-8 flex flex-col items-center justify-center text-indigo-400 text-base font-semibold">
                    <Search className="w-8 h-8 mb-3 animate-spin" />
                    Searching...
                  </div>
                ) : results.length === 0 ? (
                  <div className="p-8 flex flex-col items-center justify-center text-indigo-300 text-base font-semibold">
                    <Search className="w-8 h-8 mb-3" />
                    No results found
                  </div>
                ) : (
                  <div>
                    {/* Sectioned results */}
                    {['Note', 'Quiz', 'Flashcard', 'Post'].map((section) => {
                      const sectionResults = results.filter(r => r.type === section);
                      if (sectionResults.length === 0) return null;
                      return (
                        <div key={section}>
                          <div className="px-6 pt-6 pb-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                            {section === 'Note' && 'Notes'}
                            {section === 'Quiz' && 'Quizzes'}
                            {section === 'Flashcard' && 'Flashcards'}
                            {section === 'Post' && 'Posts'}
                          </div>
                          <ul className="divide-y divide-indigo-100">
                            {sectionResults.map((item, idx) => {
                              // Calculate global index for highlight
                              const globalIdx = results.findIndex(r => r === item);
                              return (
                                <li
                                  key={item.href}
                                  className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-colors ${
                                    highlighted === globalIdx ? 'bg-indigo-100' : 'hover:bg-indigo-50'
                                  } rounded-xl`}
                                  onMouseEnter={() => setHighlighted(globalIdx)}
                                  onMouseDown={() => { window.location.href = item.href; setShowDropdown(false); }}
                                  tabIndex={-1}
                                >
                                  <span className={`inline-flex w-10 h-10 rounded-xl items-center justify-center text-xl font-bold shadow-sm ${
                                    item.type === 'Note'
                                      ? 'bg-green-100 text-green-600'
                                      : item.type === 'Quiz'
                                      ? 'bg-indigo-200 text-indigo-700'
                                      : item.type === 'Flashcard'
                                      ? 'bg-yellow-100 text-yellow-600'
                                      : 'bg-pink-100 text-pink-600'
                                  }`}>
                                    {item.type === 'Note' && <span>📝</span>}
                                    {item.type === 'Quiz' && <span>❓</span>}
                                    {item.type === 'Flashcard' && <span>📇</span>}
                                    {item.type === 'Post' && <span>💬</span>}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-indigo-700 text-base truncate">{item.title}</div>
                                    <div className="text-xs text-indigo-400 font-semibold">{item.type}</div>
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
      <div className="flex items-center gap-8">
        <NotificationBell />
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12 shadow-md">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-indigo-200 text-indigo-700 font-bold">
              {user?.displayName?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-lg font-bold text-indigo-700">{user?.displayName}</p>
            <p className="text-sm text-indigo-400 font-semibold">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
