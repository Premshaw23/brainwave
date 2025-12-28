
// lib/socket.ts - Client-side Socket.io hook

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { io, Socket } from 'socket.io-client';

// Helper to decode JWT and extract userId
function getUserIdFromToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || payload.sub || null;
  } catch {
    return null;
  }
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    let socket: Socket | null = null;
    const setupSocket = async () => {
      if (!user) return;
      const token = await user.getIdToken();
      const userId = getUserIdFromToken(token);
      if (!userId) return;
      socket = io(SOCKET_URL, {
        auth: { userId },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      socket.on('connect', () => {
        console.log('✅ Socket connected');
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
        setIsConnected(false);
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      socketRef.current = socket;
    };
    setupSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  return {
    socket: socketRef.current,
    isConnected,
  };
}