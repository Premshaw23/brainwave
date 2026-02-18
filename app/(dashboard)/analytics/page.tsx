// app/(dashboard)/analytics/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { showError } from '@/lib/toast';
import { useAuth } from './../../../context/AuthContext';
import AppLoader from '@/components/ui/AppLoader';
import ProgressChart from '@/components/analytics/ProgressChart';
import MasteryChart from '@/components/analytics/MasteryChart';
import StreakCard from '@/components/analytics/StreakCard';
import WeakTopics from '@/components/analytics/WeakTopics';
import LearningVelocity from '@/components/analytics/LearningVelocity';
import RecentActivity from '@/components/analytics/RecentActivity';
import StatsCard from '@/components/dashboard/Statcard';
import Leaderboard from '@/components/analytics/Leaderboard';
import { Brain, Target, Flame, Trophy, TrendingUp, Sparkles, Filter, AlertCircle, RefreshCw, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const { user } = useAuth();

  const fetchAnalytics = useCallback(async (authUser: any) => {
    try {
      if (!authUser) return;
      setLoading(true);
      const token = await authUser.getIdToken();

      const [overviewRes, progressRes] = await Promise.all([
        fetch('/api/analytics/overview', {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store'
        }),
        fetch('/api/analytics/progress?timeframe=30days', {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store'
        })
      ]);

      if (!overviewRes.ok || !progressRes.ok) {
        throw new Error('Intelligence streams offline');
      }

      const overviewData = await overviewRes.json();
      const progressData = await progressRes.json();

      setAnalyticsData({
        overview: overviewData.stats || {},
        progress: progressData.chartData || [],
        velocity: progressData.velocity || {},
        recentActivity: progressData.recentActivity || [],
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      showError('Neural bridge connection failed.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchAnalytics(user);
    }
  }, [user, fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex-1 h-full min-h-[80vh] flex items-center justify-center">
        <AppLoader message="Calibrating Neural Synthesis..." />
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex-1 w-full min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <div className="p-8 rounded-[2.5rem] bg-destructive/10 text-destructive border border-destructive/20 shadow-2xl">
          <AlertCircle className="w-16 h-16" />
        </div>
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black uppercase text-foreground">Synthesis Error</h2>
          <Button onClick={() => user && fetchAnalytics(user)} className="rounded-2xl h-14 px-10 font-black uppercase tracking-widest bg-primary text-white">
            <RefreshCw className="w-5 h-5 mr-3" /> Reconnect
          </Button>
        </div>
      </div>
    );
  }

  const { overview = {}, progress = [], velocity = {}, recentActivity = [] } = analyticsData;

  return (
    <div className="w-full flex flex-col min-h-full overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full h-full space-y-10 pb-24"
      >
        {/* Responsive Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-border/50 pb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-primary text-[10px] font-black uppercase tracking-[0.5em]">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Intelligence Core
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground uppercase leading-tight">Insights</h1>
            <p className="text-muted-foreground font-semibold max-w-3xl text-lg md:text-xl">
              Advanced synthesis of your learning momentum and cognitive map.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-secondary/30 p-2 rounded-2xl border border-border/50 backdrop-blur-xl shrink-0">
            <Button variant="ghost" size="sm" className="rounded-xl px-6 h-10 font-black text-[10px] tracking-widest uppercase bg-background shadow-sm border border-border/50">30D</Button>
            <Button variant="ghost" size="sm" className="rounded-xl px-6 h-10 font-black text-[10px] tracking-widest uppercase opacity-30">90D</Button>
            <div className="w-px h-6 bg-border/50 mx-1" />
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border/50 bg-background/50 hover:bg-primary hover:text-white transition-all">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Global Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatsCard title="Sessions" value={overview?.totalQuizzes ?? 0} icon={Brain} color="bg-indigo-600" trend={{ value: "Active", isUp: true }} delay={0} />
          <StatsCard title="Accuracy" value={overview?.avgAccuracy ? `${overview.avgAccuracy}%` : "0%"} icon={Target} color="bg-emerald-600" trend={{ value: "Stable", isUp: (overview?.avgAccuracy || 0) > 70 }} delay={0.1} />
          <StatsCard title="Total XP" value={(overview?.totalXP ?? 0).toLocaleString()} icon={Trophy} color="bg-amber-600" trend={{ value: "Ranked", isUp: true }} delay={0.2} />
          <StatsCard title="Streak" value={overview?.streak ? `${overview.streak}D` : "0D"} icon={Flame} color="bg-rose-600" trend={{ value: "Momentum", isUp: true }} delay={0.3} />
        </div>

        {/* Dynamic Multi-Column Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-8 items-start">

          {/* Main Visual Data (L) */}
          <div className="xl:col-span-8 flex flex-col gap-8 order-1">
            {/* 1. Primary Performance Map */}
            <div className="card-premium rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group min-h-[500px] flex flex-col w-full">
              <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                <TrendingUp className="w-64 md:w-80 h-64 md:h-80" />
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 relative z-10 w-full">
                <div className="space-y-1">
                  <h3 className="text-3xl font-black uppercase tracking-tighter">Retention Matrix</h3>
                  <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.3em]">Temporal stability coefficient</p>
                </div>
              </div>
              <div className="flex-1 w-full min-h-[300px]">
                <ProgressChart data={progress} />
              </div>
            </div>

            {/* 2. Secondary Metrics (Now Two-Columns in L) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card-premium rounded-[2.5rem] p-8 md:p-10 flex flex-col min-h-[450px]">
                <div className="flex items-center justify-between mb-8 leading-none">
                  <h4 className="text-xl font-black uppercase tracking-tight">Growth Velocity</h4>
                  <Activity className="w-5 h-5 text-primary opacity-30" />
                </div>
                <LearningVelocity stats={velocity} />
              </div>
              <div className="card-premium rounded-[2.5rem] p-8 md:p-10 flex flex-col min-h-[450px]">
                <div className="flex items-center justify-between mb-8 leading-none">
                  <h4 className="text-xl font-black uppercase tracking-tight">Cognitive Load</h4>
                  <Sparkles className="w-6 h-6 text-primary opacity-30" />
                </div>
                <MasteryChart data={overview?.masteryBySubject || []} />
              </div>
            </div>

            {/* 3. Activity Stream (Moved inside L to prevent long gaps) */}
            <div className="card-premium rounded-[3rem] p-8 md:p-12 border-0 shadow-2xl">
              <div className="flex items-center gap-4 mb-10">
                <div className="h-px flex-1 bg-border/40" />
                <h3 className="text-2xl font-black uppercase tracking-tighter shrink-0">Neural Activity</h3>
                <div className="h-px flex-1 bg-border/40" />
              </div>
              <RecentActivity activities={recentActivity} />
            </div>
          </div>

          {/* Social & Persistence (R) */}
          <div className="xl:col-span-4 flex flex-col gap-8 order-2 h-full">
            <StreakCard
              currentStreak={overview?.streak || 0}
              longestStreak={overview?.longestStreak || overview?.streak || 0}
              lastActive={new Date().toISOString()}
            />

            <div className="card-premium rounded-[3rem] p-10 relative overflow-hidden group shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-black uppercase leading-none text-foreground mb-1">Obstacles</h4>
                  <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Weak Sectors</p>
                </div>
              </div>
              <WeakTopics topics={overview?.masteryBySubject || []} />
            </div>

            <div className="card-premium rounded-[3rem] overflow-hidden border-0 shadow-2xl min-h-[600px] flex flex-col">
              <div className="bg-secondary/40 p-10 border-b border-border/50 flex items-center justify-between backdrop-blur-md">
                <div>
                  <h4 className="text-base font-black uppercase tracking-[0.4em] text-foreground">Ranking</h4>
                  <p className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest mt-1">Network Persistence</p>
                </div>
                <Trophy className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex-1 overflow-y-auto">
                <Leaderboard />
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
