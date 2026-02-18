// components/dashboard/Navbar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Search, X, Menu, Settings, User, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import NotificationBell from '@/components/NotificationBell';
import { useAuth } from '../../context/AuthContext';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
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
  }, [authUser]);

  const fetchUser = async () => {
    if (!authUser) return;
    try {
      const token = await authUser.getIdToken();
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (e) {
      console.error("Failed to fetch user profile:", e);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);
    if (!authUser) return;
    try {
      const token = await authUser.getIdToken();
      // Simulating a more efficient search or just re-using the logic
      // In a real app, this should be a single search endpoint
      const res = await fetch(`/api/search?q=${encodeURIComponent(search)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch (err) {
      setResults([]);
    } finally {
      setLoading(false);
      setShowDropdown(true);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim()) handleSearch();
      else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <header className="h-20 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center px-6 lg:px-8 z-40 sticky top-0">
      <div className="flex-1 flex items-center gap-4 sm:gap-8">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors"
        >
          <Menu className="w-6 h-6 text-foreground" />
        </button>

        <div className="flex-1 max-w-2xl relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <Input
            ref={inputRef}
            placeholder="Search your neural network..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-12 bg-secondary/30 border-transparent hover:border-border/50 focus:border-primary/30 focus:bg-background rounded-2xl transition-all shadow-none"
          />

          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Search Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-3 p-2 bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
              {loading ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Indexing Knowledge...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="max-h-[60vh] overflow-y-auto space-y-1 p-1">
                  {results.map((item, i) => (
                    <button
                      key={i}
                      className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-secondary transition-all text-left group"
                      onClick={() => { window.location.href = item.href; setShowDropdown(false); }}
                    >
                      <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center border border-border/50 group-hover:border-primary/30 transition-colors">
                        <p className="text-lg">{(item.type === 'Note' && '📝') || (item.type === 'Quiz' && '❓') || '🧠'}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-foreground line-clamp-1">{item.title}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">{item.type} • Cognitive Link</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No matches in your synthesis</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6 pl-6">
        <NotificationBell />

        <div className="h-8 w-px bg-border/50 hidden sm:block" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-foreground tracking-tight leading-none mb-1">
              {user?.displayName || 'Active User'}
            </p>
            <div className="flex items-center justify-end gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <p className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest">Neural Sync Active</p>
            </div>
          </div>

          <Avatar className="w-11 h-11 border-2 border-primary/20 rounded-full group cursor-pointer hover:border-primary/50 transition-all shadow-xl ring-offset-background ring-2 ring-transparent group-hover:ring-primary/10 overflow-hidden">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user?.displayName || "User avatar"}
                width={44}
                height={44}
                className="rounded-full object-cover w-full h-full transform transition-transform img-optimize"
                priority
              />
            ) : (
              <AvatarFallback className="bg-primary text-white font-black uppercase text-xs">
                {user?.displayName?.charAt(0) || 'U'}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </div>
    </header>
  );
}
