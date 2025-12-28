'use client';

import React, { use, useEffect, useState } from 'react';
import { useAuth } from './../../../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import FlashcardStudy from '@/components/flashcards/FlashcardStudy';

export default function FlashcardStudyPage({ params }: { params:Promise< { id: string }> }) {
  const router = useRouter();
  const [flashcard, setFlashcard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const { user } = useAuth();
  const {id}=use(params);

  useEffect(() => {
    const fetchFlashcard = async (userObj: any) => {
      try {
        if (!userObj) return;
        const token = await userObj.getIdToken();
        const response = await fetch(`/api/flashcards/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          setFlashcard(data.flashcard);
        }
      } catch (error) {
        console.error('Failed to fetch flashcard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcard(user);
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!flashcard) {
    return <div>Flashcard not found</div>;
  }

  if (completed) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Flashcards
        </Button>

        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Study Session Complete!
            </h2>
            <p className="text-gray-600 mb-6">
              Great work! You've reviewed all cards in this set.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => setCompleted(false)}>
                Study Again
              </Button>
              <Button variant="outline" onClick={() => router.push('/flashcards')}>
                Back to All Sets
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-right">
          <h2 className="text-xl font-bold text-gray-900">{flashcard.title}</h2>
          <p className="text-sm text-gray-600 capitalize">{flashcard.subject}</p>
        </div>
      </div>

      <FlashcardStudy
        flashcardId={id}
        cards={flashcard.cards}
        onComplete={() => setCompleted(true)}
      />
    </div>
  );
}
