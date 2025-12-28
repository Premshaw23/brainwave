'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '../../context/AuthContext';

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
      console.error('Failed to update review:', error);
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Card {currentIndex + 1} of {cards.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{sessionStats.studied}</p>
            <p className="text-sm text-gray-600">Studied</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{sessionStats.mastered}</p>
            <p className="text-sm text-gray-600">Mastered</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{sessionStats.needsReview}</p>
            <p className="text-sm text-gray-600">Need Review</p>
          </CardContent>
        </Card>
      </div>

      {/* Flashcard */}
      <Card className="min-h-100 cursor-pointer" onClick={handleFlip}>
        <CardContent className="flex items-center justify-center p-12">
          <div className="text-center space-y-4">
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              {isFlipped ? 'Back' : 'Front'}
            </div>
            <div className="text-2xl font-semibold text-gray-900 leading-relaxed">
              {isFlipped ? currentCard.back : currentCard.front}
            </div>
            {!isFlipped && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-8">
                <RotateCw className="w-4 h-4" />
                <span>Click to flip</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {isFlipped && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleMastered(false)}
              className="text-orange-600 border-orange-600 hover:bg-orange-50"
            >
              <X className="w-4 h-4 mr-2" />
              Need Review
            </Button>
            <Button
              onClick={() => handleMastered(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-2" />
              Mastered
            </Button>
          </div>
        )}

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
