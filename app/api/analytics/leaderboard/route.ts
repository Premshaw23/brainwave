// app/api/analytics/leaderboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  const authResult = await verifyAuth(request);
  
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    await connectDB();

    // Get top users by XP
    const topUsers = await User.find()
      .sort({ totalXP: -1 })
      .limit(10)
      .select('displayName avatar totalXP streak');

    // Get current user's rank
    const allUsers = await User.find().sort({ totalXP: -1 }).select('_id');
    const userRank = allUsers.findIndex(
      (u) => u._id.toString() === authResult.userId
    ) + 1;

    return NextResponse.json({
      success: true,
      leaderboard: topUsers.map((user, index) => ({
        rank: index + 1,
        displayName: user.displayName,
        avatar: user.avatar,
        totalXP: user.totalXP,
        streak: user.streak,
        isCurrentUser: user._id.toString() === authResult.userId,
      })),
      currentUserRank: userRank,
    });

  } catch (error: any) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard', details: error.message },
      { status: 500 }
    );
  }
}