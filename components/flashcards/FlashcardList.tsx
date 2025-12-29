'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Brain, Trash2, Calendar, BookOpen, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '../../context/AuthContext';
import { showError } from '@/lib/toast';

export default function FlashcardList() {
  const { user } = useAuth();
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      if (!user) throw new Error('Not authenticated');
      const token = await user.getIdToken();
      const response = await fetch('/api/flashcards', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setFlashcards(data.flashcards);
      }
    } catch (error) {
      showError('Failed to fetch flashcards');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this flashcard set?')) return;

    try {
      if (!user) throw new Error('Not authenticated');
      const token = await user.getIdToken();
      const response = await fetch(`/api/flashcards/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setFlashcards(flashcards.filter(f => f._id !== id));
      }
    } catch (error) {
      showError('Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16">
        <div className="bg-linear-to-br from-white via-indigo-50 to-indigo-100 rounded-2xl shadow-lg p-10 text-center">
          <Brain className="w-16 h-16 text-indigo-300 mx-auto mb-4" />
          <p className="text-indigo-700 text-lg font-semibold">No flashcards yet. Generate some from your notes!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {flashcards.map((flashcard) => {
          const progress = flashcard.cardCount > 0
            ? Math.round((flashcard.masteredCount / flashcard.cardCount) * 100)
            : 0;

          return (
            <Card key={flashcard._id} className="bg-linear-to-br from-white via-indigo-50 to-indigo-100 shadow-2xl rounded-2xl border border-gray-200 hover:scale-[1.03] hover:shadow-indigo-200/50 transition-all duration-200">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                      {flashcard.title}
                    </h3>
                    <Badge className="capitalize px-3 py-1 text-base font-semibold rounded-xl shadow-sm bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {flashcard.subject}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-base">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold text-gray-900">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3 rounded-lg" />

                  <div className="flex items-center justify-between text-base text-gray-600">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      <span>{flashcard.cardCount} cards</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      <span>{flashcard.masteredCount} mastered</span>
                    </div>
                  </div>

                  {flashcard.lastReviewed && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Last reviewed: {new Date(flashcard.lastReviewed).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Link href={`/flashcards/${flashcard._id}/study`} className="flex-1">
                    <Button className="w-full rounded-xl bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition-all duration-150 px-6">
                      <Brain className="w-4 h-4 mr-2" />
                      Study
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-xl shadow-sm hover:bg-red-50"
                    onClick={() => handleDelete(flashcard._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
