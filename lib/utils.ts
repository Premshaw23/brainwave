
// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateInviteCode(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}


export function calculateMastery(attempts: any[]): number {
  if (attempts.length === 0) return 0;
  
  // Get last 5 attempts
  const recentAttempts = attempts.slice(-5);
  const totalScore = recentAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
  
  return Math.round(totalScore / recentAttempts.length);
}

export function formatTimeSpent(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }
  
  return `${minutes}m ${remainingSeconds}s`;
}

export function getSubjectColor(subject: string): string {
  const colors: Record<string, string> = {
    mathematics: 'bg-blue-500',
    science: 'bg-green-500',
    history: 'bg-yellow-500',
    english: 'bg-purple-500',
    programming: 'bg-indigo-500',
    physics: 'bg-cyan-500',
    chemistry: 'bg-teal-500',
    biology: 'bg-emerald-500',
  };
  
  return colors[subject.toLowerCase()] || 'bg-gray-500';
}


export function calculateStreak(attempts: any[]): number {
  if (attempts.length === 0) return 0;

  // Sort attempts by date
  const sortedAttempts = [...attempts].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const attempt of sortedAttempts) {
    const attemptDate = new Date(attempt.completedAt);
    attemptDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (currentDate.getTime() - attemptDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === streak || (streak === 0 && diffDays === 0)) {
      streak++;
      currentDate = attemptDate;
    } else if (diffDays > streak + 1) {
      break;
    }
  }

  return streak;
}

export function calculateMasteryBySubject(attempts: any[]): any[] {
  const subjectStats: Record<string, { scores: number[]; attempts: number }> = {};

  attempts.forEach((attempt: any) => {
    const quiz = attempt.quizId;
    if (!quiz) return;

    const subject = quiz.subject;
    if (!subjectStats[subject]) {
      subjectStats[subject] = { scores: [], attempts: 0 };
    }

    subjectStats[subject].scores.push(attempt.score);
    subjectStats[subject].attempts++;
  });

  return Object.entries(subjectStats).map(([subject, data]) => {
    // Calculate mastery as weighted average of recent attempts
    const recentScores = data.scores.slice(-5); // Last 5 attempts
    const mastery = Math.round(
      recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length
    );

    return {
      subject,
      mastery: isNaN(mastery) ? 0 : mastery,
      attempts: data.attempts,
      recentScore: data.scores[data.scores.length - 1] || 0,
    };
  });
}
