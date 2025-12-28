// lib/emitNotification.ts
import { Server } from 'socket.io';

/**
 * Emits a notification to a specific user via Socket.io
 * @param io - The Socket.io server instance
 * @param userId - The user to notify
 * @param notification - The notification object (as saved in DB)
 */
export function emitNotification(io: Server, userId: string, notification: any) {
  io.to(userId).emit('notification', notification);
}
