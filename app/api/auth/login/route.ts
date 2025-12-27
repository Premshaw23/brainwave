
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import QuizAttempt from '@/models/QuizAttempt';
import { calculateStreak } from '@/lib/utils';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { firebaseToken } = await request.json();

    if (!firebaseToken) {
      return NextResponse.json(
        { error: 'Token required' },
        { status: 400 }
      );
    }

    // Verify Firebase token
    const decodedToken = await adminAuth.verifyIdToken(firebaseToken);
    
    await connectDB();

    // Find or create user
    let user = await User.findOne({ firebaseUid: decodedToken.uid });
    
    if (!user) {
      // Auto-create user if they don't exist (Google OAuth case)
      user = await User.create({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name || decodedToken.email?.split('@')[0] || 'User',
        avatar: decodedToken.picture,
        studyInterests: [],
        streak: 0,
        totalXP: 0,
      });
    }


    // Update last active and streak
    user.lastActive = new Date();
    // Recalculate streak based on attempts
    const attempts = await QuizAttempt.find({ userId: user._id }).sort({ completedAt: -1 });
    user.streak = calculateStreak(attempts);
    await user.save();

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        studyInterests: user.studyInterests,
        streak: user.streak,
        totalXP: user.totalXP,
      },
    });

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed', details: error.message },
      { status: 500 }
    );
  }
}