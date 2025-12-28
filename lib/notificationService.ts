// lib/notificationService.ts
import { createNotification } from './notifications';

/**
 * Notify user of a streak milestone (e.g., 3, 7, 14, 30 days)
 */
export async function notifyStreakMilestone(userId: string, streak: number) {
  return createNotification({
    userId,
    type: 'streak',
    title: `🔥 ${streak}-Day Streak!`,
    message: `Congrats! You've reached a ${streak}-day learning streak. Keep it up!`,
    link: '/dashboard',
  });
}

/**
 * Notify user of a level up
 */
export async function notifyLevelUp(userId: string, level: number) {
  return createNotification({
    userId,
    type: 'level_up',
    title: `Level Up!`,
    message: `You've reached level ${level}. Awesome progress!`,
    link: '/profile',
  });
}

/**
 * Notify user of a group message
 */
export async function notifyGroupMessage(userId: string, groupName: string, groupId: string) {
  return createNotification({
    userId,
    type: 'group_message',
    title: `New Group Message`,
    message: `There's a new message in group "${groupName}"`,
    link: `/dashboard/groups/${groupId}`,
  });
}

// Add more notification helpers as needed for XP, system, reminders, mentions, etc.
