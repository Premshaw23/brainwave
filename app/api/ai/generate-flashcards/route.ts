
// app/api/ai/generate-flashcards/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import Note from '@/models/Note';
import Flashcard from '@/models/Flashcard';
import { generateFlashcards } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  const authResult = await verifyAuth(request);
  
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const { noteId, numCards } = await request.json();

    if (!noteId || !numCards) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

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

    const cards = await generateFlashcards({
      content: note.content,
      numCards: parseInt(numCards),
      subject: note.subject,
    });

    const flashcardSet = await Flashcard.create({
      noteId: note._id,
      userId: authResult.userId,
      title: `${note.title} - Flashcards`,
      subject: note.subject,
      cards: cards.map((card: any) => ({
        ...card,
        mastered: false,
      })),
    });

    return NextResponse.json({
      success: true,
      flashcardSetId: flashcardSet._id,
      cards: flashcardSet.cards,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Flashcard generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate flashcards', details: error.message },
      { status: 500 }
    );
  }
}
