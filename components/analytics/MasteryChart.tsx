
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
    <Card>
      <CardHeader>
        <CardTitle>Mastery by Subject</CardTitle>
        <CardDescription>Your expertise level across different topics</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={100}
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

        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div key={`${item.subject}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm font-medium capitalize">{item.subject}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">{item.attempts} attempts</span>
                <span className="font-bold text-indigo-600">{item.mastery}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}