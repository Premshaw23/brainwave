// components/analytics/MasteryChart.tsx
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

interface MasteryChartProps {
  data: Array<{
    subject: string;
    mastery: number;
    attempts: number;
  }>;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--primary) / 0.8)',
  'hsl(var(--primary) / 0.6)',
  'hsl(var(--primary) / 0.4)',
  'hsl(var(--primary) / 0.2)',
];

export default function MasteryChart({ data = [] }: MasteryChartProps) {
  const chartData = (data || []).map(item => ({
    name: (item.subject || 'Unknown').charAt(0).toUpperCase() + (item.subject || 'Unknown').slice(1),
    value: item.mastery || 0,
    attempts: item.attempts || 0,
    subject: item.subject || 'Unknown',
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-md p-4 border border-border/50 rounded-2xl shadow-2xl z-50">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
            {payload[0].payload.name}
          </p>
          <p className="text-lg font-black text-foreground">{payload[0].value}% Mastery</p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">{payload[0].payload.attempts} sessions conducted</p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="h-[280px] w-full flex items-center justify-center text-center p-8 bg-secondary/10 rounded-[2rem] border border-dashed border-border/50">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/30">Neural Map Depleted</p>
          <p className="text-[9px] font-bold text-muted-foreground/20 uppercase mt-1">Acquire knowledge to generate metrics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="h-[280px] w-full relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Cognitive</span>
          <span className="text-2xl font-black text-foreground">INDEX</span>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={8}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="transparent"
                  className="hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 space-y-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-transparent hover:border-border/50 hover:bg-secondary/50 transition-all group">
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full shadow-sm"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors truncate max-w-[120px]">{item.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-muted-foreground/40">{item.attempts} SESSIONS</span>
              <span className="text-sm font-black text-foreground">{item.value}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}