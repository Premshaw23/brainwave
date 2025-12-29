// app/(dashboard)/groups/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './../../../context/AuthContext';
import { Users as UsersIcon, Loader2, UserPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import CreateGroupModal from '@/components/groups/CreateGroupModal';
import JoinGroupModal from '@/components/groups/JoinGroupModal';

export default function GroupsPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchGroups(user);
    }
  }, [user]);

  const fetchGroups = async (user: any) => {
    try {
      if (!user) return;
      const token = await user.getIdToken();
      const response = await fetch('/api/groups', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setGroups(data.groups);
      }
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-linear-to-r from-indigo-50 to-white rounded-xl p-6 shadow-sm mb-2">
        <div>
          <h1 className="text-4xl font-extrabold text-indigo-800 tracking-tight">Study Groups</h1>
          <p className="text-gray-600 mt-2 text-lg">Collaborate and learn together</p>
        </div>
        <div className="flex gap-3">
          <JoinGroupModal />
          <CreateGroupModal />
        </div>
      </div>

      {groups.length === 0 ? (
        <Card className="border-2 border-dashed border-indigo-200 bg-white/80 shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <UsersIcon className="w-20 h-20 text-indigo-200 mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No study groups yet</h3>
            <p className="text-gray-500 text-center max-w-md mb-8 text-base">
              Create your first study group or join an existing one with an invite code.
            </p>
            <div className="flex gap-3">
              <JoinGroupModal />
              <CreateGroupModal />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groups.map((group) => (
            <Link key={group._id} href={`/groups/${group._id}`} className="group">
              <Card className="hover:shadow-2xl hover:border-indigo-200 border border-gray-100 transition-all duration-200 cursor-pointer bg-linear-to-br from-white via-indigo-50 to-indigo-100 group-hover:scale-[1.03]">
                <CardContent className="p-7">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-indigo-900 mb-1 group-hover:text-indigo-700 transition-colors">
                        {group.name}
                      </h3>
                      {group.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                          {group.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <UserPlus className="w-4 h-4 text-indigo-400" />
                      <span className="font-medium">{group.memberCount} members</span>
                    </div>
                    <Badge variant="outline" className="bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold tracking-wider px-3 py-1 rounded-lg">
                      {group.inviteCode}
                    </Badge>
                  </div>

                  <div className="mt-6 pt-4 border-t border-indigo-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-bold text-indigo-700 shadow">
                        {group.creator.displayName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs text-gray-500">
                        Created by <span className="font-semibold text-indigo-700">{group.creator.displayName}</span>
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}