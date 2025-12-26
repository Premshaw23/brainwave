
// components/analytics/StreakCard.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Flame, TrendingUp, Calendar } from 'lucide-react';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  lastActive: string;
}

export default function StreakCard({ currentStreak, longestStreak, lastActive }: StreakCardProps) {
  const getStreakMessage = () => {
    if (currentStreak >= 30) return "Incredible dedication! 🔥";
    if (currentStreak >= 14) return "You're on fire! 🌟";
    if (currentStreak >= 7) return "Great consistency! 💪";
    if (currentStreak >= 3) return "Building momentum! 🚀";
    return "Start your streak today! 📚";
  };

  const streakPercentage = Math.min((currentStreak / 30) * 100, 100);

  return (
    <Card className="bg-linear-to-br from-orange-500 to-red-500 text-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">Daily Streak</span>
            </div>
            <h3 className="text-5xl font-bold">{currentStreak}</h3>
            <p className="text-sm opacity-90 mt-1">{getStreakMessage()}</p>
          </div>
          <div className="text-right">
            <div className="bg-white bg-opacity-20 rounded-lg p-2 mb-2">
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-xs opacity-75">Best: {longestStreak} days</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs opacity-75">
            <span>Progress to 30-day milestone</span>
            <span>{currentStreak}/30 days</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${streakPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 text-xs opacity-75">
          <Calendar className="w-4 h-4" />
          <span>Last active: {new Date(lastActive).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
