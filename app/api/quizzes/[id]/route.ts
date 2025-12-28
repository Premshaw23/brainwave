
// app/api/quizzes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import Quiz from '@/models/Quiz';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id || id === 'undefined' || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: 'Invalid quiz ID' },
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
    
    const quiz = await Quiz.findOne({
      _id: id,
      $or: [
        { userId: authResult.userId },
        { isPublic: true }
      ]
    });

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Remove correct answers and explanations for initial fetch
    const questionsWithoutAnswers = quiz.questions.map((q: any) => ({
      question: q.question,
      options: q.options,
    }));

    return NextResponse.json({
      success: true,
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        subject: quiz.subject,
        difficulty: quiz.difficulty,
        questions: questionsWithoutAnswers,
      },
    });

  } catch (error: any) {
    console.error('Fetch quiz error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  if (!id || id === 'undefined' || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: 'Invalid quiz ID' },
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
    const quiz = await Quiz.findOne({ _id: id, userId: authResult.userId });
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found or not authorized' },
        { status: 404 }
      );
    }
    await Quiz.deleteOne({ _id: id });
    return NextResponse.json({ success: true, message: 'Quiz deleted' });
  } catch (error: any) {
    console.error('Delete quiz error:', error);
    return NextResponse.json(
      { error: 'Failed to delete quiz', details: error.message },
      { status: 500 }
    );
  }
}