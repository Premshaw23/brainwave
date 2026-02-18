'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Brain, Clock, AlertCircle, Sparkles, Wand2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { showError } from '@/lib/toast';

interface QuizGeneratorProps {
  noteId: string;
  noteTitle: string;
}

const difficultyConfig = {
  easy: { color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', label: 'Basic Concepts', icon: '🌱' },
  medium: { color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', label: 'Applied Knowledge', icon: '🚀' },
  hard: { color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400', label: 'Advanced Analysis', icon: '🔥' },
};

export default function QuizGenerator({ noteId, noteTitle }: QuizGeneratorProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [difficulty, setDifficulty] = useState('medium');
  const [numQuestions, setNumQuestions] = useState([5]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const statusMessages = [
    "Analyzing your notes...",
    "Extracting key concepts...",
    "Drafting challenging questions...",
    "Generating detailed explanations...",
    "Finalizing your quiz..."
  ];

  const handleGenerate = async () => {
    if (!user) {
      showError('Please sign in to generate a quiz');
      return;
    }

    setError('');
    setLoading(true);
    setProgress(5);
    setStatus(statusMessages[0]);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (Math.random() * 8);
        if (next >= 95) {
          clearInterval(progressInterval);
          return 95;
        }

        // Update status message based on progress
        const msgIndex = Math.floor((next / 100) * statusMessages.length);
        if (statusMessages[msgIndex]) setStatus(statusMessages[msgIndex]);

        return next;
      });
    }, 1000);

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          noteId,
          difficulty,
          numQuestions: numQuestions[0],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate quiz');
      }

      if (data.success) {
        clearInterval(progressInterval);
        setProgress(100);
        setStatus("Quiz ready!");

        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#8b5cf6', '#ec4899'],
        });

        setTimeout(() => {
          router.push(`/quizzes/${data.quizId}/take`);
        }, 1200);
      }
    } catch (err: any) {
      clearInterval(progressInterval);
      setProgress(0);
      console.error('Quiz generation error:', err);
      setError(err.message || 'The AI is currently busy. Please try again in a moment.');
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-2xl mx-auto"
    >
      <Card className="card-premium overflow-hidden border-0 rounded-3xl relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full -ml-16 -mb-16 blur-3xl" />

        <CardHeader className="pb-4 sm:pb-8 border-b border-border/50 bg-slate-50/50 dark:bg-slate-800/20">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="p-3 w-fit rounded-2xl bg-primary shadow-xl shadow-primary/20">
              <Brain className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">AI Quiz Studio</CardTitle>
              <CardDescription className="text-base mt-1">
                Generate a custom quiz from <span className="text-foreground font-semibold">"{noteTitle}"</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 pt-8">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Alert variant="destructive" className="rounded-2xl border-destructive/20 bg-destructive/5">
                  <AlertCircle className="h-5 w-5" />
                  <AlertTitle className="font-bold">System Alert</AlertTitle>
                  <AlertDescription className="text-sm opacity-90">{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Difficulty Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Difficulty</Label>
                <Badge variant="outline" className={cn("border-0 font-bold", difficultyConfig[difficulty as keyof typeof difficultyConfig].color)}>
                  {difficultyConfig[difficulty as keyof typeof difficultyConfig].icon} {difficulty.toUpperCase()}
                </Badge>
              </div>

              <Select value={difficulty} onValueChange={setDifficulty} disabled={loading}>
                <SelectTrigger className="h-14 rounded-2xl border-border bg-background hover:bg-slate-50 dark:hover:bg-slate-800 transition-all focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border shadow-2xl p-1">
                  {Object.entries(difficultyConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key} className="rounded-xl py-3 focus:bg-primary/5">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{config.icon}</span>
                        <div className="flex flex-col">
                          <span className="font-bold capitalize">{key}</span>
                          <span className="text-xs text-muted-foreground">{config.label}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Question Count */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Questions</Label>
                <div className="text-primary font-black text-xl">{numQuestions[0]}</div>
              </div>
              <div className="pt-4 px-2">
                <Slider
                  value={numQuestions}
                  onValueChange={setNumQuestions}
                  min={3}
                  max={20}
                  step={1}
                  disabled={loading}
                />
                <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground mt-4">
                  <span>Quick Test</span>
                  <span>Mastery</span>
                </div>
              </div>
            </div>
          </div>

          {/* Time Estimate */}
          {!loading && (
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="flex items-center gap-4 p-5 rounded-2xl bg-secondary/50 border border-border/50"
            >
              <div className="p-2 rounded-xl bg-background shadow-sm">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold">Estimated Session</p>
                <p className="text-xs text-muted-foreground">Approximately {Math.ceil(numQuestions[0] * 1.5)} minutes to complete</p>
              </div>
            </motion.div>
          )}

          {/* Action Area */}
          <div className="relative pt-4">
            {loading ? (
              <div className="space-y-6">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary animate-pulse">
                    {progress < 100 ? <Sparkles className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span className="text-sm font-bold">{status}</span>
                  </div>
                  <span className="text-4xl font-black text-foreground">{Math.round(progress)}%</span>
                </div>

                <div className="relative h-3 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                </div>

                <p className="text-center text-xs text-muted-foreground font-medium italic">
                  "The beautiful thing about learning is that nobody can take it away from you."
                </p>
              </div>
            ) : (
              <Button
                onClick={handleGenerate}
                disabled={!user}
                className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 text-lg font-bold group"
              >
                <span className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  Generate My Quiz
                </span>
              </Button>
            )}
          </div>
        </CardContent>

        <CardFooter className="pb-8 pt-4 flex flex-col items-center gap-2">
          <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">
            <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Powered by Gemini 1.5</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>Secure & Private</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

