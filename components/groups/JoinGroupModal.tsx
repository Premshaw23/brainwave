
// components/groups/JoinGroupModal.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link as LinkIcon } from 'lucide-react';
import AppLoader from '@/components/ui/AppLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function JoinGroupModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/groups/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ inviteCode: inviteCode.toUpperCase() }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Joined group successfully!');
        setTimeout(() => {
          setOpen(false);
          router.push(`/groups/${data.group._id}`);
        }, 1000);
      } else {
        setError(data.error || 'Failed to join group');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to join group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <LinkIcon className="w-4 h-4 mr-2" />
          Join Group
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Join Study Group</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription className="text-green-600">
                {success}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="inviteCode">Invite Code</Label>
            <Input
              id="inviteCode"
              placeholder="e.g., ABC12XYZ"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              required
              disabled={loading}
              className="font-mono text-lg tracking-wider"
              maxLength={8}
            />
            <p className="text-xs text-gray-500">
              Enter the 8-character invite code shared by the group creator
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <AppLoader message="Joining group..." /> : 'Join Group'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}