import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import Flashcard from '@/models/Flashcard';

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

    await connectDB();

    const query: any = { userId: authResult.userId };
    if (subject) query.subject = subject;

    const flashcards = await Flashcard.find(query)
      .sort({ createdAt: -1 }); // Don't exclude cards, needed for count

    return NextResponse.json({
      success: true,
      flashcards: flashcards.map(f => ({
        _id: f._id,
        title: f.title,
        subject: f.subject,
        cardCount: Array.isArray(f.cards) ? f.cards.length : 0,
        masteredCount: Array.isArray(f.cards) ? f.cards.filter((c: any) => c.mastered).length : 0,
        lastReviewed: f.lastReviewed,
        createdAt: f.createdAt,
      })),
    });

  } catch (error: any) {
    console.error('Fetch flashcards error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flashcards', details: error.message },
      { status: 500 }
    );
  }
}
