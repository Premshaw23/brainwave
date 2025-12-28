// app/(dashboard)/groups/[id]/page.tsx
'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
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
  const fetchGroup = async () => {
    try {
      const token = localStorage.getItem('authToken');
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
  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (data.success) {
      setCurrentUser(data.user);
    }
  };
  const fetchInvites = async () => {
    try {
      const token = localStorage.getItem('authToken');
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
    fetchGroup();
    fetchCurrentUser();
    fetchInvites();
  }, [id]);

  const handleInviteAction = async (inviteId: string, action: 'accept' | 'reject') => {
    setInviteActionLoading(true);
    setInviteError('');
    try {
      const token = localStorage.getItem('authToken');
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
          fetchGroup();
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

  if (loading) return <div>Loading...</div>;
  if (!group) return <div>Group not found</div>;
  if (!currentUser) return <div>Loading user...</div>;

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
                <div className="mt-2 p-3 rounded bg-gray-100">
                  <span className="font-semibold">{pendingInvites[0].groupId?.name || 'Study Group'}</span>
                  <br />
                  Invited by: {pendingInvites[0].inviterId?.displayName || pendingInvites[0].inviterId}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleInviteAction(pendingInvites[0]._id, 'accept')}
                  disabled={inviteActionLoading}
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
      {/* ...existing group detail page... */}
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
            {group.description && (
              <p className="text-gray-600 mt-1">{group.description}</p>
            )}
          </div>
        </div>

        <Button variant="outline" onClick={copyInviteCode}>
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <Card className="h-150">
            <CardHeader>
              <CardTitle>Group Chat</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)]">
              {/* Force remount of GroupChat when membership changes by using a key */}
              <GroupChat
                key={group.members.map((m: any) => m._id).join(',') + currentUser._id}
                groupId={id}
                currentUserId={currentUser._id}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Members list */}
        <div className="space-y-6">
          <MemberList
            groupId={id}
            members={group.members}
            creatorId={group.creator._id}
          />

          {/* Group Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Group Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Created by</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    {group.creator.displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">
                    {group.creator.displayName}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Invite Code</p>
                <Badge className="font-mono text-lg">{group.inviteCode}</Badge>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Created</p>
                <span className="text-sm">
                  {new Date(group.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Leave Group Button (only for members, not creator) */}
              {group.creator._id !== currentUser._id && group.members.some((m: any) => m._id === currentUser._id) && (
                <Button
                  variant="destructive"
                  className="w-full mt-4"
                  onClick={async () => {
                    const token = localStorage.getItem('authToken');
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
}