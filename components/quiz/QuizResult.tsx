
// components/quiz/QuizResults.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Clock, TrendingUp, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface QuizResultsProps {
  score: number;
  correctCount: number;
  totalQuestions: number;
  xpEarned: number;
  results: Array<{
    question: string;
    options: string[];
    selectedAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    explanation: string;
  }>;
  timeSpent: number;
}

export default function QuizResults({
  score,
  correctCount,
  totalQuestions,
  xpEarned,
  results,
  timeSpent,
}: QuizResultsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreMessage = () => {
    if (score >= 90) return 'Outstanding! 🎉';
    if (score >= 80) return 'Great job! 🌟';
    if (score >= 70) return 'Well done! 👍';
    if (score >= 60) return 'Good effort! 💪';
    return 'Keep practicing! 📚';
  };

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto py-8 px-4">
      {/* Score Card */}
      <Card className={`border-2 ${getScoreColor()} bg-linear-to-br from-white via-indigo-50 to-indigo-100 rounded-2xl shadow-2xl`}>
        <CardContent className="p-10 text-center">
          <div className="mb-4">
            <Trophy className="w-16 h-16 mx-auto text-current" />
          </div>
          <h2 className="text-5xl font-extrabold mb-2 text-indigo-700">{score}%</h2>
          <p className="text-2xl font-semibold mb-1 text-gray-900">{getScoreMessage()}</p>
          <p className="text-base opacity-80 text-gray-700">
            {correctCount} out of {totalQuestions} correct
          </p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="rounded-xl shadow-md">
          <CardContent className="p-8 text-center">
            <Target className="w-8 h-8 mx-auto text-indigo-600 mb-2" />
            <p className="text-3xl font-bold text-gray-900">{correctCount}/{totalQuestions}</p>
            <p className="text-base text-gray-600">Correct Answers</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-md">
          <CardContent className="p-8 text-center">
            <Clock className="w-8 h-8 mx-auto text-green-600 mb-2" />
            <p className="text-3xl font-bold text-gray-900">{formatTime(timeSpent)}</p>
            <p className="text-base text-gray-600">Time Spent</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-md">
          <CardContent className="p-8 text-center">
            <TrendingUp className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
            <p className="text-3xl font-bold text-gray-900">+{xpEarned} XP</p>
            <p className="text-base text-gray-600">Points Earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-indigo-700">Detailed Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {results.map((result, index) => (
            <div key={index} className="border-b pb-8 last:border-0 last:pb-0">
              <div className="flex items-start gap-4 mb-3">
                {result.isCorrect ? (
                  <CheckCircle2 className="w-7 h-7 text-green-600 shrink-0 mt-1" />
                ) : (
                  <XCircle className="w-7 h-7 text-red-600 shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                    Question {index + 1}: {result.question}
                  </h3>

                  <div className="space-y-2 mb-3">
                    {result.options.map((option, optIndex) => {
                      const isCorrect = optIndex === result.correctAnswer;
                      const wasSelected = optIndex === result.selectedAnswer;

                      return (
                        <div
                          key={optIndex}
                          className={`p-4 rounded-xl border text-base font-medium ${
                            isCorrect
                              ? 'bg-green-50 border-green-300'
                              : wasSelected
                              ? 'bg-red-50 border-red-300'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-semibold">
                              {['A', 'B', 'C', 'D'][optIndex]}.
                            </span>
                            <span>{option}</span>
                            {isCorrect && (
                              <Badge className="ml-auto bg-green-600 text-white px-3 py-1 rounded-lg">Correct</Badge>
                            )}
                            {wasSelected && !isCorrect && (
                              <Badge className="ml-auto bg-red-600 text-white px-3 py-1 rounded-lg">Your Answer</Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-base font-semibold text-blue-900 mb-1">
                      Explanation:
                    </p>
                    <p className="text-base text-blue-800">{result.explanation}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-6 mt-8">
        <Link href="/dashboard" className="flex-1">
          <Button variant="outline" className="w-full rounded-xl text-lg font-semibold py-3 shadow-md hover:bg-indigo-50">
            Back to Dashboard
          </Button>
        </Link>
        <Link href="/quizzes" className="flex-1">
          <Button className="w-full rounded-xl bg-indigo-600 text-white text-lg font-semibold py-3 shadow-md hover:bg-indigo-700 transition-all duration-150">
            View All Quizzes
          </Button>
        </Link>
      </div>
    </div>
  );
}