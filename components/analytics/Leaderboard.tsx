// components/analytics/Leaderboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trophy, Medal, Award } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../../context/AuthContext';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<number>(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchLeaderboard();
    }
  }, [user]);

  const fetchLeaderboard = async () => {
    if (!user) return;
    const token = await user.getIdToken();
    const response = await fetch('/api/analytics/leaderboard', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (data.success) {
      setLeaderboard(data.leaderboard);
      setUserRank(data.currentUserRank);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-500" />;
    return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>XP Leaderboard</CardTitle>
        <CardDescription>Top learners on BrainWave</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboard.map((user) => (
            <div
              key={user._id ? `${user._id}-${user.rank}` : `${user.rank}-${user.displayName}`}
              className={`flex items-center gap-4 p-4 rounded-lg ${
                user.isCurrentUser
                  ? 'bg-indigo-50 border-2 border-indigo-300'
                  : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center w-10">
                {getRankIcon(user.rank)}
              </div>

              <Avatar>
                <AvatarImage src={user.avatar} />
                <AvatarFallback>
                  {user.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">
                  {user.displayName}
                  {user.isCurrentUser && (
                    <Badge className="ml-2 bg-indigo-600">You</Badge>
                  )}
                </h4>
                <p className="text-sm text-gray-600">
                  {user.streak} day streak
                </p>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold text-indigo-600">
                  {user.totalXP.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">XP</p>
              </div>
            </div>
          ))}
        </div>

        {userRank > 10 && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              Your rank: <span className="font-bold text-gray-900">#{userRank}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
