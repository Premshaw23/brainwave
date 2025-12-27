
// app/api/posts/[id]/comment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import { createNotification } from '@/lib/notifications';
import User from '@/models/User';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string } >}
) {
  const {id}=(await params);
  const authResult = await verifyAuth(request);
  
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment text is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const comment = {
      userId: authResult.userId,
      text: text.trim(),
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    // Populate the comment with user info
    await post.populate('comments.userId', 'displayName avatar');

    const newComment = post.comments[post.comments.length - 1];

    // Notification logic: only notify if not commenting on own post
    if (String(post.userId) !== String(authResult.userId)) {
      const currentUser = await User.findById(authResult.userId);
      await createNotification({
        userId: post.userId.toString(),
        type: 'comment',
        title: 'New Comment',
        message: `${currentUser.displayName} commented on your post`,
        link: `/community/${post._id}`,
      });
    }

    return NextResponse.json({
      success: true,
      comment: {
        _id: newComment._id,
        author: {
          _id: newComment.userId._id,
          displayName: newComment.userId.displayName,
          avatar: newComment.userId.avatar,
        },
        text: newComment.text,
        createdAt: newComment.createdAt,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Comment post error:', error);
    return NextResponse.json(
      { error: 'Failed to comment', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params:Promise< { id: string }> }
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
    await connectDB();

    const post = await Post.findById(id)
      .populate('comments.userId', 'displayName avatar');

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const comments = post.comments.map((comment: any) => ({
      _id: comment._id,
      author: {
        _id: comment.userId._id,
        displayName: comment.userId.displayName,
        avatar: comment.userId.avatar,
      },
      text: comment.text,
      createdAt: comment.createdAt,
    }));

    return NextResponse.json({
      success: true,
      comments,
    });

  } catch (error: any) {
    console.error('Fetch comments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments', details: error.message },
      { status: 500 }
    );
  }
}
