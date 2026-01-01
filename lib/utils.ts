
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



// Calculates the current streak (including today if active, or up to yesterday if not)
export function calculateStreak(attempts: any[]): number {
    // INFO FOR USERS:
    // Your current streak resets to 0 if you miss a day.
    // Only consecutive days up to today or yesterday count for the current streak.
    // Your longest streak is your all-time best sequence of consecutive days.
  if (attempts.length === 0) {
    console.debug('[calculateStreak] No attempts');
    return 0;
  }

  // Get unique days with activity (UTC)
  const daysSet = new Set(
    attempts.map(a => {
      const d = new Date(a.completedAt);
      d.setUTCHours(0, 0, 0, 0);
      return d.getTime();
    })
  );
  if (daysSet.size === 0) {
    console.debug('[calculateStreak] No unique days');
    return 0;
  }

  // Sort days descending
  const days = Array.from(daysSet).sort((a, b) => b - a);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setUTCDate(today.getUTCDate() - 1);

  console.debug('[calculateStreak] Days:', days.map(ts => new Date(ts).toISOString()));
  console.debug('[calculateStreak] Today:', today.toISOString(), 'Yesterday:', yesterday.toISOString());

  // If user was active today or yesterday, start streak
  let streak = 0;
  let expected = days[0] === today.getTime() ? today.getTime() : (days[0] === yesterday.getTime() ? yesterday.getTime() : null);
  if (expected === null) {
    console.debug('[calculateStreak] No activity today or yesterday. Streak = 0');
    return 0;
  }

  for (let i = 0; i < days.length; i++) {
    if (days[i] !== expected) {
      console.debug(`[calculateStreak] Break at i=${i}, days[i]=${new Date(days[i]).toISOString()}, expected=${new Date(expected).toISOString()}`);
      break;
    }
    streak++;
    expected -= 24 * 60 * 60 * 1000; // go to previous day
  }
  console.debug('[calculateStreak] Final streak:', streak);
  return streak;
}

// Calculates the longest streak ever
export function calculateLongestStreak(attempts: any[]): number {
  if (attempts.length === 0) return 0;
  // Get unique days with activity (UTC)
  const daysSet = new Set(
    attempts.map(a => {
      const d = new Date(a.completedAt);
      d.setUTCHours(0, 0, 0, 0);
      return d.getTime();
    })
  );
  if (daysSet.size === 0) return 0;
  // Sort ascending
  const days = Array.from(daysSet).sort((a, b) => a - b);
  let longest = 1;
  let current = 1;
  for (let i = 1; i < days.length; i++) {
    if (days[i] - days[i - 1] === 24 * 60 * 60 * 1000) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }
  return longest;
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
