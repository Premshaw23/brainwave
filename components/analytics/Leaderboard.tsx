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
    <Card className="bg-linear-to-br from-white via-indigo-50 to-indigo-100 shadow-2xl rounded-2xl border border-indigo-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-indigo-700 font-extrabold text-2xl">XP Leaderboard</CardTitle>
        <CardDescription className="text-indigo-400 font-semibold">Top learners on BrainWave</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboard.map((user) => (
            <div
              key={user._id ? `${user._id}-${user.rank}` : `${user.rank}-${user.displayName}`}
              className={`flex items-center gap-6 p-5 rounded-xl shadow-sm transition-all duration-150 ${
                user.isCurrentUser
                  ? 'bg-indigo-100 border-2 border-indigo-300 scale-[1.03]'
                  : 'bg-white hover:bg-indigo-50'
              }`}
            >
              <div className="flex items-center justify-center w-12">
                {getRankIcon(user.rank)}
              </div>

              <Avatar className="w-12 h-12 shadow-md">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-indigo-200 text-indigo-700 font-bold">
                  {user.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h4 className="font-bold text-indigo-700 text-lg flex items-center">
                  {user.displayName}
                  {user.isCurrentUser && (
                    <Badge className="ml-3 px-3 py-1 bg-indigo-600 text-white font-semibold rounded-xl shadow">You</Badge>
                  )}
                </h4>
                <p className="text-sm text-indigo-400 font-semibold">
                  {user.streak} day streak
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-extrabold text-indigo-700">
                  {user.totalXP.toLocaleString()}
                </p>
                <p className="text-xs text-indigo-400 font-semibold">XP</p>
              </div>
            </div>
          ))}
        </div>

        {userRank > 10 && (
          <div className="mt-6 p-5 bg-indigo-50 rounded-xl text-center shadow">
            <p className="text-base text-indigo-500 font-semibold">
              Your rank: <span className="font-bold text-indigo-700">#{userRank}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
