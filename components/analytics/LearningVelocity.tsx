
// components/analytics/LearningVelocity.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp, Clock, Target, Zap } from 'lucide-react';

interface LearningVelocityProps {
  stats: {
    questionsPerDay: number;
    averageTimePerQuiz: number;
    improvementRate: number;
    totalTimeSpent: number;
  };
}

export default function LearningVelocity({ stats }: LearningVelocityProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const metrics = [
    {
      label: 'Questions/Day',
      value: stats.questionsPerDay.toFixed(1),
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Avg Time/Quiz',
      value: formatTime(stats.averageTimePerQuiz),
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Improvement Rate',
      value: `+${stats.improvementRate}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Total Study Time',
      value: formatTime(stats.totalTimeSpent),
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <Card className="bg-linear-to-br from-white via-indigo-50 to-indigo-100 shadow-2xl rounded-2xl border border-indigo-100">
      <CardHeader>
        <CardTitle className="text-indigo-700 font-extrabold text-2xl">Learning Velocity</CardTitle>
        <CardDescription className="text-indigo-400 font-semibold">Your study habits and pace analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div 
                key={metric.label}
                className={`${metric.bgColor} rounded-xl p-6 shadow-md transition-all duration-150 hover:scale-[1.03] w-full`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon className={`w-7 h-7 ${metric.color} drop-shadow`} />
                  <span className="text-base font-semibold text-indigo-500">
                    {metric.label}
                  </span>
                </div>
                <p className={`text-3xl font-extrabold ${metric.color} drop-shadow`}> 
                  {metric.value}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}