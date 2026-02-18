// app/api/ai/generate-flashcards/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import Note from '@/models/Note';
import Flashcard from '@/models/Flashcard';
import { generateFlashcards } from '@/lib/gemini';

export const maxDuration = 60; // Max duration for Vercel Hobby/Pro

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { noteId, numCards } = await request.json();

    if (!noteId) {
      return NextResponse.json({ error: 'Note ID is required' }, { status: 400 });
    }

    // Input validation & sanitization
    const count = Math.min(Math.max(parseInt(numCards) || 5, 3), 30);

    await connectDB();

    const note = await Note.findOne({
      _id: noteId,
      userId: authResult.userId,
    });

    if (!note) {
      return NextResponse.json({ error: 'Note not found or access denied' }, { status: 404 });
    }

    console.log(`[Flashcard Gen] Starting for note: ${noteId}, count: ${count}`);

    // Generate cards using the optimized lib function
    const cards = await generateFlashcards({
      content: note.content,
      numCards: count,
      subject: note.subject,
    });

    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      console.error('[Flashcard Gen] No cards returned from AI');
      return NextResponse.json({ error: 'The AI could not generate cards for this content. Try a different note.' }, { status: 422 });
    }

    // Save to database
    const flashcardSet = await Flashcard.create({
      noteId: note._id,
      userId: authResult.userId,
      title: `${note.title} • Essential Cards`,
      subject: note.subject,
      cards: cards.map((card: any) => ({
        front: card.front,
        back: card.back,
        mastered: false,
      })),
    });

    console.log(`[Flashcard Gen] Successfully created set: ${flashcardSet._id}`);

    return NextResponse.json({
      success: true,
      flashcardSetId: flashcardSet._id,
      cards: flashcardSet.cards,
    }, { status: 201 });

  } catch (error: any) {
    console.error('[Flashcard Gen] Fatal Error:', error);
    
    // Determine friendly error message
    let message = 'An unexpected error occurred. Please try again.';
    let status = 500;

    if (error.message?.includes('model') || error.message?.includes('AI')) {
      message = 'The AI is currently under high load. Please try again in a moment.';
      status = 503;
    }

    return NextResponse.json(
      { error: message, details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status }
    );
  }
}
