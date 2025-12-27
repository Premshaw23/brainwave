import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import Flashcard from '@/models/Flashcard';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    return NextResponse.json({
      success: true,
      flashcard: {
        _id: flashcard._id,
        title: flashcard.title,
        subject: flashcard.subject,
        cards: flashcard.cards,
        lastReviewed: flashcard.lastReviewed,
        createdAt: flashcard.createdAt,
      },
    });

  } catch (error: any) {
    console.error('Fetch flashcard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flashcard', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    await connectDB();
    
    const flashcard = await Flashcard.findOneAndDelete({
      _id: id,
      userId: authResult.userId,
    });

    if (!flashcard) {
      return NextResponse.json(
        { error: 'Flashcard set not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Flashcard set deleted',
    });

  } catch (error: any) {
    console.error('Delete flashcard error:', error);
    return NextResponse.json(
      { error: 'Failed to delete flashcard', details: error.message },
      { status: 500 }
    );
  }
}
