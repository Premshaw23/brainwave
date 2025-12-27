// app/api/groups/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import StudyGroup from '@/models/StudyGroup';
import { generateInviteCode } from '@/lib/utils';

export async function POST(request: NextRequest) {
  const authResult = await verifyAuth(request);
  
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const { name, description, isPrivate } = await request.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Group name is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Generate unique invite code
    let inviteCode;
    let codeExists = true;
    
    while (codeExists) {
      inviteCode = generateInviteCode(8);
      const existing = await StudyGroup.findOne({ inviteCode });
      codeExists = !!existing;
    }

    const group = await StudyGroup.create({
      name,
      description: description || '',
      creatorId: authResult.userId,
      members: [authResult.userId],
      inviteCode,
      isPrivate: isPrivate !== false,
    });

    return NextResponse.json({
      success: true,
      group: {
        _id: group._id,
        name: group.name,
        description: group.description,
        inviteCode: group.inviteCode,
        memberCount: 1,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create group error:', error);
    return NextResponse.json(
      { error: 'Failed to create group', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const authResult = await verifyAuth(request);
  
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    await connectDB();

    const groups = await StudyGroup.find({
      members: authResult.userId,
    })
      .populate('creatorId', 'displayName avatar')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      groups: groups.map(group => ({
        _id: group._id,
        name: group.name,
        description: group.description,
        inviteCode: group.inviteCode,
        memberCount: group.members.length,
        creator: {
          _id: group.creatorId._id,
          displayName: group.creatorId.displayName,
          avatar: group.creatorId.avatar,
        },
        createdAt: group.createdAt,
      })),
    });

  } catch (error: any) {
    console.error('Fetch groups error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch groups', details: error.message },
      { status: 500 }
    );
  }
}