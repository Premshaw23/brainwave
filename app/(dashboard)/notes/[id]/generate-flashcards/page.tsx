'use client';

import { use, useEffect, useState } from 'react';
import { useAuth } from '../../../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function GenerateFlashcardsPage({ params }: { params: Promise<{ id: string } >}) {
  const { user } = useAuth();
  const router = useRouter();
  const [note, setNote] = useState<any>(null);
  const [numCards, setNumCards] = useState([10]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {id}=use(params);

  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    if (!user) return;
    const token = await user.getIdToken();
    const response = await fetch(`/api/notes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (data.success) setNote(data.note);
  };

  const handleGenerate = async () => {
    setError('');
    setLoading(true);

    try {
      if (!user) return;
      const token = await user.getIdToken();
      const response = await fetch('/api/ai/generate-flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          noteId: id,
          numCards: numCards[0],
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/flashcards/${data.flashcardSetId}/study`);
      } else {
        setError(data.error || 'Failed to generate flashcards');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate flashcards');
    } finally {
      setLoading(false);
    }
  };

  if (!note) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Note
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            Generate AI Flashcards
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              {error}
            </div>
          )}

          <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <p className="text-sm font-medium text-purple-900 mb-1">
              Creating flashcards from: {note.title}
            </p>
            <p className="text-xs text-purple-700">
              Subject: {note.subject}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Number of Flashcards</Label>
              <span className="text-2xl font-bold text-purple-600">{numCards[0]}</span>
            </div>
            <Slider
              value={numCards}
              onValueChange={setNumCards}
              min={5}
              max={30}
              step={5}
              disabled={loading}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              More cards = better coverage of the material
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-900">Estimated Time</p>
                <p className="text-xs text-purple-600 mt-1">AI generation: ~10-15 seconds</p>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {numCards[0] * 2} min
              </div>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Flashcards...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Flashcards
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Powered by OpenAI GPT-4 • Takes ~10-15 seconds
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
