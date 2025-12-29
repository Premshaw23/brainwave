
// app/(dashboard)/quizzes/page.tsx
'use client';

import { useEffect, useState } from 'react';
import AppLoader from '@/components/ui/AppLoader';
import { showError } from '@/lib/toast';
import { Brain, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import QuizCard from '@/components/quiz/QuizCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '../../../context/AuthContext';

export default function QuizzesPage() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  useEffect(() => {
    fetchQuizzes();
  }, [subjectFilter, difficultyFilter]);

  const fetchQuizzes = async () => {
    try {
      if (!user) return;
      const token = await user.getIdToken();
      const params = new URLSearchParams();
      if (subjectFilter !== 'all') params.append('subject', subjectFilter);
      if (difficultyFilter !== 'all') params.append('difficulty', difficultyFilter);

      const response = await fetch(`/api/quizzes?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setQuizzes(data.quizzes);
      } else {
        setError(data.error || 'Failed to fetch quizzes');
        showError(data.error || 'Failed to fetch quizzes');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch quizzes');
      showError(err.message || 'Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <AppLoader message="Loading quizzes…" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Quizzes</h1>
          <p className="text-gray-600 mt-1">Practice and test your knowledge</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            <SelectItem value="mathematics">Mathematics</SelectItem>
            <SelectItem value="science">Science</SelectItem>
            <SelectItem value="history">History</SelectItem>
            <SelectItem value="programming">Programming</SelectItem>
          </SelectContent>
        </Select>

        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Difficulties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Quiz List */}
      {quizzes.length === 0 ? (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No quizzes yet
          </h3>
          <p className="text-gray-600 mb-4">
            Upload notes and generate your first AI-powered quiz!
          </p>
          <Button onClick={() => window.location.href = '/notes'}>
            Go to Notes
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz._id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
}
