// Disable pdfjs-dist worker for server environment
process.env.PDFJS_DISABLE_WORKER = 'true';
// app/api/notes/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import Note from '@/models/Note';
import pdf from 'pdf-parse';

export async function POST(request: NextRequest) {
  const authResult = await verifyAuth(request);
  
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const subject = formData.get('subject') as string;
    const textContent = formData.get('content') as string;

    if (!title || !subject) {
      return NextResponse.json(
        { error: 'Title and subject are required' },
        { status: 400 }
      );
    }

    let extractedText = textContent || '';

    // If file is provided, extract text from PDF
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      try {
        const data = await pdf(buffer);
        extractedText = data.text;
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError);
        return NextResponse.json(
          { error: 'Failed to parse PDF file' },
          { status: 400 }
        );
      }
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: 'No content provided' },
        { status: 400 }
      );
    }

    await connectDB();

    const note = await Note.create({
      userId: authResult.userId,
      title,
      subject,
      content: extractedText,
      tags: [],
    });

    return NextResponse.json({
      success: true,
      noteId: note._id,
      extractedText: extractedText.substring(0, 500) + '...', // Preview
    }, { status: 201 });

  } catch (error: any) {
    console.error('Note upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload note', details: error.message },
      { status: 500 }
    );
  }
}
