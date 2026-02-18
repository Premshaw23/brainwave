// components/analytics/WeakTopics.tsx
'use client';

import { Target, TrendingDown, ChevronRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface WeakTopicsProps {
  topics: Array<{
    subject: string;
    mastery: number;
    attempts: number;
    recentScore: number;
  }>;
}

export default function WeakTopics({ topics }: WeakTopicsProps) {
  // Sort by mastery and get bottom 3
  const weakTopics = [...topics]
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 3);

  if (weakTopics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
          <Zap className="w-8 h-8" />
        </div>
        <p className="text-lg font-black uppercase tracking-tighter text-foreground">Peak Performance</p>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">No weak sectors detected</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {weakTopics.map((topic, index) => (
        <motion.div
          key={`${topic.subject}-${index}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative p-6 rounded-[2rem] bg-secondary/30 border border-transparent hover:border-border/50 hover:bg-secondary/50 transition-all"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <h4 className="text-lg font-black tracking-tight text-foreground uppercase flex items-center gap-2">
                {topic.subject}
                <TrendingDown className="w-4 h-4 text-rose-500" />
              </h4>
              <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                {topic.attempts} Neural Syncs conducted
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-rose-500">{topic.mastery}%</p>
              <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">Mastery Level</p>
            </div>
          </div>

          <div className="relative h-2 w-full bg-background rounded-full overflow-hidden mb-6">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${topic.mastery}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-rose-500 to-orange-400"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Recent: {topic.recentScore}%</span>
            </div>
            <Link href={`/notes?subject=${topic.subject}`}>
              <Button size="sm" variant="ghost" className="h-8 rounded-lg text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 transition-all group-hover:px-4">
                Recalibrate <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}