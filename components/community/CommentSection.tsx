
// components/community/CommentSection.tsx
'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '../../context/AuthContext';

interface Comment {
  _id: string;
  author: {
    _id: string;
    displayName: string;
    avatar?: string;
  };
  text: string;
  createdAt: string;
}

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
}

export default function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);

    try {
      if (!user) throw new Error('Not authenticated');
      const token = await user.getIdToken();
      const response = await fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newComment.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setComments([...comments, data.comment]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Failed to comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return new Date(date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
  };

  return (
    <div className="space-y-6 bg-linear-to-br from-white via-indigo-50 to-indigo-100 rounded-2xl shadow-lg p-8 border border-indigo-100">
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-4 items-start mb-4">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={loading}
          rows={2}
          className="flex-1 rounded-xl border border-indigo-200 bg-white shadow-sm text-base font-medium focus:ring-2 focus:ring-indigo-300 resize-none"
        />
        <Button
          type="submit"
          disabled={loading || !newComment.trim()}
          className="rounded-xl h-12 w-12 flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white shadow-md"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Send className="w-6 h-6" />
          )}
        </Button>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-center text-indigo-400 py-10 text-lg font-semibold">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4 items-start">
              <Avatar className="w-12 h-12 shadow-md">
                <AvatarImage src={comment.author.avatar} />
                <AvatarFallback className="bg-indigo-200 text-indigo-700 font-bold">
                  {comment.author.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-indigo-50 rounded-xl p-4 shadow-sm">
                  <h4 className="font-semibold text-base text-indigo-700 mb-1">
                    {comment.author.displayName}
                  </h4>
                  <p className="text-base text-gray-800 font-medium">{comment.text}</p>
                </div>
                <p className="text-xs text-gray-500 mt-2 ml-2">
                  {formatTimeAgo(comment.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}