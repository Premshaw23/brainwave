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
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="text-center py-12">
        <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No flashcards yet. Generate some from your notes!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {flashcards.map((flashcard) => {
        const progress = flashcard.cardCount > 0
          ? Math.round((flashcard.masteredCount / flashcard.cardCount) * 100)
          : 0;

        return (
          <Card key={flashcard._id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {flashcard.title}
                  </h3>
                  <Badge className="capitalize">{flashcard.subject}</Badge>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold text-gray-900">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{flashcard.cardCount} cards</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Brain className="w-4 h-4" />
                    <span>{flashcard.masteredCount} mastered</span>
                  </div>
                </div>

                {flashcard.lastReviewed && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>
                      Last reviewed: {new Date(flashcard.lastReviewed).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Link href={`/flashcards/${flashcard._id}/study`} className="flex-1">
                  <Button className="w-full">
                    <Brain className="w-4 h-4 mr-2" />
                    Study
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="icon"
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
  );
}
