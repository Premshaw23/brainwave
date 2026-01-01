
// components/analytics/RecentActivity.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clock, CheckCircle2, XCircle, Brain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Activity {
  _id: string;
  type: 'quiz' | 'note';
  title: string;
  subject: string;
  score?: number;
  timestamp: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const formatTimeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <Card className="bg-linear-to-br from-white via-indigo-50 to-indigo-100 shadow-2xl rounded-2xl border border-indigo-100">
      <CardHeader>
        <CardTitle className="text-indigo-700 font-extrabold text-2xl">Recent Activity</CardTitle>
        <CardDescription className="text-indigo-400 font-semibold">Your latest learning sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-10 text-indigo-300 text-lg font-semibold">
              No recent activity. Start learning!
            </div>
          ) : (
            activities.map((activity, index) => (
              <div 
                key={`${activity._id}-${activity.timestamp}-${index}`}
                className="flex flex-col sm:flex-row items-start gap-3 sm:gap-5 p-4 sm:p-5 bg-indigo-50 rounded-xl shadow-sm hover:bg-indigo-100 transition-all duration-150"
              >
                <div className="mt-1 shrink-0">
                  {activity.type === 'quiz' ? (
                    activity.score && activity.score >= 70 ? (
                      <CheckCircle2 className="w-7 h-7 text-green-600" />
                    ) : (
                      <XCircle className="w-7 h-7 text-red-600" />
                    )
                  ) : (
                    <Brain className="w-7 h-7 text-indigo-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link href={activity.type === 'quiz' ? `/quizzes/${activity._id}` : `/notes/${activity._id}`}>
                    <h4 className="text-base font-bold text-indigo-700 hover:text-indigo-900 truncate">
                      {activity.title}
                    </h4>
                  </Link>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mt-2">
                    <Badge variant="outline" className="text-sm capitalize px-3 py-1 font-semibold rounded-xl bg-indigo-100 text-indigo-700 border border-indigo-200">
                      {activity.subject}
                    </Badge>
                    {activity.score !== undefined && (
                      <span className="text-sm font-semibold text-indigo-400">
                        Score: {activity.score}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-indigo-400 font-semibold mt-2 sm:mt-0">
                  <Clock className="w-4 h-4" />
                  {formatTimeAgo(activity.timestamp)}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
