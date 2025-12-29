'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FlashcardList from '@/components/flashcards/FlashcardList';
import Link from 'next/link';

export default function FlashcardsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-linear-to-r from-indigo-50 to-white rounded-xl p-6 shadow-sm mb-2">
        <div>
          <h1 className="text-4xl font-extrabold text-indigo-800 tracking-tight">Flashcards</h1>
          <p className="text-gray-600 mt-2 text-lg">Study and master your concepts</p>
        </div>
        <Link href="/notes">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg shadow">
            <Plus className="w-5 h-5 mr-2" />
            Create from Notes
          </Button>
        </Link>
      </div>

      <div className="mt-4">
        <FlashcardList />
      </div>
    </div>
  );
}
