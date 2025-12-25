
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
    <Card className="border-2">
      <CardContent className="p-8">
        {/* Question Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-indigo-600">
              Question {questionNumber} of {totalQuestions}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: totalQuestions }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < questionNumber ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">{question}</h2>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const optionLabel = ['A', 'B', 'C', 'D'][index];

            return (
              <button
                key={index}
                onClick={() => onSelectAnswer(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isSelected ? (
                    <CheckCircle2 className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <span className="font-semibold text-gray-700 mr-2">
                      {optionLabel}.
                    </span>
                    <span className={isSelected ? 'text-gray-900' : 'text-gray-700'}>
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