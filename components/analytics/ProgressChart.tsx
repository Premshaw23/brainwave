// components/analytics/ProgressChart.tsx
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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

export default function ProgressChart({ data }: ProgressChartProps) {
  const [dataModalOpen, setDataModalOpen] = useState(false);
  const [shareData, setShareData] = useState<string | null>(null);

  const handleDataShare = () => {
    // Format chart data as a readable summary
    const summary = data.map(d => `${d.date}: Score ${d.score}%, Quizzes ${d.quizzes}`).join('\n');
    setShareData(summary);
    setDataModalOpen(true);
  };

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
    <Card className="bg-linear-to-br from-white via-indigo-50 to-indigo-100 shadow-2xl rounded-2xl border border-indigo-100">
      <CardHeader>
        <CardTitle className="text-indigo-700 font-extrabold text-2xl">Performance Over Time</CardTitle>
        <CardDescription className="text-indigo-400 font-semibold">Track your learning progress day by day</CardDescription>
        <Button variant="outline" size="sm" className="mt-4 ml-2 rounded-xl bg-indigo-50 text-indigo-700 font-semibold shadow px-4 py-2" onClick={handleDataShare}>
          <Share2 className="w-5 h-5 mr-2" />
          Share Data
        </Button>
      </CardHeader>
      <CardContent>
        <div className="pt-2">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#c7d2fe" />
              <XAxis 
                dataKey="date" 
                stroke="#6366f1"
                style={{ fontSize: '14px', fontWeight: 600 }}
              />
              <YAxis 
                stroke="#6366f1"
                style={{ fontSize: '14px', fontWeight: 600 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '16px', fontWeight: 700, color: '#6366f1' }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#6366f1" 
                strokeWidth={4}
                name="Average Score (%)"
                dot={{ fill: '#6366f1', r: 5 }}
                activeDot={{ r: 8 }}
              />
              <Line 
                type="monotone" 
                dataKey="quizzes" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Quizzes Taken"
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {shareData && (
          <ShareContentModal
            contentType="summary"
            contentId={shareData}
            contentTitle="Analytics Data Summary"
            trigger={null}
            open={dataModalOpen}
            onOpenChange={setDataModalOpen}
          />
        )}
      </CardContent>
    </Card>
  );
}