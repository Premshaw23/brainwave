// components/analytics/RecentActivity.tsx
'use client';

import { Clock, CheckCircle2, XCircle, Brain, FileText, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Activity {
  _id: string;
  type: 'quiz' | 'note';
  title: string;
  subject: string;
  score?: number;
  timestamp: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const formatTimeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="w-full space-y-6">
      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="p-4 rounded-full bg-secondary/50 text-muted-foreground/30">
            <Brain className="w-12 h-12" />
          </div>
          <p className="text-xl font-black uppercase tracking-widest text-muted-foreground/40">No activity synthesized yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const isSuccess = activity.score !== undefined && activity.score >= 70;
            return (
              <div
                key={`${activity._id}-${activity.timestamp}-${index}`}
                className="group relative flex items-center justify-between p-5 rounded-3xl bg-secondary/30 border border-transparent hover:border-border/50 hover:bg-secondary/50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-5">
                  {/* Status Icon */}
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110",
                    activity.type === 'quiz'
                      ? (isSuccess ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500")
                      : "bg-primary/10 text-primary"
                  )}>
                    {activity.type === 'quiz' ? (
                      isSuccess ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />
                    ) : (
                      <FileText className="w-6 h-6" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-1">
                    <Link href={activity.type === 'quiz' ? `/quizzes/${activity._id}` : `/notes/${activity._id}`}>
                      <h4 className="text-lg font-black tracking-tight text-foreground/90 group-hover:text-primary transition-colors">
                        {activity.title}
                      </h4>
                    </Link>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-background/50 border-border/50 text-muted-foreground">
                        {activity.subject}
                      </Badge>
                      {activity.score !== undefined && (
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                          isSuccess ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                        )}>
                          Score: {activity.score}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden sm:flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(activity.timestamp)}
                    </div>
                    <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-tight">Sync Complete</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
