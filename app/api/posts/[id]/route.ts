// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import Quiz from '@/models/Quiz';
import Flashcard from '@/models/Flashcard';
import { promises } from 'dns';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const {id}=(await params);
  const authResult = await verifyAuth(request);
  
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    await connectDB();

    const post = await Post.findById(id)
      .populate('userId', 'displayName avatar totalXP')
      .populate('comments.userId', 'displayName avatar');

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Get content details
    let contentData = null;
    if (post.contentType === 'quiz') {
      const quiz = await Quiz.findById(post.contentId);
      contentData = quiz ? {
        _id: quiz._id,
        title: quiz.title,
        subject: quiz.subject,
        difficulty: quiz.difficulty,
        questions: quiz.questions,
      } : null;
    } else if (post.contentType === 'flashcard') {
      const flashcard = await Flashcard.findById(post.contentId);
      contentData = flashcard ? {
        _id: flashcard._id,
        title: flashcard.title,
        subject: flashcard.subject,
        cards: flashcard.cards,
      } : null;
    } else if (post.contentType === 'note') {
      const Note = (await import('@/models/Note')).default;
      let note = null;
      try {
        note = await Note.findById(post.contentId);
      } catch (err) {
        note = await Note.findOne({ _id: String(post.contentId) });
      }
      contentData = note ? {
        _id: note._id,
        title: note.title,
        subject: note.subject,
        tags: note.tags,
        content: note.content,
      } : null;
    } else if (post.contentType === 'summary') {
      contentData = post.contentId;
    }

    return NextResponse.json({
      success: true,
      post: {
        _id: post._id,
        author: {
          _id: post.userId._id,
          displayName: post.userId.displayName,
          avatar: post.userId.avatar,
          totalXP: post.userId.totalXP,
        },
        contentType: post.contentType,
        content: contentData,
        caption: post.caption,
        likeCount: post.likes.length,
        isLiked: post.likes.includes(authResult.userId),
        comments: post.comments.map((comment: any) => ({
          _id: comment._id,
          author: {
            _id: comment.userId._id,
            displayName: comment.userId.displayName,
            avatar: comment.userId.avatar,
          },
          text: comment.text,
          createdAt: comment.createdAt,
        })),
        createdAt: post.createdAt,
      },
    });

  } catch (error: any) {
    console.error('Fetch post error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authResult = await verifyAuth(request);
  
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    await connectDB();

    const post = await Post.findOne({
      _id: id,
      userId: authResult.userId,
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found or not authorized' },
        { status: 404 }
      );
    }

    await post.deleteOne();

    return NextResponse.json({
      success: true,
      message: 'Post deleted',
    });

  } catch (error: any) {
    console.error('Delete post error:', error);
    return NextResponse.json(
      { error: 'Failed to delete post', details: error.message },
      { status: 500 }
    );
  }
}