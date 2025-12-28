// app/api/groups/[id]/leave/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import StudyGroup from '@/models/StudyGroup';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authResult = await verifyAuth(request);
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  try {
    await connectDB();
    const group = await StudyGroup.findById(id);
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    // Remove user from members
    group.members = group.members.filter((m: any) => m.toString() !== authResult.userId);
    await group.save();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Leave group error:', error);
    return NextResponse.json({ error: 'Failed to leave group', details: error.message }, { status: 500 });
  }
}
