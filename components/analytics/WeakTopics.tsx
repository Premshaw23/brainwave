
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
      <Card className="bg-linear-to-br from-white via-orange-50 to-orange-100 shadow-2xl rounded-2xl border border-orange-100">
        <CardHeader>
          <CardTitle className="text-orange-700 font-extrabold text-2xl">Areas for Improvement</CardTitle>
          <CardDescription className="text-orange-400 font-semibold">Topics that need more practice</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-orange-300 text-lg font-semibold">
            No weak areas detected. Great work! 🎉
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-linear-to-br from-white via-orange-50 to-orange-100 shadow-2xl rounded-2xl border border-orange-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-orange-700 font-extrabold text-2xl">
          <AlertTriangle className="w-6 h-6 text-orange-500" />
          Areas for Improvement
        </CardTitle>
        <CardDescription className="text-orange-400 font-semibold">Topics where you can improve your mastery</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {weakTopics.map((topic, index) => (
          <div 
            key={`${topic.subject}-${index}`}
            className="p-6 bg-orange-50 border border-orange-200 rounded-xl shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-orange-700 capitalize flex items-center gap-3 text-lg">
                  {topic.subject}
                  <TrendingDown className="w-5 h-5 text-orange-500" />
                </h4>
                <p className="text-base text-orange-400 mt-2 font-semibold">
                  {topic.attempts} attempts • Recent score: {topic.recentScore}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-extrabold text-orange-600">{topic.mastery}%</p>
                <p className="text-sm text-orange-400 font-semibold">Mastery</p>
              </div>
            </div>
            <div className="w-full bg-orange-200 rounded-full h-4 mb-4">
              <div 
                className="bg-linear-to-r from-orange-400 to-orange-500 h-4 rounded-full transition-all duration-500 shadow-md"
                style={{ width: `${topic.mastery}%` }}
              />
            </div>
            <Link href={`/notes?subject=${topic.subject}`}>
              <Button size="sm" variant="outline" className="w-full rounded-xl bg-orange-100 text-orange-700 font-bold shadow hover:bg-orange-200">
                Practice {topic.subject}
              </Button>
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}