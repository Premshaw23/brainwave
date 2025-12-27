// lib/notifications.ts
import Notification from '@/models/Notification';

interface CreateNotificationInput {
  userId: string;
  type: 'like' | 'comment' | 'other';
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
    return notification;
  } catch (error) {
    console.error('[createNotification] Error:', error);
    return null;
  }
}
