// components/dashboard/Statcard.tsx
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string | {
    value: string;
    isUp: boolean;
  };
  color?: string;
  delay?: number;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'bg-primary',
  delay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="card-premium border-0 rounded-3xl overflow-hidden group shadow-lg">
        <CardContent className="p-6 relative isolate">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
            <Icon className="w-24 h-24 rotate-[-15deg] group-hover:rotate-0 transition-transform duration-500 transform-gpu" />
          </div>

          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">{title}</p>
                <p className="text-4xl font-black tracking-tighter text-foreground">{value}</p>
              </div>

              {trend && (
                <div className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
                  typeof trend === 'string'
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : trend.isUp
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                )}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  {typeof trend === 'string'
                    ? trend
                    : `${trend.isUp ? "+" : "-"}${trend.value} this week`}
                </div>
              )}
            </div>

            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110",
              color,
              "bg-gradient-to-br"
            )}>
              <Icon className="w-7 h-7 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
