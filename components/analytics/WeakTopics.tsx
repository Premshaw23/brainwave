
// components/analytics/WeakTopics.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface WeakTopicsProps {
  topics: Array<{
    subject: string;
    mastery: number;
    attempts: number;
    recentScore: number;
  }>;
}

export default function WeakTopics({ topics }: WeakTopicsProps) {
  // Sort by mastery and get bottom 3
  const weakTopics = [...topics]
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 3);

  if (weakTopics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Areas for Improvement</CardTitle>
          <CardDescription>Topics that need more practice</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">No weak areas detected. Great work! 🎉</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-700">
          <AlertTriangle className="w-5 h-5" />
          Areas for Improvement
        </CardTitle>
        <CardDescription>Topics where you can improve your mastery</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {weakTopics.map((topic, index) => (
          <div 
            key={`${topic.subject}-${index}`}
            className="p-4 bg-orange-50 border border-orange-200 rounded-lg"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-gray-900 capitalize flex items-center gap-2">
                  {topic.subject}
                  <TrendingDown className="w-4 h-4 text-orange-600" />
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {topic.attempts} attempts • Recent score: {topic.recentScore}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-600">{topic.mastery}%</p>
                <p className="text-xs text-gray-500">Mastery</p>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div 
                className="bg-orange-500 h-2 rounded-full"
                style={{ width: `${topic.mastery}%` }}
              />
            </div>

            <Link href={`/notes?subject=${topic.subject}`}>
              <Button size="sm" variant="outline" className="w-full">
                Practice {topic.subject}
              </Button>
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}