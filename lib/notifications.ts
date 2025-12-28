// lib/notifications.ts

import Notification from '@/models/Notification';
// Dynamically require server-side emit helper and socket instance if available
let emitNotification: ((io: any, userId: string, notification: any) => void) | null = null;

// Extend global type to include 'io'
declare global {
  // eslint-disable-next-line no-var
  var io: any;
}

let io: any = null;
try {
  emitNotification = require('./emitNotification').emitNotification;
  io = global.io || null; // You must set global.io = your Socket.io server instance in your server entry
} catch {}

interface CreateNotificationInput {
  userId: string;
  type:
    | 'like'
    | 'comment'
    | 'group_message'
    | 'achievement'
    | 'streak'
    | 'xp'
    | 'level_up'
  | 'system'
  | 'reminder'
  | 'mention';
  title: string;
  message: string;
  link?: string;
}

export async function createNotification({ userId, type, title, message, link }: CreateNotificationInput) {
  try {
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      link,
      read: false,
      createdAt: new Date(),
    });
    await notification.save();

    // Emit real-time notification if possible
    if (emitNotification && io) {
      emitNotification(io, userId, notification);
    }

    return notification;
  } catch (error) {
    console.error('[createNotification] Error:', error);
    return null;
  }
}
