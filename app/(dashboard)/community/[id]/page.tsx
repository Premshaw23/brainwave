
// app/(dashboard)/community/[id]/page.tsx
'use client';

import { useEffect, useState,use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Share2, Brain, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import CommentSection from '@/components/community/CommentSection';
import Link from 'next/link';

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const {id}=use(params);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        setPost(data.post);
        setLiked(data.post.isLiked);
        setLikeCount(data.post.likeCount);
      }
    } catch (error) {
      console.error('Failed to fetch post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/posts/${id}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setLiked(data.isLiked);
        setLikeCount(data.likeCount);
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Community
      </Button>

      {/* Post Card */}
      <Card>
        <CardContent className="p-6">
          {/* Author */}
          <div className="flex items-center gap-3 mb-6">
            <Avatar>
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>
                {post.author.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">
                {post.author.displayName}
              </h4>
              <p className="text-sm text-gray-600">
                {post.author.totalXP.toLocaleString()} XP
              </p>
            </div>
            <Badge className="capitalize">{post.contentType}</Badge>
          </div>

          {/* Caption */}
          {post.caption && (
            <p className="text-gray-700 mb-6 text-lg">{post.caption}</p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <Button
              variant={liked ? 'default' : 'outline'}
              onClick={handleLike}
            >
              <Heart className={`w-4 h-4 mr-2 ${liked ? 'fill-current' : ''}`} />
              {likeCount} Likes
            </Button>
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Content Details */}
          {post.content && (
            <Card className="bg-linear-to-br from-indigo-50 to-purple-50 border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-6 h-6 text-indigo-600" />
                  {post.content.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="capitalize">{post.content.subject}</Badge>
                  {post.content.difficulty && (
                    <Badge variant="outline" className="capitalize">
                      {post.content.difficulty}
                    </Badge>
                  )}
                </div>

                {/* Quiz Content */}
                {post.contentType === 'quiz' && post.content.questions && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 mb-4">
                      {post.content.questions.length} questions
                    </p>
                    
                    {/* Preview first 3 questions */}
                    {post.content.questions.slice(0, 3).map((q: any, i: number) => (
                      <div key={i} className="bg-white rounded-lg p-4">
                        <p className="font-medium text-gray-900 mb-2">
                          {i + 1}. {q.question}
                        </p>
                        <div className="space-y-1">
                          {q.options.map((opt: string, j: number) => (
                            <p key={j} className="text-sm text-gray-600 pl-4">
                              {['A', 'B', 'C', 'D'][j]}. {opt}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}

                    <Link href={`/quizzes/${post.content._id}/take`}>
                      <Button className="w-full">
                        <Brain className="w-4 h-4 mr-2" />
                        Take This Quiz
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Flashcard Content */}
                {post.contentType === 'flashcard' && post.content.cards && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 mb-4">
                      {post.content.cards.length} flashcards
                    </p>

                    {/* Preview first 3 cards */}
                    {post.content.cards.slice(0, 3).map((card: any, i: number) => (
                      <div key={i} className="bg-white rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Front:</p>
                        <p className="font-medium text-gray-900 mb-3">{card.front}</p>
                        <p className="text-sm text-gray-600 mb-1">Back:</p>
                        <p className="text-gray-700">{card.back}</p>
                      </div>
                    ))}

                    <Button className="w-full">
                      Study These Flashcards
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle>Comments ({post.comments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <CommentSection
            postId={id}
            initialComments={post.comments}
          />
        </CardContent>
      </Card>
    </div>
  );
}
