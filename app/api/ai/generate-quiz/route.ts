// app/api/ai/generate-quiz/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import Note from '@/models/Note';
import Quiz from '@/models/Quiz';
import { generateQuiz } from '@/lib/gemini';

export const maxDuration = 60; // Max duration for Vercel

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { noteId, difficulty, numQuestions } = await request.json();

    if (!noteId) {
      return NextResponse.json({ error: 'Note ID is required' }, { status: 400 });
    }

    // Input validation
    const count = Math.min(Math.max(parseInt(numQuestions) || 5, 3), 20);
    const diff = ['easy', 'medium', 'hard'].includes(difficulty) ? difficulty : 'medium';

    await connectDB();

    const note = await Note.findOne({
      _id: noteId,
      userId: authResult.userId,
    });

    if (!note) {
      return NextResponse.json({ error: 'Note not found or access denied' }, { status: 404 });
    }

    console.log(`[Quiz Gen] Starting for note: ${noteId}, diff: ${diff}, count: ${count}`);

    // Generate questions using the optimized lib function
    const questions = await generateQuiz({
      content: note.content,
      difficulty: diff as 'easy' | 'medium' | 'hard',
      numQuestions: count,
      subject: note.subject,
    });

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      console.error('[Quiz Gen] No questions returned from AI');
      return NextResponse.json({ error: 'The AI could not generate questions for this content.' }, { status: 422 });
    }

    // Save to database
    const quiz = await Quiz.create({
      noteId: note._id,
      userId: authResult.userId,
      title: `${note.title} Quiz`,
      subject: note.subject,
      difficulty: diff,
      questions: questions.map((q: any) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      })),
      totalQuestions: questions.length,
    });

    console.log(`[Quiz Gen] Successfully created quiz: ${quiz._id}`);

    return NextResponse.json({
      success: true,
      quizId: quiz._id,
      questions: quiz.questions,
    }, { status: 201 });

  } catch (error: any) {
    console.error('[Quiz Gen] Fatal Error:', error);
    
    let message = 'Failed to generate quiz. Please try again.';
    let status = 500;

    if (error.message?.includes('model') || error.message?.includes('AI')) {
      message = 'The AI is currently under heavy load. Please try again soon.';
      status = 503;
    }

    return NextResponse.json(
      { error: message, details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status }
    );
  }
}
