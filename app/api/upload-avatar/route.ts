// app/api/upload-avatar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // Optional: limit file size/type here
  const blob = await put(`avatars/${Date.now()}-${(file as File).name}`, file as File, {
    access: 'public',
  });

  return NextResponse.json({ success: true, url: blob.url });
}
