// app/api/groups/invites/[inviteId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import GroupInvite from '@/models/GroupInvite';
import StudyGroup from '@/models/StudyGroup';
import User from '@/models/User';
import Notification from '@/models/Notification';

// Respond to a group invite (accept/reject)
export async function POST(request: NextRequest, { params }: { params: Promise<{ inviteId: string }> }) {
  const { inviteId } = await params;
  const { action } = await request.json(); // 'accept' or 'reject'
  if (!['accept', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
  const authResult = await verifyAuth(request);
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  try {
    await connectDB();
    const invite = await GroupInvite.findById(inviteId);
    if (!invite || invite.status !== 'pending') {
      return NextResponse.json({ error: 'Invite not found or already handled' }, { status: 404 });
    }
    // Only the invitee can respond
    const user = await User.findById(authResult.userId);
    if (!user || (invite.inviteeId && !invite.inviteeId.equals(user._id)) && invite.inviteeEmail !== user.email) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }
    invite.status = action === 'accept' ? 'accepted' : 'rejected';
    await invite.save();
    // On accept, add user to group
    if (action === 'accept') {
      const group = await StudyGroup.findById(invite.groupId);
      if (group && !group.members.includes(user._id)) {
        group.members.push(user._id);
        await group.save();
      }
    }
    // Notify inviter
    await Notification.create({
      userId: invite.inviterId,
      type: 'system',
      title: 'Group Invite Response',
      message: `Your invite to ${invite.inviteeEmail} was ${action}ed.`,
      link: `/groups/${invite.groupId}`,
    });
    return NextResponse.json({ success: true, status: invite.status });
  } catch (error: any) {
    console.error('Respond invite error:', error);
    return NextResponse.json({ error: 'Failed to respond to invite', details: error.message }, { status: 500 });
  }
}
