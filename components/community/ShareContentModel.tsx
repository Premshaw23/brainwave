// components/community/ShareContentModal.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Share2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert,AlertDescription } from '../ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '../../context/AuthContext';

import React from 'react';
export interface ShareContentModalProps {
  contentType: 'quiz' | 'flashcard' | 'note' | 'screenshot' | 'summary';
  contentId: string;
  contentTitle: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function ShareContentModal({
  contentType,
  contentId,
  contentTitle,
  trigger,
  open,
  onOpenChange,
}: ShareContentModalProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Use controlled modal if open prop is provided, else fallback to internal state
  const modalOpen = typeof open === 'boolean' ? open : internalOpen;
  const setModalOpen = onOpenChange || setInternalOpen;

  const { user } = useAuth();
  const handleShare = async () => {
    setError('');
    setLoading(true);
    try {
      if (!user) throw new Error('Not authenticated');
      const token = await user.getIdToken();
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          contentType,
          contentId,
          caption: caption.trim(),
        }),
      });
      const data = await response.json();
      if (data.success) {
        setModalOpen(false);
        router.push('/community');
      } else {
        setError(data.error || 'Failed to share');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to share');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="rounded-xl bg-linear-to-r from-indigo-100 via-white to-indigo-50 text-indigo-700 font-semibold shadow-md px-6 py-3">
            <Share2 className="w-5 h-5 mr-2" />
            Share to Community
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-2xl bg-linear-to-br from-white via-indigo-50 to-indigo-100 shadow-2xl border border-indigo-100 p-8">
        <DialogHeader>
          <DialogTitle className="text-indigo-700 font-bold text-xl">Share to Community</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {error && (
            <Alert variant="destructive" className="rounded-xl">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="bg-indigo-50 rounded-xl p-4 shadow-sm">
            <p className="text-base font-semibold text-indigo-700 mb-2">
              Sharing: {contentTitle}
            </p>
            <Badge className="capitalize px-3 py-1 text-base font-semibold rounded-xl shadow-sm bg-indigo-100 text-indigo-700 border border-indigo-200 mt-1">
              {contentType}
            </Badge>
          </div>
          <div className="space-y-2">
            <Label htmlFor="caption" className="font-semibold text-indigo-700">Caption (optional)</Label>
            <Textarea
              id="caption"
              placeholder="Add a description or study tip..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              disabled={loading}
              rows={4}
              className="rounded-xl border border-indigo-200 bg-white shadow-sm text-base font-medium focus:ring-2 focus:ring-indigo-300 resize-none"
            />
          </div>
          <div className="flex gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              disabled={loading}
              className="flex-1 rounded-xl bg-white text-indigo-700 font-semibold shadow-sm border border-indigo-200 hover:bg-indigo-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleShare}
              disabled={loading}
              className="flex-1 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sharing...
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
