
// components/analytics/MasteryChart.tsx
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface MasteryChartProps {
  data: Array<{
    subject: string;
    mastery: number;
    attempts: number;
  }>;
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function MasteryChart({ data }: MasteryChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-900 capitalize mb-1">
            {payload[0].payload.subject}
          </p>
          <p className="text-sm text-indigo-600">
            Mastery: {payload[0].value}%
          </p>
          <p className="text-sm text-gray-600">
            Attempts: {payload[0].payload.attempts}
          </p>
        </div>
      );
    }
    return null;
  };

  const chartData = data.map(item => ({
    name: item.subject.charAt(0).toUpperCase() + item.subject.slice(1),
    value: item.mastery,
    attempts: item.attempts,
    subject: item.subject,
  }));

  return (
    <Card className="bg-linear-to-br from-white via-indigo-50 to-indigo-100 shadow-2xl rounded-2xl border border-indigo-100">
      <CardHeader>
        <CardTitle className="text-indigo-700 font-extrabold text-2xl">Mastery by Subject</CardTitle>
        <CardDescription className="text-indigo-400 font-semibold">Your expertise level across different topics</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={110}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${entry.subject}-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-6 space-y-3">
          {data.map((item, index) => (
            <div key={`${item.subject}-${index}`} className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <div 
                  className="w-4 h-4 rounded-full shadow" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-base font-semibold capitalize text-indigo-700">{item.subject}</span>
              </div>
              <div className="flex items-center gap-6 text-base">
                <span className="text-indigo-400 font-semibold">{item.attempts} attempts</span>
                <span className="font-extrabold text-indigo-700">{item.mastery}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}