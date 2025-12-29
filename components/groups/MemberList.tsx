
// components/groups/MemberList.tsx
'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Circle } from 'lucide-react';
import { useSocket } from '@/lib/socket';

interface Member {
  _id: string;
  displayName: string;
  avatar?: string;
  totalXP: number;
  isCreator?: boolean;
}

interface MemberListProps {
  groupId: string;
  members: Member[];
  creatorId: string;
}

export default function MemberList({ groupId, members, creatorId }: MemberListProps) {
  const { socket } = useSocket();
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!socket) return;

    // Request online members
    socket.emit('get_online_members', { groupId });

    // Listen for online members updates
    socket.on('online_members', ({ members: online }) => {
      setOnlineUsers(new Set(online.map((m: any) => m.userId)));
    });

    socket.on('user_joined', ({ userId }) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
    });

    socket.on('user_left', ({ userId }) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    });

    return () => {
      socket.off('online_members');
      socket.off('user_joined');
      socket.off('user_left');
    };
  }, [socket, groupId]);

  return (
    <Card className="bg-linear-to-br from-white via-indigo-50 to-indigo-100 shadow-2xl rounded-2xl border border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-indigo-700 tracking-tight">
          Members ({members.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => {
            const isOnline = onlineUsers.has(member._id);
            const isCreator = member._id === creatorId;

            return (
              <div
                key={member._id}
                className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-sm hover:bg-indigo-50 transition-all duration-150"
              >
                <div className="relative">
                  <Avatar className="w-10 h-10 shadow-md">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>
                      {member.displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      isOnline ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold text-gray-900 truncate">
                      {member.displayName}
                    </p>
                    {isCreator && (
                      <Crown className="w-5 h-5 text-yellow-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {member.totalXP.toLocaleString()} XP
                  </p>
                </div>

                <Badge variant={isOnline ? 'default' : 'outline'} className={`text-xs px-3 py-1 rounded-lg ${isOnline ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}