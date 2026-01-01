
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
    <Card className="bg-linear-to-br from-white via-indigo-50 to-indigo-100 shadow-2xl rounded-2xl border border-gray-200 p-2 sm:p-4">
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl font-bold text-indigo-700 tracking-tight">
          Members ({members.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-2 sm:space-y-4">
          {members.map((member) => {
            const isOnline = onlineUsers.has(member._id);
            const isCreator = member._id === creatorId;

            return (
              <div
                key={member._id}
                className="flex items-center gap-2 sm:gap-4 p-2 sm:p-4 rounded-xl bg-white shadow-sm hover:bg-indigo-50 transition-all duration-150"
              >
                <div className="relative">
                  <Avatar className="w-9 h-9 sm:w-10 sm:h-10 shadow-md">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>
                      {member.displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white ${
                      isOnline ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                      {member.displayName}
                    </p>
                    {isCreator && (
                      <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {member.totalXP.toLocaleString()} XP
                  </p>
                </div>

                <Badge variant={isOnline ? 'default' : 'outline'} className={`text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg ${isOnline ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
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