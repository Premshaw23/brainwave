// components/dashboard/Sidebar.tsx
'use client';


import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Brain, Home, FileText, MessageSquare, Users, BarChart3, Settings, LogOut, CreditCard, Bookmark, User, Menu } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';



export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (open: boolean) => void }) {
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

  // Responsive sidebar: show/hide for mobile
  return (
    <>
      {/* ...no hamburger here, handled by Navbar... */}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 flex flex-col bg-linear-to-br from-white via-indigo-50 to-indigo-100 border-r border-indigo-100 shadow-2xl rounded-r-2xl z-40 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        style={{ backdropFilter: isOpen ? 'blur(0px)' : undefined }}
      >
        {/* Sidebar Header for mobile: close + logo */}
        {/* 'bg-linear-to-r' is not a standard Tailwind class. If you want a linear gradient, use 'bg-gradient-to-r'.
          Keeping this for debugging. If the background is not as expected, replace 'bg-linear-to-r' with 'bg-gradient-to-r'. */}
        <div className="flex items-center h-16 border-b border-indigo-100 px-4 bg-linear-to-r from-indigo-500 to-purple-500 rounded-br-2xl">
          {isOpen && (
            <button
              className="md:hidden mr-2 p-2 rounded-full bg-white text-indigo-500 shadow-lg border border-indigo-200 focus:outline-none"
              onClick={() => setIsOpen(false)}
              aria-label="Close sidebar"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
          <Link href="/" className="flex items-center gap-3 hover:scale-[1.02] transition-all duration-200">
            {/* <div className="p-2 rounded-xl bg-white shadow-md">
              <Image
                src="/logo.png"
                alt="BrainWave Logo"
                width={30}
                height={30}
                className="object-contain drop-shadow-md"
              />
            </div> */}
            <span className="text-2xl font-extrabold text-white tracking-wide">BrainWave</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-5 py-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 rounded-xl px-5 py-3 text-base font-semibold transition-all duration-150 shadow-sm
                  ${isActive ? 'bg-indigo-100 text-indigo-700 scale-[1.03]' : 'text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700'}
                  md:text-base md:py-3 md:px-5 text-sm py-2 px-3`}
                onClick={() => setIsOpen(false)}
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
            className="flex items-center gap-4 rounded-xl px-5 text-base font-semibold text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 shadow-sm md:text-base py-2"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="w-6 h-6" />
            Settings
          </Link>
          <button
            onClick={() => { setIsOpen(false); handleLogout(); }}
            className="flex w-full items-center gap-4 rounded-xl px-5 text-base font-semibold text-red-600 hover:bg-red-50 shadow-sm md:text-base py-2"
          >
            <LogOut className="w-6 h-6" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden backdrop-blur-md bg-opacity-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
