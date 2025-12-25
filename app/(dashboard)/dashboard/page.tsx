
// app/(dashboard)/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import StatsCard from '@/components/dashboard/Statcard';
import { Brain, Target, Flame, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your learning overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Quizzes"
          value={stats?.totalQuizzes || 0}
          icon={Brain}
          color="bg-indigo-500"
        />
        <StatsCard
          title="Avg Accuracy"
          value={`${stats?.avgAccuracy || 0}%`}
          icon={Target}
          color="bg-green-500"
        />
        <StatsCard
          title="Day Streak"
          value={stats?.streak || 0}
          icon={Flame}
          color="bg-orange-500"
        />
        <StatsCard
          title="Total XP"
          value={stats?.totalXP || 0}
          icon={Trophy}
          color="bg-yellow-500"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/notes">
            <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
              <Brain className="w-6 h-6" />
              <span>Upload Notes</span>
            </Button>
          </Link>
          <Link href="/quizzes">
            <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
              <Target className="w-6 h-6" />
              <span>Take Quiz</span>
            </Button>
          </Link>
          <Link href="/groups">
            <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
              <Trophy className="w-6 h-6" />
              <span>Join Study Group</span>
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Mastery by Subject */}
      {stats?.masteryBySubject && stats.masteryBySubject.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mastery by Subject</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.masteryBySubject.map((subject: any) => (
                <div key={subject.subject} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium capitalize">{subject.subject}</span>
                    <span className="text-gray-600">{subject.mastery}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
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
