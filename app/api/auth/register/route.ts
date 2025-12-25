// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { firebaseToken, displayName } = await request.json();

    if (!firebaseToken || !displayName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify Firebase token
    const decodedToken = await adminAuth.verifyIdToken(firebaseToken);
    
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ firebaseUid: decodedToken.uid });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = await User.create({
      firebaseUid: decodedToken.uid,
      email: decodedToken.email,
      displayName,
      studyInterests: [],
      streak: 0,
      totalXP: 0,
    });

    return NextResponse.json({
      success: true,
      user: {
        _id: newUser._id,
        email: newUser.email,
        displayName: newUser.displayName,
        avatar: newUser.avatar,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed', details: error.message },
      { status: 500 }
    );
  }
}
