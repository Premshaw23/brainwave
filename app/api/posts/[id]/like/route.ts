
// app/api/posts/[id]/like/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import { createNotification } from '@/lib/notifications';
import User from '@/models/User';

export async function POST(
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
    await connectDB();

    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const userIndex = post.likes.indexOf(authResult.userId);

    let liked = false;
    if (userIndex > -1) {
      // Unlike
      post.likes.splice(userIndex, 1);
    } else {
      // Like
      post.likes.push(authResult.userId);
      liked = true;
    }

    await post.save();

    // Notification logic: only notify if just liked (not unliked) and not liking own post
    if (liked && String(post.userId) !== String(authResult.userId)) {
      const currentUser = await User.findById(authResult.userId);
      await createNotification({
        userId: post.userId.toString(),
        type: 'like',
        title: 'New Like',
        message: `${currentUser.displayName} liked your post`,
        link: `/community/${post._id}`,
      });
    }

    return NextResponse.json({
      success: true,
      likeCount: post.likes.length,
      isLiked: post.likes.includes(authResult.userId),
    });

  } catch (error: any) {
    console.error('Like post error:', error);
    return NextResponse.json(
      { error: 'Failed to like post', details: error.message },
      { status: 500 }
    );
  }
}
