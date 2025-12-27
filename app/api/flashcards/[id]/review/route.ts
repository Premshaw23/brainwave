import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import Flashcard from '@/models/Flashcard';

export async function POST(
  request: NextRequest,
  { params }: { params:Promise< { id: string }> }
) {
  const {id}=await params;
  const authResult = await verifyAuth(request);
  
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const { cardIndex, mastered } = await request.json();

    if (cardIndex === undefined || mastered === undefined) {
      return NextResponse.json(
        { error: 'Card index and mastered status required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const flashcard = await Flashcard.findOne({
      _id: id,
      userId: authResult.userId,
    });

    if (!flashcard) {
      return NextResponse.json(
        { error: 'Flashcard set not found' },
        { status: 404 }
      );
    }

    if (cardIndex < 0 || cardIndex >= flashcard.cards.length) {
      return NextResponse.json(
        { error: 'Invalid card index' },
        { status: 400 }
      );
    }

    // Update card status
    flashcard.cards[cardIndex].mastered = mastered;
    flashcard.cards[cardIndex].lastReviewed = new Date();
    flashcard.lastReviewed = new Date();

    await flashcard.save();

    const masteredCount = flashcard.cards.filter((c: any) => c.mastered).length;
    const progress = Math.round((masteredCount / flashcard.cards.length) * 100);

    return NextResponse.json({
      success: true,
      masteredCount,
      totalCards: flashcard.cards.length,
      progress,
    });

  } catch (error: any) {
    console.error('Review flashcard error:', error);
    return NextResponse.json(
      { error: 'Failed to update review', details: error.message },
      { status: 500 }
    );
  }
}
