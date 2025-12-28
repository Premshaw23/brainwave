// app/api/groups/invites/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import GroupInvite from '@/models/GroupInvite';
import User from '@/models/User';

// List all pending invites for the authenticated user (by email or userId)
export async function GET(request: NextRequest) {
  const authResult = await verifyAuth(request);
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  try {
    await connectDB();
    const user = await User.findById(authResult.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const invites = await GroupInvite.find({
      $or: [
        { inviteeId: user._id },
        { inviteeEmail: user.email }
      ],
      status: 'pending'
    }).populate('groupId inviterId');
    return NextResponse.json({ success: true, invites });
  } catch (error: any) {
    console.error('List invites error:', error);
    return NextResponse.json({ error: 'Failed to fetch invites', details: error.message }, { status: 500 });
  }
}
