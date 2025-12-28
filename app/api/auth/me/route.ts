
// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  const authResult = await verifyAuth(request);
  
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  return NextResponse.json({
    success: true,
    user: {
      _id: authResult.user._id,
      email: authResult.user.email,
      displayName: authResult.user.displayName,
      avatar: authResult.user.avatar,
      studyInterests: authResult.user.studyInterests,
      streak: authResult.user.streak,
      totalXP: authResult.user.totalXP,
      lastActive: authResult.user.lastActive,
      createdAt: authResult.user.createdAt,
    },
  });
}
