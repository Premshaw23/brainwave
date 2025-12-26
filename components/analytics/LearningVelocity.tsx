
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
    <Card>
      <CardHeader>
        <CardTitle>Learning Velocity</CardTitle>
        <CardDescription>Your study habits and pace analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div 
                key={metric.label}
                className={`${metric.bgColor} rounded-lg p-4`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                  <span className="text-xs font-medium text-gray-600">
                    {metric.label}
                  </span>
                </div>
                <p className={`text-2xl font-bold ${metric.color}`}>
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