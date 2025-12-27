
// app/api/groups/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import StudyGroup from '@/models/StudyGroup';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: 'Group id is required' },
      { status: 400 }
    );
  }
  const authResult = await verifyAuth(request);
  
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    await connectDB();

    const group = await StudyGroup.findById(id)
      .populate('creatorId', 'displayName avatar')
      .populate('members', 'displayName avatar totalXP');

    if (!group) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      );
    }

    // Verify user is member
    if (!group.members.some((m: any) => m._id.toString() === authResult.userId)) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      group: {
        _id: group._id,
        name: group.name,
        description: group.description,
        inviteCode: group.inviteCode,
        creator: {
          _id: group.creatorId._id,
          displayName: group.creatorId.displayName,
          avatar: group.creatorId.avatar,
        },
        members: group.members.map((m: any) => ({
          _id: m._id,
          displayName: m.displayName,
          avatar: m.avatar,
          totalXP: m.totalXP,
        })),
        createdAt: group.createdAt,
      },
    });

  } catch (error: any) {
    console.error('Fetch group error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch group', details: error.message },
      { status: 500 }
    );
  }
}
