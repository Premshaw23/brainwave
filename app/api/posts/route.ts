// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import Quiz from '@/models/Quiz';
import Flashcard from '@/models/Flashcard';

export async function POST(request: NextRequest) {
  const authResult = await verifyAuth(request);
  
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const { contentType, contentId, caption } = await request.json();


    if (!contentType || !contentId) {
      return NextResponse.json(
        { error: 'Content type and ID are required' },
        { status: 400 }
      );
    }

    await connectDB();


    // Verify content exists and belongs to user, except for screenshot
    let content;
    if (contentType === 'quiz') {
      content = await Quiz.findOne({ _id: contentId, userId: authResult.userId });
      if (!content) {
        return NextResponse.json(
          { error: 'Content not found or not authorized' },
          { status: 404 }
        );
      }
    } else if (contentType === 'flashcard') {
      content = await Flashcard.findOne({ _id: contentId, userId: authResult.userId });
      if (!content) {
        return NextResponse.json(
          { error: 'Content not found or not authorized' },
          { status: 404 }
        );
      }
    } else if (contentType === 'note') {
      // For notes, just check user ownership
      const Note = (await import('@/models/Note')).default;
      content = await Note.findOne({ _id: contentId, userId: authResult.userId });
      if (!content) {
        return NextResponse.json(
          { error: 'Content not found or not authorized' },
          { status: 404 }
        );
      }
    } else if (contentType === 'screenshot') {
      // Screenshot is a base64 string, no DB lookup needed
      content = true;
    }


    // Check if already shared (skip for screenshot)
    if (contentType !== 'screenshot') {
      const existingPost = await Post.findOne({ contentId, userId: authResult.userId });
      if (existingPost) {
        return NextResponse.json(
          { error: 'Content already shared' },
          { status: 409 }
        );
      }
    }


    // Create post
    const post = await Post.create({
      userId: authResult.userId,
      contentType,
      contentId,
      caption: caption || '',
      likes: [],
      comments: [],
    });

    return NextResponse.json({
      success: true,
      postId: post._id,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: 'Failed to create post', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const authResult = await verifyAuth(request);
  
  if ('error' in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const subject = searchParams.get('subject');
    const contentType = searchParams.get('contentType');

    await connectDB();

    // Build query
    const query: any = {};
    if (contentType) {
      query.contentType = contentType;
    }
    
    // Get posts and populate content
    const posts = await Post.find(query)
      .populate('userId', 'displayName avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Populate actual content (quiz or flashcard)
    const populatedPosts = await Promise.all(
      posts.map(async (post) => {
        let contentData = null;

        if (post.contentType === 'quiz') {
          const quiz = await Quiz.findById(post.contentId);
          contentData = quiz ? {
            _id: quiz._id,
            title: quiz.title,
            subject: quiz.subject,
            difficulty: quiz.difficulty,
            questionCount: quiz.questions?.length || 0,
          } : null;
        } else if (post.contentType === 'flashcard') {
          const flashcard = await Flashcard.findById(post.contentId);
          contentData = flashcard ? {
            _id: flashcard._id,
            title: flashcard.title,
            subject: flashcard.subject,
            cardCount: flashcard.cards.length,
          } : null;
        } else if (post.contentType === 'note') {
          const Note = (await import('@/models/Note')).default;
          let note = null;
          try {
            note = await Note.findById(post.contentId);
          } catch (err) {
            // fallback: try as string
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
          // For summary, just use the contentId as the content
          contentData = post.contentId;
        }

        // Filter by subject if requested
        if (subject && contentData && contentData.subject !== subject) {
          return null;
        }

        return {
          _id: post._id,
          author: {
            _id: post.userId._id,
            displayName: post.userId.displayName,
            avatar: post.userId.avatar,
          },
          contentType: post.contentType,
          content: contentData,
          caption: post.caption,
          likeCount: post.likes.length,
          commentCount: post.comments.length,
          isLiked: post.likes.includes(authResult.userId),
          createdAt: post.createdAt,
        };
      })
    );

    // Filter out nulls (posts that didn't match subject filter)
    const filteredPosts = populatedPosts.filter(p => p !== null);

    const total = await Post.countDocuments(query);

    return NextResponse.json({
      success: true,
      posts: filteredPosts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error: any) {
    console.error('Fetch posts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts', details: error.message },
      { status: 500 }
    );
  }
}
