
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

export function calculateStreak(lastActive: Date): number {
  const now = new Date();
  const lastActiveDate = new Date(lastActive);
  
  // Reset time to midnight for accurate day comparison
  now.setHours(0, 0, 0, 0);
  lastActiveDate.setHours(0, 0, 0, 0);
  
  const diffTime = now.getTime() - lastActiveDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // If last active was today or yesterday, maintain streak
  if (diffDays <= 1) {
    return 1; // Streak continues
  }
  
  return 0; // Streak broken
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
