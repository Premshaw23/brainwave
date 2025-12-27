// components/community/PostCard.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, Trophy, Brain, Calendar } from 'lucide-react';
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
    };
    contentType: 'quiz' | 'flashcard';
    content: any;
    caption: string;
    likeCount: number;
    commentCount: number;
    isLiked: boolean;
    createdAt: string;
  };
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
}

export default function PostCard({ post, onLike, onComment }: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [liking, setLiking] = useState(false);

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);

    try {
      const token = localStorage.getItem('authToken');
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
    return new Date(date).toLocaleDateString();
  };

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'easy') return 'bg-green-100 text-green-800';
    if (difficulty === 'medium') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        {/* Author Header */}
        <div className="flex items-center gap-3 mb-4">
          <Link href={`/profile/${post.author._id}`}>
            <Avatar className="cursor-pointer">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>
                {post.author.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1">
            <Link href={`/profile/${post.author._id}`}>
              <h4 className="font-semibold text-gray-900 hover:text-indigo-600">
                {post.author.displayName}
              </h4>
            </Link>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              {formatTimeAgo(post.createdAt)}
            </div>
          </div>
          <Badge variant="outline" className="capitalize">
            {post.contentType}
          </Badge>
        </div>

        {/* Caption */}
        {post.caption && (
          <p className="text-gray-700 mb-4">{post.caption}</p>
        )}

        {/* Content Preview */}
        {post.content && (
          <Link href={`/community/${post._id}`}>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 mb-4 cursor-pointer hover:shadow-md transition-shadow border border-indigo-100">
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

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={liking}
            className={liked ? 'text-red-600' : 'text-gray-600'}
          >
            <Heart className={`w-4 h-4 mr-1 ${liked ? 'fill-current' : ''}`} />
            {likeCount}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onComment?.(post._id)}
            className="text-gray-600"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            {post.commentCount}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 ml-auto"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
