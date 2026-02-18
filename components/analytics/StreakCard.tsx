// components/analytics/StreakCard.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Flame, TrendingUp, Calendar, Zap, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  lastActive: string;
}

export default function StreakCard({ currentStreak, longestStreak, lastActive }: StreakCardProps) {
  const getStreakMessage = () => {
    if (currentStreak >= 30) return "Master of Discipline";
    if (currentStreak >= 14) return "Unstoppable Force";
    if (currentStreak >= 7) return "Weekly Warrior";
    if (currentStreak >= 3) return "Habit Forged";
    return "Ignite the Fire";
  };

  const streakPercentage = Math.min((currentStreak / 30) * 100, 100);

  return (
    <Card className="card-premium border-0 rounded-[3rem] overflow-hidden group shadow-2xl bg-white dark:bg-slate-900">
      <CardContent className="p-8 sm:p-10 relative">
        {/* Cinematic Glow */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-orange-500/[0.07] rounded-full -mr-32 -mt-32 blur-[100px] group-hover:bg-orange-500/[0.12] transition-colors duration-1000" />

        <div className="relative z-10 space-y-8">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[9px] font-black uppercase tracking-[0.3em] border border-orange-500/20">
              <Flame className="w-3.5 h-3.5 fill-current animate-pulse" />
              Neural Pulse
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/50 border border-border/50">
              <Award className="w-4 h-4 text-orange-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{longestStreak}D BEST</span>
            </div>
          </div>

          {/* Main Visual */}
          <div className="flex flex-col gap-4">
            <div className="flex items-baseline gap-4 flex-wrap">
              <span className="text-6xl sm:text-7xl md:text-8xl font-black text-foreground tracking-[-0.08em] leading-none shrink-0 drop-shadow-sm transition-all">
                {currentStreak}
              </span>
              <div className="space-y-2.5 min-w-[100px]">
                <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground/60 leading-tight">Consecutive<br />Day Sync</p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={cn(
                      "w-1.5 h-5 rounded-full transition-all duration-700",
                      i < Math.floor(currentStreak / 6) ? "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" : "bg-muted/50"
                    )} />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-3xl font-black tracking-tighter text-foreground uppercase leading-tight select-none">
                {getStreakMessage()} <span className="text-orange-500">🔥</span>
              </h3>
              <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mt-1">Maintain focus to scale the network</p>
            </div>
          </div>

          {/* Data Persistence Goal */}
          <div className="bg-secondary/20 p-6 rounded-[2.5rem] border border-border/10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">30D Milestone Synthesis</span>
              <span className="text-[10px] font-black text-orange-500">{currentStreak}/30</span>
            </div>
            <div className="relative h-2.5 w-full bg-background rounded-full overflow-hidden shadow-inner flex items-center px-0.5 border border-border/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${streakPercentage}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-1.5 rounded-full bg-gradient-to-r from-orange-600 to-amber-400 shadow-[0_0_15px_rgba(249,115,22,0.3)] relative"
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:12px_12px] animate-[progress-stripe_2s_linear_infinite]" />
              </motion.div>
            </div>
          </div>

          {/* Activity Metadata */}
          <div className="flex items-center justify-between pt-6 border-t border-border/40">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">
              <Calendar className="w-3.5 h-3.5" />
              Synced: <span className="text-foreground/70">{new Date(lastActive).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 group-hover:scale-105 transition-transform">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">x1.2 Boost</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
