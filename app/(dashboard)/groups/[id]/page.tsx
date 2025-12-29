// app/(dashboard)/groups/[id]/page.tsx
'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import { ArrowLeft, Copy, Check, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import GroupChat from '@/components/groups/GroupChat';
import MemberList from '@/components/groups/MemberList';

export default function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [group, setGroup] = useState<any>(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const { id } = use(params);
  // Invite modal state
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteActionLoading, setInviteActionLoading] = useState(false);
  const [inviteError, setInviteError] = useState('');

  // Fetch functions hoisted for reuse
  const fetchGroup = async (user: any) => {
    try {
      if (!user) return;
      const token = await user.getIdToken();
      const response = await fetch(`/api/groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setGroup(data.group);
      }
    } catch (error) {
      console.error('Failed to fetch group:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchCurrentUser = async (user: any) => {
    if (!user) return;
    const token = await user.getIdToken();
    const response = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (data.success) {
      setCurrentUser(data.user);
    }
  };
  const fetchInvites = async (user: any) => {
    try {
      if (!user) return;
      const token = await user.getIdToken();
      const response = await fetch('/api/groups/invites', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success && Array.isArray(data.invites)) {
        setPendingInvites(data.invites);
        if (data.invites.length > 0) setInviteModalOpen(true);
      }
    } catch (error) {
      // ignore
    }
  };
  useEffect(() => {
    if (user) {
      fetchGroup(user);
      fetchCurrentUser(user);
      fetchInvites(user);
    }
  }, [id, user]);

  const handleInviteAction = async (inviteId: string, action: 'accept' | 'reject') => {
    setInviteActionLoading(true);
    setInviteError('');
    try {
      if (!user) throw new Error('User not authenticated');
      const token = await user.getIdToken();
      const res = await fetch(`/api/groups/invites/${inviteId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        setPendingInvites((prev) => prev.filter((i) => i._id !== inviteId));
        if (pendingInvites.length <= 1) setInviteModalOpen(false);
        // Refresh group data after accepting
        if (action === 'accept') {
          fetchGroup(user);
        }
      } else {
        setInviteError(data.error || 'Failed to respond to invite');
      }
    } catch (err: any) {
      setInviteError(err.message || 'Failed to respond to invite');
    } finally {
      setInviteActionLoading(false);
    }
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(group.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[40vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500" />
    </div>
  );
  if (!group) return <div className="text-center text-lg text-gray-500 py-12">Group not found</div>;
  if (!currentUser) return <div className="text-center text-lg text-gray-500 py-12">Loading user...</div>;

  return (
    <>
      {/* Invite Modal */}
      <Dialog open={inviteModalOpen && pendingInvites.length > 0} onOpenChange={setInviteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Group Invite</DialogTitle>
          </DialogHeader>
          {pendingInvites.length > 0 && (
            <div className="space-y-4">
              <div>
                <p className="font-medium">You have been invited to join:</p>
                <div className="mt-2 p-3 rounded bg-indigo-50 border border-indigo-100">
                  <span className="font-semibold text-indigo-800">{pendingInvites[0].groupId?.name || 'Study Group'}</span>
                  <br />
                  <span className="text-sm text-gray-700">Invited by: {pendingInvites[0].inviterId?.displayName || pendingInvites[0].inviterId}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleInviteAction(pendingInvites[0]._id, 'accept')}
                  disabled={inviteActionLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Accept
                </Button>
                <Button
                  onClick={() => handleInviteAction(pendingInvites[0]._id, 'reject')}
                  disabled={inviteActionLoading}
                  variant="secondary"
                >
                  Reject
                </Button>
              </div>
              {inviteError && <div className="text-red-500 text-xs">{inviteError}</div>}
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Group Detail Page */}
      <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-6">
        {/* Header - minimal, less visual weight */}
        <div className="flex items-center justify-between px-2 pb-2">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => router.back()} className="text-indigo-700 hover:bg-indigo-100 px-2 py-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-indigo-800 tracking-tight">{group.name}</h1>
              {group.description && (
                <p className="text-gray-600 mt-0.5 text-base">{group.description}</p>
              )}
            </div>
          </div>
          <Button variant="outline" onClick={copyInviteCode} className="border-indigo-100 bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 px-3 py-1">
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Invite: {group.inviteCode}
              </>
            )}
          </Button>
        </div>

        {/* Main Content - chat is visually dominant */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat - visually dominant, no card, no border */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="flex-1 min-h-125 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-indigo-50 rounded-xl bg-white/90 shadow-sm">
              <GroupChat
                key={group.members.map((m: any) => m._id).join(',') + currentUser._id}
                groupId={id}
                currentUserId={currentUser._id}
              />
            </div>
          </div>

          {/* Sidebar - Members list and info, visually lighter */}
          <div className="space-y-4">
            <div className="bg-white/80 rounded-xl p-4 shadow-sm border border-indigo-50">
              <MemberList
                groupId={id}
                members={group.members}
                creatorId={group.creator._id}
              />
            </div>
            <div className="bg-white/70 rounded-xl p-4 border border-indigo-50">
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Created by</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                    {group.creator.displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-indigo-800">
                    {group.creator.displayName}
                  </span>
                </div>
              </div>
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Invite Code</p>
                <Badge className="font-mono text-base bg-indigo-50 text-indigo-700 border-indigo-100">
                  {group.inviteCode}
                </Badge>
              </div>
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Created</p>
                <span className="text-xs">
                  {new Date(group.createdAt).toLocaleDateString()}
                </span>
              </div>
              {/* Leave Group Button (only for members, not creator) */}
              {group.creator._id !== currentUser._id && group.members.some((m: any) => m._id === currentUser._id) && (
                <Button
                  variant="destructive"
                  className="w-full mt-2"
                  onClick={async () => {
                    if (!user) return;
                    const token = await user.getIdToken();
                    const res = await fetch(`/api/groups/${id}/leave`, {
                      method: 'POST',
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    const data = await res.json();
                    if (data.success) {
                      router.push('/groups');
                    } else {
                      alert(data.error || 'Failed to leave group');
                    }
                  }}
                >
                  Leave Group
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}