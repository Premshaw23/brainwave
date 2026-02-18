// components/dashboard/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Brain, Home, FileText, MessageSquare, Users, BarChart3, Settings, LogOut, CreditCard, Bookmark, User, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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

  return (
    <>
      <aside
        className={cn(
          "fixed md:sticky top-0 left-0 h-screen w-72 flex flex-col bg-sidebar border-r border-sidebar-border z-50 transition-all duration-300 ease-in-out shadow-2xl md:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-primary shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">BrainWave</span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-sidebar-foreground" />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto custom-scrollbar">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-primary-foreground" : "text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground"
                )} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Actions */}
        <div className="p-4 mt-auto border-t border-sidebar-border space-y-1">
          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all group"
          >
            <Settings className="w-5 h-5 text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground group-hover:rotate-45 transition-transform" />
            Settings
          </Link>
          <button
            onClick={() => { setIsOpen(false); handleLogout(); }}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

