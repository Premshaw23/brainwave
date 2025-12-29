// components/auth/ForgotPasswordModal.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { showError } from '@/lib/toast';

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ open, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSent(false);
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
      showError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };


  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-opacity-40 animate-fadeIn"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm relative animate-slideUp"
        onClick={e => e.stopPropagation()}
        role="document"
      >
        {/* Close button, more visible and accessible */}
        <button
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          onClick={onClose}
          aria-label="Close modal"
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6L14 14M14 6L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">Forgot Password?</h2>
        <form onSubmit={handleReset} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {sent && (
            <Alert variant="default" className="flex items-center gap-2 border-green-300 bg-green-50 text-green-800">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <AlertDescription className="font-medium">Password reset email sent!</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              ref={inputRef}
              autoComplete="email"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Email'}
          </Button>
        </form>
      </div>
      {/* Simple fade/slide animations (add to your global CSS if not present) */}
      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.2s; }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: none; opacity: 1; } }
        .animate-slideUp { animation: slideUp 0.25s cubic-bezier(.4,2,.6,1); }
      `}</style>
    </div>
  );
}
