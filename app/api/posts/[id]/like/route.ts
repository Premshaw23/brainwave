
// app/api/posts/[id]/like/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';

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

    if (userIndex > -1) {
      // Unlike
      post.likes.splice(userIndex, 1);
    } else {
      // Like
      post.likes.push(authResult.userId);
    }

    await post.save();

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
