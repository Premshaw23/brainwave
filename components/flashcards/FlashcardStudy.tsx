'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '../../context/AuthContext';
import { showError } from '@/lib/toast';

interface FlashcardStudyProps {
  flashcardId: string;
  cards: Array<{
    front: string;
    back: string;
    mastered: boolean;
  }>;
  onComplete?: () => void;
}

export default function FlashcardStudy({ 
  flashcardId, 
  cards: initialCards,
  onComplete 
}: FlashcardStudyProps) {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState(initialCards);
  const [sessionStats, setSessionStats] = useState({
    studied: 0,
    mastered: 0,
    needsReview: 0,
  });

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMastered = async (mastered: boolean) => {
    try {
      if (!user) throw new Error('Not authenticated');
      const token = await user.getIdToken();
      await fetch(`/api/flashcards/${flashcardId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cardIndex: currentIndex,
          mastered,
        }),
      });

      // Update local state
      const updatedCards = [...cards];
      updatedCards[currentIndex].mastered = mastered;
      setCards(updatedCards);

      // Update stats
      setSessionStats(prev => ({
        studied: prev.studied + 1,
        mastered: mastered ? prev.mastered + 1 : prev.mastered,
        needsReview: !mastered ? prev.needsReview + 1 : prev.needsReview,
      }));

      // Move to next card
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      } else {
        onComplete?.();
      }
    } catch (error) {
      showError('Failed to update review');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 py-8 px-4">
      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between text-base text-gray-600 font-semibold">
          <span>Card {currentIndex + 1} of {cards.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-3 rounded-lg" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-8">
        <Card className="rounded-xl shadow-md">
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-gray-900">{sessionStats.studied}</p>
            <p className="text-base text-gray-600">Studied</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-md">
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-green-600">{sessionStats.mastered}</p>
            <p className="text-base text-gray-600">Mastered</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-md">
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-orange-600">{sessionStats.needsReview}</p>
            <p className="text-base text-gray-600">Need Review</p>
          </CardContent>
        </Card>
      </div>

      {/* Flashcard */}
      <Card className="min-h-100 cursor-pointer bg-linear-to-br from-white via-indigo-50 to-indigo-100 shadow-2xl rounded-2xl border border-gray-200" onClick={handleFlip}>
        <CardContent className="flex items-center justify-center p-16">
          <div className="text-center space-y-6">
            <div className="text-base font-semibold text-indigo-700 uppercase tracking-wide">
              {isFlipped ? 'Back' : 'Front'}
            </div>
            <div className="text-3xl font-bold text-gray-900 leading-relaxed">
              {isFlipped ? currentCard.back : currentCard.front}
            </div>
            {!isFlipped && (
              <div className="flex items-center justify-center gap-3 text-base text-indigo-500 mt-8">
                <RotateCw className="w-5 h-5" />
                <span>Click to flip</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex items-center justify-between mt-8">
        <Button
          variant="outline"
          className="rounded-xl text-lg font-semibold px-6 py-3 shadow-md hover:bg-indigo-50"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>

        {isFlipped && (
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="rounded-xl text-lg font-semibold px-6 py-3 text-orange-600 border-orange-600 hover:bg-orange-50 shadow-md"
              onClick={() => handleMastered(false)}
            >
              <X className="w-5 h-5 mr-2" />
              Need Review
            </Button>
            <Button
              className="rounded-xl text-lg font-semibold px-6 py-3 bg-green-600 text-white shadow-md hover:bg-green-700"
              onClick={() => handleMastered(true)}
            >
              <Check className="w-5 h-5 mr-2" />
              Mastered
            </Button>
          </div>
        )}

        <Button
          variant="outline"
          className="rounded-xl text-lg font-semibold px-6 py-3 shadow-md hover:bg-indigo-50"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
        >
          Next
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
