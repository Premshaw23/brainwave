// app/api/analytics/progress/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import QuizAttempt from '@/models/QuizAttempt';
import Quiz from '@/models/Quiz';
import Note from '@/models/Note';

export async function GET(request: NextRequest) {
  const authResult = await verifyAuth(request);
  
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '30days';

    await connectDB();

    // Calculate date range
    const daysAgo = timeframe === '7days' ? 7 : timeframe === '30days' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // Get all attempts in timeframe
    const attempts = await QuizAttempt.find({
      userId: authResult.userId,
      completedAt: { $gte: startDate },
    })
      .populate({ path: 'quizId', model: Quiz })
      .sort({ completedAt: 1 });

    // Group by date for chart
    const dailyData: Record<string, { scores: number[]; count: number }> = {};

    attempts.forEach((attempt) => {
      const date = new Date(attempt.completedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      if (!dailyData[date]) {
        dailyData[date] = { scores: [], count: 0 };
      }

      dailyData[date].scores.push(attempt.score);
      dailyData[date].count++;
    });

    // Create chart data
    const chartData = Object.entries(dailyData).map(([date, data]) => ({
      date,
      score: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
      quizzes: data.count,
    }));

    // Calculate learning velocity
    const totalQuestions = attempts.reduce((sum, attempt) => {
      const quiz = attempt.quizId as any;
      return sum + (quiz?.questions?.length || 0);
    }, 0);

    const totalTime = attempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0);
    const questionsPerDay = totalQuestions / daysAgo;
    const avgTimePerQuiz = attempts.length > 0 ? totalTime / attempts.length : 0;

    // Calculate improvement rate
    const firstHalf = attempts.slice(0, Math.floor(attempts.length / 2));
    const secondHalf = attempts.slice(Math.floor(attempts.length / 2));

    const firstHalfAvg = firstHalf.length > 0
      ? firstHalf.reduce((sum, a) => sum + a.score, 0) / firstHalf.length
      : 0;

    const secondHalfAvg = secondHalf.length > 0
      ? secondHalf.reduce((sum, a) => sum + a.score, 0) / secondHalf.length
      : 0;

    const improvementRate = firstHalfAvg > 0
      ? Math.round(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100)
      : 0;

    // Get recent activity (quizzes and notes)
    const recentQuizzes = await QuizAttempt.find({
      userId: authResult.userId,
    })
      .populate('quizId')
      .sort({ completedAt: -1 })
      .limit(5);

    const recentNotes = await Note.find({
      userId: authResult.userId,
    })
      .sort({ createdAt: -1 })
      .limit(3);

    const recentActivity = [
      ...recentQuizzes
        .filter((attempt: any) => attempt.quizId)
        .map((attempt: any) => ({
          _id: attempt.quizId._id,
          type: 'quiz',
          title: attempt.quizId.title,
          subject: attempt.quizId.subject,
          score: attempt.score,
          timestamp: attempt.completedAt,
        })),
      ...recentNotes.map((note: any) => ({
        _id: note._id,
        type: 'note',
        title: note.title,
        subject: note.subject,
        timestamp: note.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 8);

    return NextResponse.json({
      success: true,
      chartData,
      velocity: {
        questionsPerDay,
        averageTimePerQuiz: avgTimePerQuiz,
        improvementRate: Math.max(improvementRate, 0),
        totalTimeSpent: totalTime,
      },
      recentActivity,
    });

  } catch (error: any) {
    console.error('Progress analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress data', details: error.message },
      { status: 500 }
    );
  }
}
