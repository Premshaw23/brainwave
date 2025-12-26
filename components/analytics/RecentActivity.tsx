
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
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest learning sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No recent activity. Start learning!
            </div>
          ) : (
            activities.map((activity, index) => (
              <div 
                key={`${activity._id}-${activity.timestamp}-${index}`}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="mt-1">
                  {activity.type === 'quiz' ? (
                    activity.score && activity.score >= 70 ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )
                  ) : (
                    <Brain className="w-5 h-5 text-indigo-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link href={activity.type === 'quiz' ? `/quizzes/${activity._id}` : `/notes/${activity._id}`}>
                    <h4 className="text-sm font-semibold text-gray-900 hover:text-indigo-600 truncate">
                      {activity.title}
                    </h4>
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs capitalize">
                      {activity.subject}
                    </Badge>
                    {activity.score !== undefined && (
                      <span className="text-xs font-medium text-gray-600">
                        Score: {activity.score}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
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
