// app/(dashboard)/analytics/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './../../../context/AuthContext';
import { Loader2 } from 'lucide-react';
import ProgressChart from '@/components/analytics/ProgressChart';
import MasteryChart from '@/components/analytics/MasteryChart';
import StreakCard from '@/components/analytics/StreakCard';
import WeakTopics from '@/components/analytics/WeakTopics';
import LearningVelocity from '@/components/analytics/LearningVelocity';
import RecentActivity from '@/components/analytics/RecentActivity';
import StatsCard from '@/components/dashboard/Statcard';
import Leaderboard from '@/components/analytics/Leaderboard';
import { Brain, Target, Flame, Trophy } from 'lucide-react';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const { user } = useAuth(); // Only call useAuth here

  useEffect(() => {
    if (user) {
      fetchAnalytics(user);
    }
  }, [user]);

  const fetchAnalytics = async (user: any) => {
    try {
      if (!user) return;
      const token = await user.getIdToken();
      
      // Fetch overview stats
      const overviewRes = await fetch('/api/analytics/overview', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const overviewData = await overviewRes.json();

      // Fetch progress data
      const progressRes = await fetch('/api/analytics/progress?timeframe=30days', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const progressData = await progressRes.json();

      setAnalyticsData({
        overview: overviewData.stats,
        progress: progressData.chartData || [],
        velocity: progressData.velocity || {},
        recentActivity: progressData.recentActivity || [],
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!analyticsData) {
    return <div>Failed to load analytics</div>;
  }

  const { overview, progress, velocity, recentActivity } = analyticsData;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Track your learning progress and insights</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Quizzes"
          value={overview.totalQuizzes || 0}
          icon={Brain}
          color="bg-indigo-500"
        />
        <StatsCard
          title="Avg Accuracy"
          value={`${overview.avgAccuracy || 0}%`}
          icon={Target}
          color="bg-green-500"
        />
        <StatsCard
          title="Current Streak"
          value={`${overview.streak || 0} days`}
          icon={Flame}
          color="bg-orange-500"
        />
        <StatsCard
          title="Total XP"
          value={overview.totalXP || 0}
          icon={Trophy}
          color="bg-yellow-500"
        />
      </div>

      {/* Streak Card */}
      <StreakCard
        currentStreak={overview.streak || 0}
        longestStreak={overview.longestStreak || overview.streak || 0}
        lastActive={new Date().toISOString()}
      />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressChart data={progress} />
        <MasteryChart data={overview.masteryBySubject || []} />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LearningVelocity stats={velocity} />
        <WeakTopics topics={overview.masteryBySubject || []} />
      </div>

      {/* Recent Activity */}
      <RecentActivity activities={recentActivity} />

      <Leaderboard />
    </div>
  );
}