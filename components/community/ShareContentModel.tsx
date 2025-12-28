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
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share to Community
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share to Community</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-900 mb-1">
              Sharing: {contentTitle}
            </p>
            <Badge className="capitalize">{contentType}</Badge>
          </div>
          <div className="space-y-2">
            <Label htmlFor="caption">Caption (optional)</Label>
            <Textarea
              id="caption"
              placeholder="Add a description or study tip..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              disabled={loading}
              rows={4}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleShare}
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sharing...
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 mr-2" />
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
