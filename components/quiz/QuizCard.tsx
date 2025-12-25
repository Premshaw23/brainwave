
// components/quiz/QuizCard.tsx
'use client';

import Link from 'next/link';
import { Brain, Clock, Target, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface QuizCardProps {
  quiz: {
    _id: string;
    title: string;
    subject: string;
    difficulty: 'easy' | 'medium' | 'hard';
    questions: any[];
    createdAt: string;
  };
}

export default function QuizCard({ quiz }: QuizCardProps) {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {quiz.title}
            </h3>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(quiz.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                {quiz.questions?.length || 0} questions
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge className="capitalize">{quiz.subject}</Badge>
            <Badge className={difficultyColors[quiz.difficulty]} variant="outline">
              {quiz.difficulty}
            </Badge>
          </div>

          <Link href={`/quizzes/${quiz._id}/take`}>
            <Button>
              <Brain className="w-4 h-4 mr-2" />
              Take Quiz
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
