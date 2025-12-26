// components/analytics/ProgressChart.tsx
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ProgressChartProps {
  data: Array<{
    date: string;
    score: number;
    quizzes: number;
  }>;
}

export default function ProgressChart({ data }: ProgressChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-900 mb-1">
            {payload[0].payload.date}
          </p>
          <p className="text-sm text-indigo-600">
            Avg Score: {payload[0].value}%
          </p>
          <p className="text-sm text-green-600">
            Quizzes: {payload[1]?.value || 0}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Over Time</CardTitle>
        <CardDescription>Track your learning progress day by day</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '14px' }}
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#4f46e5" 
              strokeWidth={3}
              name="Average Score (%)"
              dot={{ fill: '#4f46e5', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="quizzes" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Quizzes Taken"
              dot={{ fill: '#10b981', r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}