// app/(dashboard)/community/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Loader2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PostCard from '@/components/community/PostCard';
import CommunityFilters from '@/components/community/CommutyFilter';

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({ subject: 'all', type: 'all' });

  useEffect(() => {
    fetchPosts(1, filters);
  }, [filters]);

  const fetchPosts = async (pageNum: number, currentFilters: any) => {
    try {
      const token = localStorage.getItem('authToken');
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '10',
      });

      if (currentFilters.subject !== 'all') {
        params.append('subject', currentFilters.subject);
      }
        if (currentFilters.type !== 'all') {
          params.append('contentType', currentFilters.type);
        }

      const response = await fetch(`/api/posts?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        if (pageNum === 1) {
          setPosts(data.posts);
        } else {
          setPosts([...posts, ...data.posts]);
        }
        setHasMore(data.pagination.page < data.pagination.pages);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectChange = (subject: string) => {
    setLoading(true);
    setFilters({ ...filters, subject });
  };

  const handleTypeChange = (type: string) => {
    setLoading(true);
    setFilters({ ...filters, type });
  };

  const loadMore = () => {
    fetchPosts(page + 1, filters);
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community</h1>
          <p className="text-gray-600 mt-1">Discover and share study materials</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <CommunityFilters
          subject={filters.subject}
          type={filters.type}
          onSubjectChange={handleSubjectChange}
          onTypeChange={handleTypeChange}
        />
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center border-dashed border-2">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No posts yet
          </h3>
          <p className="text-gray-600">
            Be the first to share your study materials with the community!
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center">
              <Button onClick={loadMore} variant="outline">
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
