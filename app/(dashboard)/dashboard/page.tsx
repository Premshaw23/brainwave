// ENHANCED DASHBOARD WITH MINI ANALYTICS
// app/(dashboard)/dashboard/page.tsx - UPDATED VERSION

'use client';

import { useEffect, useState } from 'react';
import StatsCard from '@/components/dashboard/Statcard';
import { Brain, Target, Flame, Trophy, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await fetch('/api/analytics/overview', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const getStreakMessage = () => {
    const streak = stats?.streak || 0;
    if (streak >= 7) return "Amazing streak! 🔥";
    if (streak >= 3) return "Keep it going! 💪";
    if (streak === 0) return "Start today! 📚";
    return "Nice work! 🌟";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your learning overview.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Quizzes"
          value={stats?.totalQuizzes || 0}
          icon={Brain}
          color="bg-indigo-500"
          trend={stats?.totalQuizzes > 0 ? "+12% this week" : undefined}
        />
        <StatsCard
          title="Avg Accuracy"
          value={`${stats?.avgAccuracy || 0}%`}
          icon={Target}
          color="bg-green-500"
          trend={stats?.avgAccuracy >= 70 ? "Above average! 🎯" : "Keep practicing!"}
        />
        <StatsCard
          title="Day Streak"
          value={stats?.streak || 0}
          icon={Flame}
          color="bg-orange-500"
          trend={getStreakMessage()}
        />
        <StatsCard
          title="Total XP"
          value={stats?.totalXP || 0}
          icon={Trophy}
          color="bg-yellow-500"
          trend={stats?.totalXP > 0 ? "Leveling up! 🚀" : undefined}
        />
      </div>

      {/* Streak Progress */}
      {stats?.streak > 0 && (
        <Card className="bg-linear-to-r from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500 p-2 rounded-lg">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {stats.streak} Day Streak!
                  </h3>
                  <p className="text-sm text-gray-600">Keep learning daily to maintain it</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Goal: 30 days</p>
                <p className="text-xs text-gray-500">Best: {stats.longestStreak || stats.streak}</p>
              </div>
            </div>
            <Progress value={(stats.streak / 30) * 100} className="h-3" />
            <p className="text-xs text-gray-600 mt-2 text-right">
              {30 - stats.streak} days to milestone
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/notes">
            <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:border-indigo-500 hover:bg-indigo-50">
              <Brain className="w-6 h-6 text-indigo-600" />
              <span className="font-medium">Upload Notes</span>
            </Button>
          </Link>
          <Link href="/quizzes">
            <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:border-green-500 hover:bg-green-50">
              <Target className="w-6 h-6 text-green-600" />
              <span className="font-medium">Take Quiz</span>
            </Button>
          </Link>
          <Link href="/analytics">
            <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:border-purple-500 hover:bg-purple-50">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <span className="font-medium">View Analytics</span>
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Subject Mastery Preview */}
      {stats?.masteryBySubject && stats.masteryBySubject.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Subject Mastery</CardTitle>
            <Link href="/analytics">
              <Button variant="ghost" size="sm">View Details →</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.masteryBySubject.slice(0, 4).map((subject: any) => (
                <div key={subject.subject} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium capitalize">{subject.subject}</span>
                    <span className="text-gray-600">{subject.mastery}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        subject.mastery >= 80 ? 'bg-green-600' :
                        subject.mastery >= 60 ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}
                      style={{ width: `${subject.mastery}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}