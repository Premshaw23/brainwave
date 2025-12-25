
// ============================================

// app/api/auth/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

export async function PUT(request: NextRequest) {
  const authResult = await verifyAuth(request);
  
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const updates = await request.json();
    const { displayName, avatar, studyInterests } = updates;

    await connectDB();
    
    const user = await User.findByIdAndUpdate(
      authResult.userId,
      {
        ...(displayName && { displayName }),
        ...(avatar && { avatar }),
        ...(studyInterests && { studyInterests }),
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        studyInterests: user.studyInterests,
      },
    });

  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile', details: error.message },
      { status: 500 }
    );
  }
}
