// components/analytics/ProgressChart.tsx
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useState } from 'react';
import ShareContentModal from '@/components/community/ShareContentModel';

interface ProgressChartProps {
  data: Array<{
    date: string;
    score: number;
    quizzes: number;
  }>;
}

export default function ProgressChart({ data = [] }: ProgressChartProps) {
  const [dataModalOpen, setDataModalOpen] = useState(false);
  const [shareData, setShareData] = useState<string | null>(null);

  const handleDataShare = () => {
    if (!data || data.length === 0) return;
    const summary = data.map(d => `${d.date || 'unknown'}: Score ${d.score || 0}%, Quizzes ${d.quizzes || 0}`).join('\n');
    setShareData(summary);
    setDataModalOpen(true);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-md p-4 border border-border/50 rounded-2xl shadow-2xl z-50">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
            {payload[0].payload.date || 'Unknown Date'}
          </p>
          <div className="space-y-1">
            <p className="text-sm font-black text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Score: {payload[0].value || 0}%
            </p>
            <p className="text-sm font-black text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
              Quizzes: {payload[1]?.value || 0}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center text-center p-12 bg-secondary/5 border border-dashed border-border/50 rounded-[2.5rem]">
        <div className="space-y-2">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40">Temporal Rift Detected</p>
          <p className="text-[10px] font-bold text-muted-foreground/20 uppercase">Incomplete dataset for retention matrix</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full space-y-4">
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorScore)"
              animationDuration={2000}
            />
            <Line
              type="monotone"
              dataKey="quizzes"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-end pt-4 border-t border-border/50">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-xl font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all disabled:opacity-30"
          onClick={handleDataShare}
          disabled={!data?.length}
        >
          <Share2 className="w-3 h-3 mr-2" />
          Export Dataset
        </Button>
      </div>

      {shareData && (
        <ShareContentModal
          contentType="summary"
          contentId={shareData}
          contentTitle="Performance Synthesis Record"
          trigger={null}
          open={dataModalOpen}
          onOpenChange={setDataModalOpen}
        />
      )}
    </div>
  );
}