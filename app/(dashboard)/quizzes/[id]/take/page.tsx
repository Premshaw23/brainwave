
// app/(dashboard)/quizzes/[id]/take/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import QuizQuestion from '@/components/quiz/QuizQuestion';
import QuizResults from '@/components/quiz/QuizResult';

import React from 'react';

export default function TakeQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [startTime] = useState(Date.now());
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`/api/quizzes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (data.success) {
      setQuiz(data.quiz);
      setAnswers(new Array(data.quiz.questions.length).fill(null));
    }
  };

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!confirm('Submit your quiz? You cannot change answers after submission.')) {
      return;
    }

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const token = localStorage.getItem('authToken');

    const response = await fetch(`/api/quizzes/${id}/attempt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        answers: answers.map((selected, index) => ({
          questionIndex: index,
          selectedAnswer: selected,
        })),
        timeSpent,
      }),
    });

    const data = await response.json();
    if (data.success) {
      setResults(data);
      setSubmitted(true);
    }
  };

  if (!quiz) return <div>Loading quiz...</div>;

  if (submitted && results) {
    return (
      <div className="max-w-4xl mx-auto">
        <QuizResults
          score={results.score}
          correctCount={results.correctCount}
          totalQuestions={results.totalQuestions}
          xpEarned={results.xpEarned}
          results={results.results}
          timeSpent={Math.floor((Date.now() - startTime) / 1000)}
        />
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const answeredCount = answers.filter((a) => a !== null).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {answeredCount} of {quiz.questions.length} answered
          </span>
          <span className="text-indigo-600 font-medium capitalize">
            {quiz.difficulty} difficulty
          </span>
        </div>
        <Progress value={progress} className="mt-4" />
      </div>

      {/* Question */}
      <QuizQuestion
        question={quiz.questions[currentQuestion].question}
        options={quiz.questions[currentQuestion].options}
        selectedAnswer={answers[currentQuestion]}
        onSelectAnswer={handleSelectAnswer}
        questionNumber={currentQuestion + 1}
        totalQuestions={quiz.questions.length}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {currentQuestion === quiz.questions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={answeredCount !== quiz.questions.length}
            size="lg"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Submit Quiz
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}