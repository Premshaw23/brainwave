
// components/quiz/QuizQuestion.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle } from 'lucide-react';

interface QuizQuestionProps {
  question: string;
  options: string[];
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuizQuestion({
  question,
  options,
  selectedAnswer,
  onSelectAnswer,
  questionNumber,
  totalQuestions,
}: QuizQuestionProps) {
  return (
    <Card className="bg-linear-to-br from-white via-indigo-50 to-indigo-100 shadow-2xl rounded-2xl border border-gray-200">
      <CardContent className="p-10">
        {/* Question Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <span className="text-base font-semibold text-indigo-700">
              Question {questionNumber} of {totalQuestions}
            </span>
            <div className="flex gap-2">
              {Array.from({ length: totalQuestions }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < questionNumber ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{question}</h2>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const optionLabel = ['A', 'B', 'C', 'D'][index];

            return (
              <button
                key={index}
                onClick={() => onSelectAnswer(index)}
                className={`w-full text-left p-5 rounded-xl border-2 text-lg font-medium transition-all duration-150 shadow-sm ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-100 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  {isSelected ? (
                    <CheckCircle2 className="w-7 h-7 text-indigo-600 shrink-0" />
                  ) : (
                    <Circle className="w-7 h-7 text-gray-400 shrink-0" />
                  )}
                  <div className="flex-1">
                    <span className="font-semibold text-indigo-700 mr-3">
                      {optionLabel}.
                    </span>
                    <span className={isSelected ? 'text-indigo-900' : 'text-gray-700'}>
                      {option}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}