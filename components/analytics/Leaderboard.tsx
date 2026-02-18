// components/analytics/Leaderboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { Trophy, Medal, Award, Star, Zap } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<number>(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchLeaderboard();
    }
  }, [user]);

  const fetchLeaderboard = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/analytics/leaderboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setLeaderboard(data.leaderboard);
        setUserRank(data.currentUserRank);
      }
    } catch (error) {
      console.error("Failed to sync leaderboard:", error);
    }
  };

  const getRankStyles = (rank: number) => {
    if (rank === 1) return { icon: <Trophy className="w-4 h-4 text-amber-500" />, bg: "bg-amber-500/10", border: "border-amber-500/20" };
    if (rank === 2) return { icon: <Medal className="w-4 h-4 text-slate-400" />, bg: "bg-slate-400/10", border: "border-slate-400/20" };
    if (rank === 3) return { icon: <Award className="w-4 h-4 text-orange-500" />, bg: "bg-orange-500/10", border: "border-orange-500/20" };
    return { icon: <span className="text-[10px] font-black">{rank}</span>, bg: "bg-secondary/50", border: "border-border/50" };
  };

  return (
    <div className="w-full">
      <div className="divide-y divide-border/50">
        <AnimatePresence>
          {leaderboard.map((item, index) => {
            const styles = getRankStyles(item.rank);
            const isCurrentUser = item.isCurrentUser;

            return (
              <motion.div
                key={`${item.rank}-${item.displayName}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "relative flex items-center justify-between p-4 transition-all group",
                  isCurrentUser ? "bg-primary/[0.03]" : "hover:bg-secondary/20"
                )}
              >
                {isCurrentUser && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                )}

                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shadow-sm border",
                    styles.bg,
                    styles.border
                  )}>
                    {styles.icon}
                  </div>

                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9 border border-border/50 group-hover:scale-105 transition-transform shadow-sm overflow-hidden">
                      {item.avatar ? (
                        <Image
                          src={item.avatar}
                          alt={item.displayName}
                          width={36}
                          height={36}
                          className="object-cover w-full h-full rounded-full img-optimize"
                        />
                      ) : (
                        <AvatarFallback className="bg-secondary text-[10px] font-black uppercase">
                          {item.displayName.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className={cn("text-sm font-black tracking-tight", isCurrentUser ? "text-primary" : "text-foreground")}>
                          {item.displayName}
                        </p>
                        {isCurrentUser && <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />}
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest">
                        <Zap className="w-2.5 h-2.5 fill-orange-500/20 text-orange-500" />
                        {item.streak}D Streak
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-black tracking-tight text-foreground">
                    {item.totalXP.toLocaleString()}
                  </p>
                  <p className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-tight">CEREBRAL XP</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {userRank > 10 && (
        <div className="p-4 bg-secondary/30 border-t border-border/50 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            Current Rank <span className="text-primary italic">#{userRank}</span>
          </p>
          <div className="mt-2 flex items-center justify-center gap-1">
            <Star className="w-2.5 h-2.5 fill-primary text-primary" />
            <p className="text-[9px] font-bold text-muted-foreground/40 uppercase">Top 12% of Global Forgers</p>
          </div>
        </div>
      )}
    </div>
  );
}
