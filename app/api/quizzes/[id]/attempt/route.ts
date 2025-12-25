
// app/api/quizzes/[id]/attempt/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import Quiz from '@/models/Quiz';
import QuizAttempt from '@/models/QuizAttempt';
import mongoose from 'mongoose';
import User from '@/models/User';

export async function POST(
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
    const { answers, timeSpent } = await request.json();

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Invalid answers format' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Grade the quiz
    const gradedAnswers = answers.map((answer, index) => {
      const question = quiz.questions[index];
      const isCorrect = answer.selectedAnswer === question.correctAnswer;
      
      return {
        questionIndex: index,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
      };
    });

    const correctCount = gradedAnswers.filter(a => a.isCorrect).length;
    const score = Math.round((correctCount / quiz.questions.length) * 100);

    // Save attempt
    const attempt = await QuizAttempt.create({
      quizId: quiz._id,
      userId: authResult.userId,
      answers: gradedAnswers,
      score,
      timeSpent: timeSpent || 0,
    });

    // Award XP
    const xpEarned = correctCount * 10; // 10 XP per correct answer
    await User.findByIdAndUpdate(authResult.userId, {
      $inc: { totalXP: xpEarned }
    });

    // Return results with explanations
    const results = gradedAnswers.map((answer, index) => {
      const question = quiz.questions[index];
      return {
        ...answer,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
      };
    });

    return NextResponse.json({
      success: true,
      attemptId: attempt._id,
      score,
      correctCount,
      totalQuestions: quiz.questions.length,
      xpEarned,
      results,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Submit quiz error:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz', details: error.message },
      { status: 500 }
    );
  }
}
