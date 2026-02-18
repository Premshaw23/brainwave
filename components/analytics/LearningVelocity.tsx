// components/analytics/LearningVelocity.tsx
'use client';

import { TrendingUp, Clock, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LearningVelocityProps {
  stats: {
    questionsPerDay?: number;
    averageTimePerQuiz?: number;
    improvementRate?: number;
    totalTimeSpent?: number;
  };
}

export default function LearningVelocity({ stats = {} }: LearningVelocityProps) {
  const formatTime = (seconds: number = 0) => {
    if (!seconds) return '0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const metrics = [
    {
      label: 'Absorption Rate',
      value: `${(stats?.questionsPerDay || 0).toFixed(1)} Q/D`,
      icon: Target,
      color: 'text-blue-500',
      description: 'Questions per day processed'
    },
    {
      label: 'Session Pace',
      value: formatTime(stats?.averageTimePerQuiz || 0),
      icon: Clock,
      color: 'text-emerald-500',
      description: 'Average duration per quiz'
    },
    {
      label: 'Scaling Velocity',
      value: `+${stats?.improvementRate || 0}%`,
      icon: TrendingUp,
      color: 'text-primary',
      description: 'Week-over-week growth'
    },
    {
      label: 'Synthesis Time',
      value: formatTime(stats?.totalTimeSpent || 0),
      icon: Zap,
      color: 'text-amber-500',
      description: 'Cumulative cognitive load'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {metrics.map((metric, i) => {
        const Icon = metric.icon;
        return (
          <div
            key={i}
            className="p-5 rounded-[1.5rem] bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-all group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={cn("p-2 rounded-xl bg-background shadow-sm group-hover:scale-110 transition-transform", metric.color)}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 group-hover:text-muted-foreground transition-colors text-nowrap">
                {metric.label}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-black text-foreground tracking-tight">
                {metric.value}
              </p>
              <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest leading-none">
                {metric.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}