
// app/api/quizzes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import Quiz from '@/models/Quiz';

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
    const subject = searchParams.get('subject');
    const difficulty = searchParams.get('difficulty');

    await connectDB();

    const query: any = { userId: authResult.userId };
    if (subject) query.subject = subject;
    if (difficulty) query.difficulty = difficulty;

    const quizzes = await Quiz.find(query)
      .sort({ createdAt: -1 })
      .select('-questions'); // Don't send questions in list view

    return NextResponse.json({
      success: true,
      quizzes,
    });

  } catch (error: any) {
    console.error('Fetch quizzes error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quizzes', details: error.message },
      { status: 500 }
    );
  }
}
