
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
    <Card className="bg-linear-to-br from-orange-100 via-orange-200 to-red-100 text-orange-900 shadow-2xl border-0 rounded-2xl relative overflow-hidden">
      <CardContent className="p-8">
        {/* Decorative flame badge
        <div className="absolute top-6 right-8 flex items-center gap-1 z-10">
          <div className="bg-yellow-400 rounded-full p-3 shadow-lg border-2 border-white">
            <Flame className="w-8 h-8 text-orange-700 animate-pulse" />
          </div>
        </div> */}

        <div className="flex items-start justify-between mb-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-xl bg-orange-200 text-orange-700 text-base font-bold tracking-wide shadow">
                <Flame className="w-5 h-5 mr-2 text-yellow-400" />
                Daily Streak
              </span>
            </div>
            <h3 className="text-7xl font-extrabold drop-shadow-lg flex items-center gap-3 text-orange-700">
              {currentStreak}
              {currentStreak > 0 && <span className="text-3xl">🔥</span>}
            </h3>
            <p className="text-lg mt-3 font-semibold text-orange-600">{getStreakMessage()}</p>
          </div>
          <div className="text-right">
            <div className="bg-orange-200 rounded-xl p-3 mb-3 flex items-center justify-center shadow-2xl">
              <TrendingUp className="w-7 h-7 text-orange-700" />
            </div>
            <p className="text-base font-bold text-orange-700">Best: <span className="text-yellow-500">{longestStreak} days</span></p>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <div className="flex justify-between text-base font-semibold text-orange-700">
            <span>Progress to 30-day milestone</span>
            <span>{currentStreak}/30 days</span>
          </div>
          <div className="w-full bg-orange-200 rounded-full h-4 shadow-inner">
            <div
              className="bg-linear-to-r from-yellow-300 to-orange-400 h-4 rounded-full transition-all duration-500 shadow-md"
              style={{ width: `${streakPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-7 text-base font-semibold text-orange-700">
          <Calendar className="w-5 h-5" />
          <span>Last active: {new Date(lastActive).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
        </div>
      </CardContent>
    </Card>
  );
}
