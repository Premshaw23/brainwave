// components/quiz/QuizGenerator.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, Zap } from 'lucide-react';
import AppLoader from '@/components/ui/AppLoader';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { showError } from '@/lib/toast';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '../../context/AuthContext';

interface QuizGeneratorProps {
  noteId: string;
  noteTitle: string;
}

export default function QuizGenerator({ noteId, noteTitle }: QuizGeneratorProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [difficulty, setDifficulty] = useState('medium');
  const [numQuestions, setNumQuestions] = useState([5]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setError('');
    setLoading(true);

    try {
      if (!user) throw new Error('Not authenticated');
      const token = await user.getIdToken();
      const response = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          noteId,
          difficulty,
          numQuestions: numQuestions[0],
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/quizzes/${data.quizId}/take`);
      } else {
        setError(data.error || 'Failed to generate quiz');
        showError(data.error || 'Failed to generate quiz');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate quiz');
      showError(err.message || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-linear-to-br from-white via-indigo-50 to-indigo-100 shadow-2xl rounded-2xl border border-gray-200">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-indigo-700 tracking-tight">
          <Brain className="w-7 h-7 text-indigo-600" />
          Generate AI Quiz
        </CardTitle>
        <CardDescription className="text-indigo-700">
          Create a personalized quiz from "{noteTitle}"
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 pt-4">
        {error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertDescription className="text-red-600 font-medium">{error}</AlertDescription>
          </Alert>
        )}

        {/* Difficulty */}
        <div className="space-y-3">
          <Label className="text-lg font-medium text-gray-800">Difficulty Level</Label>
          <Select value={difficulty} onValueChange={setDifficulty} disabled={loading}>
            <SelectTrigger className="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Easy - Basic concepts
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  Medium - Applied knowledge
                </div>
              </SelectItem>
              <SelectItem value="hard">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Hard - Advanced analysis
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Number of Questions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-medium text-gray-800">Number of Questions</Label>
            <span className="text-2xl font-bold text-indigo-600">{numQuestions[0]}</span>
          </div>
          <Slider
            value={numQuestions}
            onValueChange={setNumQuestions}
            min={3}
            max={15}
            step={1}
            disabled={loading}
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            More questions = more comprehensive coverage
          </p>
        </div>

        {/* Estimated Time */}
        <div className="bg-indigo-50 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-medium text-indigo-900">Estimated Time</p>
              <p className="text-xs text-indigo-600 mt-1">Average per question: 1-2 minutes</p>
            </div>
            <div className="text-2xl font-bold text-indigo-600">
              {numQuestions[0] * 1.5} min
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={loading || !user}
          className="w-full rounded-xl bg-indigo-600 text-white text-lg font-semibold py-3 shadow-lg hover:bg-indigo-700 transition-all duration-150"
          size="lg"
        >
          {loading ? <AppLoader message="Generating quiz..." /> : <><Zap className="w-5 h-5 mr-2" />Generate Quiz</>}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Powered by OpenAI GPT-4 • Takes ~10-15 seconds
        </p>
      </CardContent>
    </Card>
  );
}
