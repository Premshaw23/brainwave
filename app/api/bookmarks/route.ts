// ============================================
// 3. BOOKMARK FUNCTIONALITY
// ============================================

// app/api/bookmarks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  console.log('--- BOOKMARK API POST ---');
  const authResult = await verifyAuth(request);
  if ('error' in authResult) {
    console.error('Auth error:', authResult.error);
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }
  console.log('Auth success:', authResult.userId);

  try {
    const { postId } = await request.json();
    console.log('Request postId:', postId);

    await connectDB();
    // Validate postId is a valid Post _id
    const Post = require('@/models/Post').default;
    const post = await Post.findById(postId);
    if (!post) {
      console.error('Invalid postId for bookmark:', postId);
      return NextResponse.json({ error: 'Invalid postId: no such Post' }, { status: 400 });
    }

    const user = await User.findById(authResult.userId);
    if (!user) {
      console.error('User not found for id:', authResult.userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (!user.bookmarks) {
      user.bookmarks = [];
    }
    const index = Array.isArray(user.bookmarks)
      ? user.bookmarks.findIndex((b: any) => b.toString() === postId)
      : -1;
    console.log('Current bookmarks:', user.bookmarks.map((b: any) => b.toString()));
    if (index > -1) {
      // Remove bookmark
      user.bookmarks.splice(index, 1);
      console.log('Bookmark removed:', postId);
    } else {
      // Add bookmark
      user.bookmarks.push(postId);
      console.log('Bookmark added:', postId);
    }
    user.markModified('bookmarks');
    console.log('[DEBUG] Bookmarks before save:', user.bookmarks.map((b: any) => b.toString()));
    try {
      await user.save();
      console.log('[DEBUG] Bookmarks after save:', user.bookmarks.map((b: any) => b.toString()));
    } catch (saveErr) {
      console.error('[DEBUG] Error saving user:', saveErr);
    }
    return NextResponse.json({
      success: true,
      isBookmarked: user.bookmarks.some((b: any) => b.toString() === postId),
      bookmarkCount: user.bookmarks.length,
    });
  } catch (error: any) {
    console.error('Bookmark error:', error);
    return NextResponse.json(
      { error: 'Failed to update bookmark', details: error.message },
      { status: 500 }
    );
  }
}
export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  await connectDB();

  const user = await User.findById(auth.userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Get all Post _id values for debugging
  const Post = require('@/models/Post').default;
  const allPosts = await Post.find({}, { _id: 1 });
  const allPostIds = allPosts.map((p: any) => p._id.toString());
  console.log('[BOOKMARKS DEBUG] All Post _id:', allPostIds);
  const userBookmarksArr = Array.isArray(user.bookmarks) ? user.bookmarks : [];
  console.log('[BOOKMARKS DEBUG] User bookmarks:', userBookmarksArr.map((b: any) => b.toString()));

  // Ensure all bookmark IDs are ObjectId for query
  const mongoose = require('mongoose');
  const Quiz = require('@/models/Quiz').default;
  const Flashcard = require('@/models/Flashcard').default;
  const bookmarkIds = (Array.isArray(user.bookmarks) ? user.bookmarks : []).map((b: any) =>
    typeof b === 'string' ? new mongoose.Types.ObjectId(b) : b
  );
  const posts = await Post.find({ _id: { $in: bookmarkIds } })
    .populate('userId', 'displayName avatar')
    .sort({ createdAt: -1 });

  // Attach isBookmarked: true and populate content for each post
  const postsWithContent = await Promise.all(posts.map(async (post: any) => {
    const obj = post.toObject();
    let content = null;
    if (obj.contentType === 'quiz') {
      content = await Quiz.findById(obj.contentId).lean();
      if (content) {
        content.questionCount = content.questions?.length || 0;
      }
    } else if (obj.contentType === 'flashcard') {
      content = await Flashcard.findById(obj.contentId).lean();
      if (content) {
        content.cardCount = content.cards?.length || 0;
      }
    }
    return {
      ...obj,
      isBookmarked: true,
      content,
    };
  }));

  return NextResponse.json({
    success: true,
    bookmarks: postsWithContent,
  });
}