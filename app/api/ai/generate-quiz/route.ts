// app/api/ai/generate-quiz/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import Note from '@/models/Note';
import Quiz from '@/models/Quiz';
import { generateQuiz } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  const authResult = await verifyAuth(request);
  
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const { noteId, difficulty, numQuestions } = await request.json();

    if (!noteId || !difficulty || !numQuestions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get the note
    const note = await Note.findOne({
      _id: noteId,
      userId: authResult.userId,
    });

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    // Generate quiz using OpenAI
    const questions = await generateQuiz({
      content: note.content,
      difficulty,
      numQuestions: parseInt(numQuestions),
      subject: note.subject,
    });

    // Save quiz to database
    const quiz = await Quiz.create({
      noteId: note._id,
      userId: authResult.userId,
      title: `${note.title} - ${difficulty} Quiz`,
      subject: note.subject,
      difficulty,
      questions,
      isPublic: false,
    });

    return NextResponse.json({
      success: true,
      quizId: quiz._id,
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        subject: quiz.subject,
        difficulty: quiz.difficulty,
        questionCount: questions.length,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Quiz generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz', details: error.message },
      { status: 500 }
    );
  }
}
