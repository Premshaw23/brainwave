
// app/api/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';

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

    const notifications = await Notification.find({
      userId: authResult.userId,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = await Notification.countDocuments({
      userId: authResult.userId,
      read: false,
    });

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });

  } catch (error: any) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications', details: error.message },
      { status: 500 }
    );
  }
}

// Mark as read
export async function PUT(request: NextRequest) {
  const authResult = await verifyAuth(request);
  
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const { notificationId } = await request.json();

    await connectDB();

    await Notification.findOneAndUpdate(
      { _id: notificationId, userId: authResult.userId },
      { read: true }
    );

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Mark notification read error:', error);
    return NextResponse.json(
      { error: 'Failed to update notification', details: error.message },
      { status: 500 }
    );
  }
}