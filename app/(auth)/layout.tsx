// app/(auth)/layout.tsx
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-indigo-400 relative">
      <Link
        href="/"
        className="absolute top-8 left-5 flex items-center gap-2 px-5 py-1.5 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-50 font-medium shadow-sm z-20"
        aria-label="Go to Home"
      >
        <ArrowLeft className="w-4 h-4" />
        Home
      </Link>
      <div>{children}</div>
    </div>
  );
}