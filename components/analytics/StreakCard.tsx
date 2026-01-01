
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
      <CardContent className="p-4 sm:p-8">
        {/* Decorative flame badge */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 relative z-10 gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-xl bg-orange-200 text-orange-700 text-base font-bold tracking-wide shadow">
                <Flame className="w-5 h-5 mr-2 text-yellow-400" />
                Daily Streak
              </span>
            </div>
            <h3 className="text-5xl sm:text-7xl font-extrabold drop-shadow-lg flex items-center gap-3 text-orange-700">
              {currentStreak}
              {currentStreak > 0 && <span className="text-3xl">🔥</span>}
            </h3>
            <p className="text-xs text-orange-500 mt-1">Your streak resets to 0 if you miss a day.</p>
            <p className="text-lg mt-3 font-semibold text-orange-600">{getStreakMessage()}</p>
          </div>
          <div className="text-right shrink-0 w-full sm:w-auto">
            <div className="bg-orange-200 rounded-xl p-3 mb-3 flex items-center justify-center shadow-2xl">
              <TrendingUp className="w-7 h-7 text-orange-700" />
            </div>
            <p className="text-base font-bold text-orange-700">Best: <span className="text-yellow-500">{longestStreak} days</span></p>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <div className="flex flex-col sm:flex-row justify-between text-base font-semibold text-orange-700 gap-2 sm:gap-0">
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

        <div className="flex flex-col sm:flex-row items-center gap-3 mt-7 text-base font-semibold text-orange-700">
          <Calendar className="w-5 h-5" />
          <span>Last active: {new Date(lastActive).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
        </div>
      </CardContent>
    </Card>
  );
}
