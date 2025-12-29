// components/dashboard/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Brain, Home, FileText, MessageSquare, Users, BarChart3, Settings, LogOut, CreditCard, Bookmark, User } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';


export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const userId = user ? user.uid : null;

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Notes', href: '/notes', icon: FileText },
    { name: 'Quizzes', href: '/quizzes', icon: Brain },
    { name: 'Flashcards', href: '/flashcards', icon: CreditCard },
    { name: 'Bookmarks', href: '/bookmark', icon: Bookmark },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Study Groups', href: '/groups', icon: Users },
    { name: 'Community', href: '/community', icon: MessageSquare },
    { name: 'Profile', href: userId ? `/profile/${userId}` : '/profile', icon: User },
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r">
      {/* Logo as Home Button */}
      <Link href="/" className="flex h-16 items-center gap-2 border-b px-6 hover:bg-gray-50 transition-colors">
        <div className="bg-linear-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold">BrainWave</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4 space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
