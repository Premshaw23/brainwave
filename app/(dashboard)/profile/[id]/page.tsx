
// app/(dashboard)/profile/[id]/page.tsx
'use client';

import { use, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trophy, Brain, Flame, Calendar, Loader2,Target } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PostCard from '@/components/community/PostCard';

export default function UserProfilePage({ params }: { params: Promise<{ id: string } >}) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ displayName: '', avatar: '', studyInterests: '' });
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const {id}=use(params);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setProfile(data.profile);
        setEditForm({
          displayName: data.profile.displayName || '',
          avatar: data.profile.avatar || '',
          studyInterests: (data.profile.studyInterests || []).join(', '),
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
    if (e.target.name === 'avatar') {
      setAvatarPreview(e.target.value);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName: editForm.displayName,
          avatar: editForm.avatar,
          studyInterests: editForm.studyInterests.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProfile((prev: any) => ({ ...prev, ...data.user, studyInterests: data.user.studyInterests }));
        setEditOpen(false);
      } else {
        setEditError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      setEditError('Failed to update profile');
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!profile) {
    return <div>User not found</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 px-2 sm:px-4 md:px-0">
      {/* Profile Section */}
      <Card className="shadow-lg border-0 bg-white">
        <CardContent className="p-6 md:p-10 flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
          <div className="flex flex-col items-center gap-3 md:gap-6">
            <Avatar className="w-28 h-28 md:w-36 md:h-36 ring-4 ring-indigo-200 shadow-lg">
              <AvatarImage src={profile.avatar} className="object-cover w-full h-full" />
              <AvatarFallback className="text-4xl md:text-5xl">
                {profile.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="shadow"
                >
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Display Name</label>
                    <Input
                      name="displayName"
                      value={editForm.displayName}
                      onChange={handleEditChange}
                      required
                      maxLength={32}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Avatar</label>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-full border-2 border-indigo-200 shadow overflow-hidden bg-white flex items-center justify-center">
                          {avatarPreview || editForm.avatar ? (
                            <img
                              src={avatarPreview || editForm.avatar}
                              alt="Avatar Preview"
                              className="w-full h-full object-cover"
                              onError={e => (e.currentTarget.style.display = 'none')}
                            />
                          ) : (
                            <span className="text-2xl text-indigo-400">?</span>
                          )}
                        </div>
                        {avatarUploading && <span className="text-xs text-indigo-500">Uploading...</span>}
                      </div>
                      <div className="flex-1 w-full flex flex-col gap-2">
                        <Input
                          name="avatar"
                          value={editForm.avatar}
                          onChange={handleEditChange}
                          placeholder="https://..."
                        />
                        <label className="inline-block cursor-pointer text-xs font-medium bg-indigo-50 border border-indigo-200 px-2 py-1 rounded hover:bg-indigo-100 w-fit">
                          Upload Image
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setAvatarUploading(true);
                              setAvatarPreview(URL.createObjectURL(file));
                              const formData = new FormData();
                              formData.append('file', file);
                              try {
                                const res = await fetch('/api/upload-avatar', {
                                  method: 'POST',
                                  body: formData,
                                });
                                const data = await res.json();
                                if (data.success && data.url) {
                                  setEditForm(f => ({ ...f, avatar: data.url }));
                                  setAvatarPreview(data.url);
                                } else {
                                  alert('Upload failed');
                                }
                              } catch {
                                alert('Upload failed');
                              } finally {
                                setAvatarUploading(false);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Study Interests</label>
                    <Input
                      name="studyInterests"
                      value={editForm.studyInterests}
                      onChange={handleEditChange}
                      placeholder="e.g. Math, Science, History"
                    />
                    <div className="text-xs text-gray-500 mt-1">Comma separated</div>
                  </div>
                  {editError && <div className="text-red-600 text-sm">{editError}</div>}
                  <DialogFooter>
                    <Button type="submit" disabled={editLoading}>
                      {editLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <DialogClose asChild>
                      <Button type="button" variant="ghost">Cancel</Button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex-1 w-full flex flex-col gap-2 md:gap-4 justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-2">
              {profile.displayName}
              <span className="text-xs font-normal text-gray-400">@{profile._id.slice(-6)}</span>
            </h1>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Joined {new Date(profile.createdAt).toLocaleDateString()}
              </span>
            </div>
            {profile.studyInterests && profile.studyInterests.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {profile.studyInterests.map((interest: string) => (
                  <Badge key={interest} className="capitalize bg-indigo-100 text-indigo-700 border-none">
                    {interest}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <Card className="shadow border-0 bg-white">
        <CardContent className="p-4 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center gap-1">
              <Trophy className="w-8 h-8 text-yellow-600 mb-1" />
              <span className="text-xl font-bold text-gray-900">{profile.totalXP}</span>
              <span className="text-xs text-gray-600">Total XP</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Flame className="w-8 h-8 text-orange-600 mb-1" />
              <span className="text-xl font-bold text-gray-900">{profile.streak}</span>
              <span className="text-xs text-gray-600">Day Streak</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Brain className="w-8 h-8 text-indigo-600 mb-1" />
              <span className="text-xl font-bold text-gray-900">{profile.stats.totalQuizzes}</span>
              <span className="text-xs text-gray-600">Quizzes Taken</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Target className="w-8 h-8 text-green-600 mb-1" />
              <span className="text-xl font-bold text-gray-900">{profile.stats.avgScore}%</span>
              <span className="text-xs text-gray-600">Avg Score</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Posts Section */}
      <Card className="shadow border-0 bg-white">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-indigo-800 mb-4">Recent Posts</h2>
          {profile.recentPosts && profile.recentPosts.length > 0 ? (
            <div className="space-y-4">
              {profile.recentPosts.map((post: any) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">No posts yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
