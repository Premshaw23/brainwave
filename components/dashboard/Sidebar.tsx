// components/dashboard/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Brain, Home, FileText, MessageSquare, Users, BarChart3, Settings, LogOut, CreditCard, Bookmark, User } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


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
    <div className="flex h-full w-68 flex-col bg-linear-to-br from-white via-indigo-50 to-indigo-100 border-r border-indigo-100 shadow-2xl rounded-r-2xl">
      {/* Logo as Home Button */}
      <Link href="/" className="flex h-16 items-center gap-3 border-b border-indigo-100 px-8 bg-linear-to-r from-indigo-500 to-purple-500 hover:scale-[1.02] transition-all duration-200 rounded-br-2xl">
        <div className="p-2 rounded-xl bg-white shadow-md">
          <Image
            src="/logo.png"
            alt="BrainWave Logo"
            width={30}
            height={30}
            className="object-contain drop-shadow-md"
          />
        </div>
        <span className="text-2xl font-extrabold text-white tracking-wide">BrainWave</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-5 py-6">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 rounded-xl px-5 py-3 text-base font-semibold transition-all duration-150 shadow-sm ${
                isActive
                  ? 'bg-indigo-100 text-indigo-700 scale-[1.03]'
                  : 'text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700'
              }`}
            >
              <Icon className="w-6 h-6" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-indigo-100 p-6 space-y-3 bg-white rounded-b-2xl shadow-md">
        <Link
          href="/settings"
          className="flex items-center gap-4 rounded-xl px-5 py-3 text-base font-semibold text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 shadow-sm"
        >
          <Settings className="w-6 h-6" />
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-4 rounded-xl px-5 py-3 text-base font-semibold text-red-600 hover:bg-red-50 shadow-sm"
        >
          <LogOut className="w-6 h-6" />
          Logout
        </button>
      </div>
    </div>
  );
}
