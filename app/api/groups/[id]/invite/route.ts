// app/api/groups/[id]/invite/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import GroupInvite from '@/models/GroupInvite';
import StudyGroup from '@/models/StudyGroup';
import User from '@/models/User';
import Notification from '@/models/Notification';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: groupId } = await params;
  const { inviteeEmail } = await request.json();
  if (!inviteeEmail) {
    return NextResponse.json({ error: 'Invitee email is required' }, { status: 400 });
  }
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(inviteeEmail)) {
    return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
  }
  const authResult = await verifyAuth(request);
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  try {
    await connectDB();
    const group = await StudyGroup.findById(groupId);
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    // Check if a pending invite already exists
    const existing = await GroupInvite.findOne({ groupId, inviteeEmail, status: 'pending' });
    if (existing) {
      return NextResponse.json({ error: 'Invite already sent' }, { status: 409 });
    }
    // Find invitee user (must be registered and logged in)
    const inviteeUser = await User.findOne({ email: inviteeEmail });
    if (!inviteeUser) {
      return NextResponse.json({ error: 'No registered user found with this email' }, { status: 404 });
    }
    // Prevent inviting if user is already a group member
    if (group.members.map((m: any) => m.toString()).includes(inviteeUser._id.toString())) {
      return NextResponse.json({ error: 'User is already a group member' }, { status: 409 });
    }
    // Optionally, check if the user is currently logged in (has a lastActive within X minutes)
    // Example: consider logged in if lastActive within 30 minutes
    const THIRTY_MINUTES = 30 * 60 * 1000;
    if (!inviteeUser.lastActive || (Date.now() - new Date(inviteeUser.lastActive).getTime()) > THIRTY_MINUTES) {
      return NextResponse.json({ error: 'User is not currently active or logged in' }, { status: 403 });
    }
    // Remove any non-pending invites for this user/group to avoid unique index error
    await GroupInvite.deleteMany({ groupId, inviteeEmail, status: { $ne: 'pending' } });
    // Create the new pending invite
    const invite = await GroupInvite.create({
      groupId,
      inviterId: authResult.userId,
      inviteeEmail,
      inviteeId: inviteeUser._id,
      status: 'pending',
    });
    // Send notification
    await Notification.create({
      userId: inviteeUser._id,
      type: 'system',
      title: 'Study Group Invite',
      message: `You have been invited to join the group "${group.name}"`,
      link: `/groups/${groupId}`,
    });
    return NextResponse.json({ success: true, invite });
  } catch (error: any) {
    console.error('Invite error:', error);
    return NextResponse.json({ error: 'Failed to send invite', details: error.message }, { status: 500 });
  }
}
