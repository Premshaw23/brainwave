'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FlashcardList from '@/components/flashcards/FlashcardList';
import Link from 'next/link';

export default function FlashcardsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Flashcards</h1>
          <p className="text-gray-600 mt-1">Study and master your concepts</p>
        </div>

        <Link href="/notes">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create from Notes
          </Button>
        </Link>
      </div>

      <FlashcardList />
    </div>
  );
}
