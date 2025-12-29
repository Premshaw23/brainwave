// components/community/PostCard.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, Brain, Calendar, Bookmark, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PostCardProps {
  post: {
    _id: string;
    author: {
      _id: string;
      displayName: string;
      avatar?: string;
      firebaseUid?: string;
    };
    contentType: 'quiz' | 'flashcard' | 'note' | 'screenshot' | 'summary';
    content: any;
    caption: string;
    likeCount: number;
    commentCount: number;
    isLiked: boolean;
    createdAt: string;
    contentId?: string;
    contentTitle?: string;
  };
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
}
export default function PostCard({ post, onLike, onComment }: PostCardProps) {
  const { user } = useAuth();
  const currentUserId = user ? user.uid : null;
  const [liked, setLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [liking, setLiking] = useState(false);

  // Bookmark state
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    // Fetch bookmarks and set initial state
    const fetchBookmarks = async () => {
      try {
        if (!user) return;
        const token = await user.getIdToken();
        const response = await fetch('/api/bookmarks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        // console.log('[PostCard] GET /api/bookmarks response:', data);
        if (data.success && Array.isArray(data.bookmarks)) {
          // bookmarks can be array of posts or post ids
          const ids = data.bookmarks.map((b: any) => String(b._id || b));
          setBookmarked(ids.includes(String(post._id)));
        }
      } catch (err) {
        console.error('[PostCard] Error fetching bookmarks:', err);
      }
    };
    fetchBookmarks();
  }, [post._id, user]);

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);

    try {
      if (!user) throw new Error('Not authenticated');
      const token = await user.getIdToken();
      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setLiked(data.isLiked);
        setLikeCount(data.likeCount);
        onLike?.(post._id);
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    } finally {
      setLiking(false);
    }
  };

  const formatTimeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
  };

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'easy') return 'bg-green-100 text-green-800';
    if (difficulty === 'medium') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  console.log(`/profile/${post.author.firebaseUid}`);
  return (
    <Card className="bg-linear-to-br from-white via-indigo-50 to-indigo-100 shadow-2xl rounded-2xl border border-gray-200 hover:shadow-indigo-200/50 transition-all duration-200">
      <CardContent className="p-2 px-8">
        {/* Author Header */}
        <div className="flex items-center gap-4 mb-6">
          {post.author.firebaseUid ? (
            <Link href={`/profile/${post.author.firebaseUid}`}>
              <Avatar className="cursor-pointer w-10 h-10 shadow-md">
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>
                  {post.author.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Avatar className="w-10 h-10 shadow-md">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>
                {post.author.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex-1">
            {post.author.firebaseUid ? (
              <Link href={`/profile/${post.author.firebaseUid}`}>
                <h4 className="font-bold text-gray-900 hover:text-indigo-700 text-lg tracking-tight">
                  {post.author.displayName}
                </h4>
              </Link>
            ) : (
              <h4 className="font-bold text-gray-900 text-lg tracking-tight">
                {post.author.displayName}
              </h4>
            )}
            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
              <Calendar className="w-4 h-4" />
              {formatTimeAgo(post.createdAt)}
              {/* Bookmark Button */}
              <Button
                variant="ghost"
                size="sm"
                disabled={liking}
                onClick={async () => {
                  setLiking(true);
                  try {
                    if (!user) throw new Error('Not authenticated');
                    const token = await user.getIdToken();
                    const response = await fetch('/api/bookmarks', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({ postId: post._id }),
                    });
                    const data = await response.json();
                    if (data.success) {
                      setBookmarked(data.isBookmarked);
                    } else {
                      console.error('[PostCard] Bookmark API error:', data);
                    }
                  } catch (err) {
                    console.error('[PostCard] Error updating bookmark:', err);
                  } finally {
                    setLiking(false);
                  }
                }}
                className={bookmarked ? 'text-indigo-600' : 'text-gray-600'}
              >
                <Bookmark className="w-5 h-5" fill={bookmarked ? 'currentColor' : 'none'} />
              </Button>
            </div>
            <Badge variant="outline" className="capitalize px-3 py-1 text-base font-semibold rounded-xl shadow-sm bg-indigo-50 text-indigo-700 border border-indigo-200 mt-2">
              {post.contentType}
            </Badge>
          </div>
        </div>

        {/* Caption */}
        {post.caption && (
          <p className="text-gray-700 mb-6 text-base font-medium">{post.caption}</p>
        )}

        {/* Content Preview */}
        {post.contentType === 'note' && post.content && (
          <Link href={`/community/${post._id}`}>
            <div className="bg-yellow-50 rounded-lg p-4 mb-4 cursor-pointer hover:shadow-md transition-shadow border border-yellow-100">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-600 p-2 rounded-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">
                    {post.content.title || post.contentId}
                  </h3>
                  <div className="flex items-center gap-2">
                    {post.content.subject && (
                      <Badge className="capitalize">{post.content.subject}</Badge>
                    )}
                    {post.content.tags && post.content.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {post.contentType === 'screenshot' && post.contentId && (
          <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100 flex flex-col items-center">
            <div className="mb-2 font-bold text-gray-900">Analytics Screenshot</div>
            <img src={post.contentId} alt="Shared Screenshot" className="rounded-lg max-w-full max-h-96 shadow" />
          </div>
        )}

        {(post.contentType === 'quiz' || post.contentType === 'flashcard') && post.content && (
          <Link href={`/community/${post._id}`}>
            <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-lg p-4 mb-4 cursor-pointer hover:shadow-md transition-shadow border border-indigo-100">
              <div className="flex items-start gap-3">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">
                    {post.content.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge className="capitalize">{post.content.subject}</Badge>
                    {post.content.difficulty && (
                      <Badge className={getDifficultyColor(post.content.difficulty)} variant="outline">
                        {post.content.difficulty}
                      </Badge>
                    )}
                    <span className="text-sm text-gray-600">
                      {post.contentType === 'quiz' 
                        ? `${post.content.questionCount} questions`
                        : `${post.content.cardCount} cards`
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {post.contentType === 'summary' && post.content && (
          <Link href={`/community/${post._id}`}>
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100 cursor-pointer hover:shadow-md transition-shadow">
              <div className="mb-2 font-bold text-gray-900">Analytics Summary</div>
              <pre className="whitespace-pre-wrap text-sm text-gray-800">{post.content}</pre>
              <Button className="mt-2 w-full">View & Comment</Button>
            </div>
          </Link>
        )}

        {/* Actions */}
        <div className="flex items-center gap-6 pt-6 border-t">
          {/* Post Deletion Button (owner only) */}
          {currentUserId === post.author._id && (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-lg text-red-600 font-semibold shadow-sm hover:bg-red-50"
              onClick={async () => {
                if (window.confirm('Delete this post? This cannot be undone.')) {
                  if (!user) return;
                  const token = await user.getIdToken();
                  await fetch(`/api/posts/${post._id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  window.location.reload();
                }
              }}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-lg font-semibold shadow-sm ${liked ? 'text-red-600' : 'text-gray-600'} hover:bg-indigo-50`}
            onClick={handleLike}
            disabled={liking}
          >
            <Heart className={`w-5 h-5 mr-2 ${liked ? 'fill-current' : ''}`} />
            {likeCount}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="rounded-lg font-semibold shadow-sm text-gray-600 hover:bg-indigo-50"
            onClick={() => onComment?.(post._id)}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            {post.commentCount}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="rounded-lg font-semibold shadow-sm text-gray-600 ml-auto hover:bg-indigo-50"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
