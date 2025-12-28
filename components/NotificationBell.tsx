
// components/NotificationBell.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/lib/socket';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket } = useSocket();


  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    // Listen for real-time notifications
    if (socket) {
      socket.on('notification', (notif: any) => {
        setNotifications((prev) => [notif, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
    }

    return () => {
      clearInterval(interval);
      if (socket) socket.off('notification');
    };
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notificationId }),
      });

      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-3 border-b">
          <h3 className="font-semibold">Notifications</h3>
        </div>
        <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No notifications
            </div>
          ) : (
            notifications.map((notif) => {
              const isGroupInvite = notif.type === 'system' && notif.message?.toLowerCase().includes('invited to join the group');
              return (
                <DropdownMenuItem
                  key={notif._id}
                  className={`p-3 cursor-pointer ${isGroupInvite ? 'bg-indigo-50' : ''}`}
                  onClick={() => {
                    markAsRead(notif._id);
                    if (isGroupInvite && notif.link) {
                      window.location.href = notif.link;
                    }
                  }}
                >
                  <div className={notif.read ? 'opacity-60' : ''}>
                    <p className="font-medium text-sm">{notif.title}</p>
                    <p className="text-xs text-gray-600">{notif.message}</p>
                    {isGroupInvite && notif.link && (
                      <span className="text-xs text-indigo-600 underline mt-1 inline-block">Go to group</span>
                    )}
                  </div>
                </DropdownMenuItem>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}