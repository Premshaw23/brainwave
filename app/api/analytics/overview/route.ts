
// app/api/analytics/overview/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import QuizAttempt from '@/models/QuizAttempt';
import Quiz from '@/models/Quiz';
import User from '@/models/User';
import { calculateMastery } from '@/lib/utils';

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

    // Get all attempts
    const attempts = await QuizAttempt.find({ userId: authResult.userId })
      .populate('quizId')
      .sort({ completedAt: -1 });

    // Calculate stats
    const totalAttempts = attempts.length;
    const avgAccuracy = attempts.length > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
      : 0;

    // Get mastery by subject
    const subjectStats: Record<string, any[]> = {};
    
    for (const attempt of attempts) {
      const quiz = attempt.quizId as any;
      if (!quiz) continue;
      
      if (!subjectStats[quiz.subject]) {
        subjectStats[quiz.subject] = [];
      }
      subjectStats[quiz.subject].push(attempt);
    }

    const masteryBySubject = Object.entries(subjectStats).map(([subject, subjectAttempts]) => ({
      subject,
      mastery: calculateMastery(subjectAttempts),
      attempts: subjectAttempts.length,
    }));

    // Get user data
    const user = await User.findById(authResult.userId);

    return NextResponse.json({
      success: true,
      stats: {
        totalQuizzes: totalAttempts,
        avgAccuracy,
        streak: user?.streak || 0,
        totalXP: user?.totalXP || 0,
        masteryBySubject,
      },
    });

  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics', details: error.message },
      { status: 500 }
    );
  }
}