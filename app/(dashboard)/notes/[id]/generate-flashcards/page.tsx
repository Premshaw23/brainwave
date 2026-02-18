'use client';

import { use, useEffect, useState } from 'react';
import AppLoader from '@/components/ui/AppLoader';
import { showError } from '@/lib/toast';
import { useAuth } from '../../../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Sparkles, Brain, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';

export default function GenerateFlashcardsPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth();
  const router = useRouter();
  const [note, setNote] = useState<any>(null);
  const [numCards, setNumCards] = useState([10]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { id } = use(params);

  useEffect(() => {
    fetchNote();
  }, [id, user]);

  const fetchNote = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setNote(data.note);
    } catch (err) {
      console.error("Failed to fetch note", err);
    }
  };

  const handleGenerate = async () => {
    if (!user) return;
    setError('');
    setLoading(true);

    try {
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
        throw new Error(data.error || 'The AI is currently unavailable. Please try again.');
      }
    } catch (err: any) {
      setError(err.message);
      showError(err.message);
      setLoading(false);
    }
  };

  if (!note) return (
    <div className="h-[80vh] flex items-center justify-center">
      <AppLoader message="Preparing your workspace..." />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto py-8 px-4 space-y-8"
    >
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="rounded-xl hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Materials
        </Button>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3 h-3" /> AI Powered
        </div>
      </div>

      <Card className="card-premium border-0 rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-24 -mt-24 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full -ml-24 -mb-24 blur-3xl" />

        <CardHeader className="bg-slate-50/50 dark:bg-slate-800/20 border-b border-border/50 p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="p-4 rounded-2xl bg-primary shadow-2xl shadow-primary/30">
              <Zap className="w-10 h-10 text-primary-foreground" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-3xl sm:text-4xl font-extrabold tracking-tight">AI Flashcard Forge</CardTitle>
              <CardDescription className="text-base">
                Synthesizing essential knowledge from <span className="text-foreground font-bold">"{note.title}"</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 sm:p-10 space-y-10">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-4 text-destructive text-sm font-medium flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Range Selection */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Card Quantity</Label>
                <div className="px-3 py-1 rounded-lg bg-primary text-primary-foreground font-mono font-black text-xl">
                  {numCards[0]}
                </div>
              </div>
              <div className="pt-6">
                <Slider
                  value={numCards}
                  onValueChange={setNumCards}
                  min={5}
                  max={40}
                  step={1}
                  disabled={loading}
                />
                <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground mt-4">
                  <span>Concise</span>
                  <span>Comprehensive</span>
                </div>
              </div>
            </div>

            {/* Estimates */}
            <div className="space-y-4">
              <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Session Projection</Label>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/50">
                  <div className="p-2 rounded-xl bg-background shadow-sm">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Study Time</p>
                    <p className="text-sm font-black text-foreground">~{numCards[0] * 1.5} Minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/50">
                  <div className="p-2 rounded-xl bg-background shadow-sm">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Complexity</p>
                    <p className="text-sm font-black text-foreground">Moderate / High</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full h-20 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/20 hover:shadow-primary/30 transition-all text-xl font-black group relative overflow-hidden"
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-primary-foreground/50" />
                    <span>Forging Knowledge...</span>
                  </div>
                  <span className="text-[10px] font-bold opacity-50 mt-1 uppercase tracking-[0.2em]">Refining content chunks</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 group-hover:scale-125 transition-transform" />
                  <span>Generate Collection</span>
                </div>
              )}
            </Button>
          </div>
        </CardContent>

        <CardFooter className="bg-slate-50/50 dark:bg-slate-800/20 border-t border-border/50 p-6 flex flex-col items-center gap-2">
          <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.3em]">
            Enhanced by Gemini 1.5 • Secure PII Protection
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
