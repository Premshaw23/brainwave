
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
    <Card className="bg-linear-to-br from-orange-500 to-red-500 text-white shadow-xl border-0 relative overflow-hidden">
      <CardContent className="p-6">
        {/* Decorative flame badge
        <div className="absolute top-4 right-4 flex items-center gap-1 z-10">
          <div className="bg-yellow-400 rounded-full p-2 shadow-lg border-2 border-white">
            <Flame className="w-6 h-6 text-orange-700 animate-pulse" />
          </div>
        </div> */}

        <div className="flex items-start justify-between mb-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white bg-opacity-20 text-orange-100 text-xs font-semibold tracking-wide shadow-sm">
                <Flame className="w-4 h-4 mr-1 text-yellow-300" />
                Daily Streak
              </span>
            </div>
            <h3 className="text-6xl font-extrabold drop-shadow-lg flex items-center gap-2">
              {currentStreak}
              {currentStreak > 0 && <span className="text-2xl">🔥</span>}
            </h3>
            <p className="text-base opacity-95 mt-2 font-medium">{getStreakMessage()}</p>
          </div>
          <div className="text-right">
            <div className="bg-white bg-opacity-20 rounded-lg p-2 mb-2 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-900" />
            </div>
            <p className="text-xs opacity-80 font-semibold">Best: <span className="text-yellow-200">{longestStreak} days</span></p>
          </div>
        </div>

        <div className="space-y-2 mt-2">
          <div className="flex justify-between text-xs opacity-85 font-semibold">
            <span>Progress to 30-day milestone</span>
            <span>{currentStreak}/30 days</span>
          </div>
          <div className="w-full bg-white bg-opacity-30 rounded-full h-3 shadow-inner">
            <div
              className="bg-linear-to-r from-yellow-300 to-orange-400 h-3 rounded-full transition-all duration-500 shadow-md"
              style={{ width: `${streakPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-5 text-xs opacity-85 font-semibold">
          <Calendar className="w-4 h-4" />
          <span>Last active: {new Date(lastActive).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
        </div>
      </CardContent>
    </Card>
  );
}
