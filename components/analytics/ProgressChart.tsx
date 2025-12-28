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
    <Card>
      <CardHeader>
        <CardTitle>Performance Over Time</CardTitle>
        <CardDescription>Track your learning progress day by day</CardDescription>
        <Button variant="outline" size="sm" className="mt-2 ml-2" onClick={handleDataShare}>
          <Share2 className="w-4 h-4 mr-1" />
          Share Data
        </Button>
      </CardHeader>
      <CardContent>
        <div>
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