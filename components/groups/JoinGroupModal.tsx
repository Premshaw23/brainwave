
// components/groups/JoinGroupModal.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Link as LinkIcon } from 'lucide-react';
import AppLoader from '@/components/ui/AppLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { showError } from '@/lib/toast';

export default function JoinGroupModal() {
  const { user } = useAuth();
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
      if (!user) throw new Error('Not authenticated');
      const token = await user.getIdToken();
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
        showError(data.error || 'Failed to join group');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to join group');
      showError(err.message || 'Failed to join group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-xl font-semibold px-6 py-3 shadow-md hover:bg-indigo-50">
          <LinkIcon className="w-5 h-5 mr-2" />
          Join Group
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-linear-to-br from-white via-indigo-50 to-indigo-100 rounded-2xl shadow-2xl border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-indigo-700 tracking-tight">Join Study Group</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {error && (
            <Alert className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-600 font-medium">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-600 font-medium">
                {success}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="inviteCode" className="text-lg font-medium text-gray-800">Invite Code</Label>
            <Input
              id="inviteCode"
              placeholder="e.g., ABC12XYZ"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              required
              disabled={loading}
              className="font-mono text-lg tracking-wider rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              maxLength={8}
            />
            <p className="text-xs text-gray-500">
              Enter the 8-character invite code shared by the group creator
            </p>
          </div>

          <Button type="submit" className="w-full rounded-xl bg-indigo-600 text-white text-lg font-semibold py-3 shadow-lg hover:bg-indigo-700 transition-all duration-150" disabled={loading}>
            {loading ? <AppLoader message="Joining group..." /> : 'Join Group'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}