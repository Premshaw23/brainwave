// app/(dashboard)/bookmarks/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Bookmark, Loader2 } from 'lucide-react';
import PostCard from '@/components/community/PostCard';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchBookmarks();
  }, []);
  
  const fetchBookmarks = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/bookmarks', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setBookmarks(data.bookmarks);
      }
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (!loading) {
      // console.log('[BookmarksPage] bookmarks:', bookmarks);
    }
  }, [bookmarks]);
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Bookmark className="w-8 h-8" />
          Bookmarks
        </h1>
        <p className="text-gray-600 mt-1">Posts you've saved for later</p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No bookmarks yet
          </h3>
          <p className="text-gray-600">
            Save posts you want to come back to later
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookmarks.map((post) => {
            if (!post || !post._id || !post.userId || !post.userId._id) return null;
            // Normalize post fields for PostCard
            const normalized = {
              _id: post._id,
              author: post.userId,
              contentType: post.contentType,
              content: post.content,
              caption: post.caption || '',
              likeCount: post.likes ? post.likes.length : (post.likeCount || 0),
              commentCount: post.comments ? post.comments.length : (post.commentCount || 0),
              isLiked: post.likes ? post.likes.includes(post.userId._id) : false,
              createdAt: post.createdAt,
              contentId: post.contentId,
              isBookmarked: true,
            };
            return <PostCard key={post._id} post={normalized} />;
          })}
        </div>
      )}
    </div>
  );
}