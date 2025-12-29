// ============================================
// 1. SETTINGS PAGE
// ============================================

// app/(dashboard)/settings/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { showError, showSuccess } from '@/lib/toast';
import { User, Bell, Lock, Palette, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../../../context/AuthContext';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Profile settings
  const [displayName, setDisplayName] = useState('');
  const [studyInterests, setStudyInterests] = useState<string[]>([]);

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [groupNotifications, setGroupNotifications] = useState(true);
  const [commentNotifications, setCommentNotifications] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [authUser]);

  const fetchUser = async () => {
    try {
      if (!authUser) return;
      const token = await authUser.getIdToken();
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        setDisplayName(data.user.displayName);
        setStudyInterests(data.user.studyInterests || []);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      if (!authUser) throw new Error('Not authenticated');
      const token = await authUser.getIdToken();
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName,
          studyInterests,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Profile updated successfully!');
        showSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to update profile');
        showError(data.error || 'Failed to update profile');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      showError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const addInterest = (interest: string) => {
    if (interest && !studyInterests.includes(interest)) {
      setStudyInterests([...studyInterests, interest]);
    }
  };

  const removeInterest = (interest: string) => {
    setStudyInterests(studyInterests.filter(i => i !== interest));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-linear-to-r from-indigo-50 to-white rounded-xl p-6 shadow-sm mb-2">
        <h1 className="text-4xl font-extrabold text-indigo-800 tracking-tight">Settings</h1>
        <p className="text-gray-600 mt-2 text-lg">Manage your account and preferences</p>
      </div>

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-indigo-50 border border-indigo-100 rounded-lg mb-4">
          <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:text-indigo-800">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:text-indigo-800">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-white data-[state=active]:text-indigo-800">
            <Palette className="w-4 h-4 mr-2" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-white data-[state=active]:text-indigo-800">
            <Lock className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="border border-indigo-100 bg-white/90">
            <CardHeader>
              <CardTitle className="text-indigo-800">Profile Information</CardTitle>
              <CardDescription>Update your public profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-2xl">
                    {user?.displayName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                  <p className="text-xs text-gray-500">
                    Member since {(() => {
                      if (!user?.createdAt) return 'Unknown';
                      const date = new Date(user.createdAt);
                      return isNaN(date.getTime()) ? 'Unknown' : date.toLocaleDateString();
                    })()}
                  </p>
                </div>
              </div>

              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                />
              </div>

              {/* Study Interests */}
              <div className="space-y-2">
                <Label>Study Interests</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {studyInterests.map((interest) => (
                    <Badge key={interest} className="capitalize bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {interest}
                      <button
                        onClick={() => removeInterest(interest)}
                        className="ml-2 hover:text-red-600"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  {['Mathematics', 'Science', 'History', 'Programming'].map((subject) => (
                    !studyInterests.includes(subject.toLowerCase()) && (
                      <Button
                        key={subject}
                        variant="outline"
                        size="sm"
                        className="border-indigo-200 text-indigo-700"
                        onClick={() => addInterest(subject.toLowerCase())}
                      >
                        + {subject}
                      </Button>
                    )
                  ))}
                </div>
              </div>

              <Button onClick={handleSaveProfile} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg">
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="border border-indigo-100 bg-white/90">
            <CardHeader>
              <CardTitle className="text-indigo-800">Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive updates via email</p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Group Messages</p>
                  <p className="text-sm text-gray-500">Get notified of new group messages</p>
                </div>
                <Switch
                  checked={groupNotifications}
                  onCheckedChange={setGroupNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Comments & Likes</p>
                  <p className="text-sm text-gray-500">When someone interacts with your posts</p>
                </div>
                <Switch
                  checked={commentNotifications}
                  onCheckedChange={setCommentNotifications}
                />
              </div>

              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg">
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card className="border border-indigo-100 bg-white/90">
            <CardHeader>
              <CardTitle className="text-indigo-800">App Preferences</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Dark Mode</p>
                  <p className="text-sm text-gray-500">Use dark theme (Coming soon)</p>
                </div>
                <Switch disabled />
              </div>

              <div className="space-y-2">
                <Label>Default Study Subject</Label>
                <select className="w-full p-2 border rounded-lg border-indigo-200">
                  <option>All Subjects</option>
                  <option>Mathematics</option>
                  <option>Science</option>
                  <option>History</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="border border-indigo-100 bg-white/90">
            <CardHeader>
              <CardTitle className="text-indigo-800">Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="font-medium text-gray-900 mb-2">Password</p>
                <p className="text-sm text-gray-500 mb-4">
                  Your password is managed through Firebase Authentication
                </p>
                <Button variant="outline" className="border-indigo-200 text-indigo-700">Change Password</Button>
              </div>

              <div>
                <p className="font-medium text-gray-900 mb-2">Delete Account</p>
                <p className="text-sm text-gray-500 mb-4">
                  Permanently delete your account and all data
                </p>
                <Button variant="destructive" className="w-full">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
