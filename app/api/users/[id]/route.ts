
// ============================================
// 4. USER PROFILE PAGES
// ============================================

// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Post from '@/models/Post';
import QuizAttempt from '@/models/QuizAttempt';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string } >}
) {
  const {id}=await params;
  const authResult = await verifyAuth(request);
  
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    await connectDB();

    // Use firebaseUid for lookup since id may be a Firebase UID, not ObjectId
    const user = await User.findOne({ firebaseUid: id });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's posts using the user's ObjectId
    const posts = await Post.find({ userId: user._id })
      .populate('userId', 'displayName avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    // Populate content for each post
    const Quiz = require('@/models/Quiz').default;
    const Flashcard = require('@/models/Flashcard').default;
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
        author: obj.userId, // for PostCard compatibility
        content,
      };
    }));

    // Get user stats
    const quizAttempts = await QuizAttempt.find({ userId: user._id });
    const totalQuizzes = quizAttempts.length;
    const avgScore = quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((sum, a) => sum + a.score, 0) / quizAttempts.length)
      : 0;

    const profileObj = {
      _id: user._id,
      firebaseUid: user.firebaseUid, // Add this line
      displayName: user.displayName,
      avatar: user.avatar,
      studyInterests: user.studyInterests,
      totalXP: user.totalXP,
      streak: user.streak,
      createdAt: user.createdAt,
      stats: {
        totalQuizzes,
        avgScore,
        postsCount: posts.length,
      },
      recentPosts: postsWithContent,
    };
    return NextResponse.json({
      success: true,
      profile: profileObj,
      user: profileObj,
    });

  } catch (error: any) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile', details: error.message },
      { status: 500 }
    );
  }
}