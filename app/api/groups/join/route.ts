
// app/api/groups/join/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import StudyGroup from '@/models/StudyGroup';

export async function POST(request: NextRequest) {
  const authResult = await verifyAuth(request);
  
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const { inviteCode } = await request.json();

    if (!inviteCode) {
      return NextResponse.json(
        { error: 'Invite code is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const group = await StudyGroup.findOne({ inviteCode: inviteCode.toUpperCase() });

    if (!group) {
      return NextResponse.json(
        { error: 'Invalid invite code' },
        { status: 404 }
      );
    }

    // Check if already a member
    if (group.members.includes(authResult.userId)) {
      return NextResponse.json({
        success: true,
        message: 'Already a member',
        groupId: group._id,
      });
    }

    // Add user to group
    group.members.push(authResult.userId);
    await group.save();

    return NextResponse.json({
      success: true,
      message: 'Joined group successfully',
      group: {
        _id: group._id,
        name: group.name,
        description: group.description,
      },
    });

  } catch (error: any) {
    console.error('Join group error:', error);
    return NextResponse.json(
      { error: 'Failed to join group', details: error.message },
      { status: 500 }
    );
  }
}
