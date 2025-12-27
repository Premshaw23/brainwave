
// app/api/groups/[id]/messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';
import StudyGroup from '@/models/StudyGroup';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authResult = await verifyAuth(request);
  
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const before = searchParams.get('before'); // timestamp for pagination

    await connectDB();

    // Verify user is member
    const group = await StudyGroup.findById(id);
    if (!group || !group.members.includes(authResult.userId)) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    const query: any = { groupId: id };
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .populate('senderId', 'displayName avatar')
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({
      success: true,
      messages: messages.reverse().map(msg => ({
        _id: msg._id,
        sender: {
          _id: msg.senderId._id,
          displayName: msg.senderId.displayName,
          avatar: msg.senderId.avatar,
        },
        content: msg.content,
        type: msg.type,
        metadata: msg.metadata,
        createdAt: msg.createdAt,
      })),
    });

  } catch (error: any) {
    console.error('Fetch messages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages', details: error.message },
      { status: 500 }
    );
  }
}
