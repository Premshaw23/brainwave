// app/(auth)/verify/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { MailCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function VerifyEmailPage() {
  const { user, sendVerificationEmail, reloadUser } = useAuth();
  const [sent, setSent] = useState(false);
  const [checking, setChecking] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (user && user.emailVerified) {
      setVerified(true);
      router.replace('/dashboard');
    }
  }, [user, router]);

  const handleResend = async () => {
    setError('');
    setSent(false);
    if (!user) {
      setError('User not found. Please log in again.');
      return;
    }
    try {
      await sendVerificationEmail();
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send verification email');
    }
  };

  const handleCheck = async () => {
    setChecking(true);
    setError('');
    if (!user) {
      setError('User not found. Please log in again.');
      setChecking(false);
      return;
    }
    try {
      await reloadUser();
      if (user.emailVerified) {
        setVerified(true);
        router.replace('/dashboard');
      } else {
        setError('Email not verified yet.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to check verification');
    } finally {
      setChecking(false);
    }
  };

  if (!user) {
    return <div className="p-8 text-center">Please log in to verify your email.</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-lg text-center space-y-7 border border-indigo-100">
      <div className="flex flex-col items-center gap-2">
        <MailCheck className="w-12 h-12 text-indigo-600 mb-2" />
        <h1 className="text-2xl font-bold text-gray-900">Verify Your Email</h1>
      </div>
      <p className="text-gray-700 text-base">
        A verification link has been sent to <span className="font-semibold text-indigo-700 bg-indigo-50 px-1 rounded">{user.email}</span>.<br />
        Please check your inbox and click the link to verify your account.
      </p>
      <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-yellow-800 text-sm">
        <strong>Tip:</strong> If you don't see the email, check your <span className="font-semibold">Spam</span> or <span className="font-semibold">Junk</span> folder.
      </div>
      {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
      {sent && <div className="text-green-600 text-sm font-medium">Verification email sent!</div>}
      <div className="flex flex-col gap-3 mt-2">
        <Button onClick={handleResend} disabled={sent} variant="outline">Resend Verification Email</Button>
        <Button onClick={handleCheck} disabled={checking} className="bg-indigo-600 hover:bg-indigo-700">I've Verified My Email</Button>
      </div>
    </div>
  );
}
