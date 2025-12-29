
// components/groups/CreateGroupModal.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Users, Lock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CreateGroupModal() {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!user) throw new Error('Not authenticated');
      const token = await user.getIdToken();
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, isPrivate }),
      });

      const data = await response.json();

      if (data.success) {
        setOpen(false);
        router.push(`/groups/${data.group._id}`);
      } else {
        setError(data.error || 'Failed to create group');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition-all duration-150 px-6 py-3">
          <Users className="w-5 h-5 mr-2" />
          Create Group
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-linear-to-br from-white via-indigo-50 to-indigo-100 rounded-2xl shadow-2xl border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-indigo-700 tracking-tight">Create Study Group</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {error && (
            <Alert className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-600 font-medium">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-lg font-medium text-gray-800">Group Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Calculus Study Group"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              className="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-lg font-medium text-gray-800">Description</Label>
            <Textarea
              id="description"
              placeholder="What will this group study?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={3}
              className="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-lg font-medium text-gray-800">Privacy</Label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsPrivate(true)}
                className={`flex-1 p-4 rounded-xl border-2 text-base font-semibold transition-colors shadow-sm ${
                  isPrivate
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Lock className="w-6 h-6 mx-auto mb-1 text-indigo-600" />
                <p className="text-base font-medium">Private</p>
                <p className="text-xs text-gray-500">Invite only</p>
              </button>
              <button
                type="button"
                onClick={() => setIsPrivate(false)}
                className={`flex-1 p-4 rounded-xl border-2 text-base font-semibold transition-colors shadow-sm ${
                  !isPrivate
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Globe className="w-6 h-6 mx-auto mb-1 text-indigo-600" />
                <p className="text-base font-medium">Public</p>
                <p className="text-xs text-gray-500">Anyone can join</p>
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full rounded-xl bg-indigo-600 text-white text-lg font-semibold py-3 shadow-lg hover:bg-indigo-700 transition-all duration-150" disabled={loading}>
            {loading ? 'Creating...' : 'Create Group'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}