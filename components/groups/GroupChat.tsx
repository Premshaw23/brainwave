// components/groups/GroupChat.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSocket } from '@/lib/socket';

interface Message {
  _id: string;
  sender: {
    _id: string;
    displayName: string;
    avatar?: string;
  };
  content: string;
  type: 'text' | 'quiz_share' | 'flashcard_share';
  metadata?: any;
  createdAt: string;
}

interface GroupChatProps {
  groupId: string;
  currentUserId: string;
}

export default function GroupChat({ groupId, currentUserId }: GroupChatProps) {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch initial messages
  useEffect(() => {
    fetchMessages();
  }, [groupId]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Join group room
    socket.emit('join_group', { groupId });

    // Listen for new messages
    socket.on('new_message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    // Listen for typing indicators
    socket.on('user_typing', ({ userId, displayName }) => {
      if (userId !== currentUserId) {
        setTypingUsers((prev) => new Set(prev).add(displayName));
      }
    });

    socket.on('typing_stopped', ({ userId }) => {
      setTypingUsers((prev) => {
        const updated = new Set(prev);
        // Find and remove by userId (we'd need to track userId -> displayName)
        return updated;
      });
    });

    return () => {
      socket.emit('leave_group', { groupId });
      socket.off('new_message');
      socket.off('user_typing');
      socket.off('typing_stopped');
    };
  }, [socket, groupId, currentUserId]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/groups/${groupId}/messages?limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
        setTimeout(scrollToBottom, 100);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTyping = () => {
    if (!socket) return;

    socket.emit('typing_start', { groupId });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing_stop', { groupId });
    }, 2000);
  };

  const handleSend = async () => {
    if (!socket || !newMessage.trim()) return;

    setSending(true);

    socket.emit('send_message', {
      groupId,
      content: newMessage.trim(),
      type: 'text',
    });

    setNewMessage('');
    setSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: string) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - messageDate.getTime()) / 60000);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    return messageDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border">
      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-sm text-yellow-800">
          Reconnecting...
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwn = message.sender._id === currentUserId;
            const showAvatar = 
              index === 0 || 
              messages[index - 1].sender._id !== message.sender._id;

            return (
              <div
                key={message._id}
                className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
              >
                {showAvatar ? (
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={message.sender.avatar} />
                    <AvatarFallback>
                      {message.sender.displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-8" />
                )}

                <div className={`flex-1 ${isOwn ? 'items-end' : 'items-start'}`}>
                  {showAvatar && !isOwn && (
                    <p className="text-xs font-medium text-gray-700 mb-1">
                      {message.sender.displayName}
                    </p>
                  )}
                  
                  <div
                    className={`inline-block max-w-md rounded-lg px-4 py-2 ${
                      isOwn
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap wrap-break-word">
                      {message.content}
                    </p>
                  </div>

                  <p className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : ''}`}>
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}

        {/* Typing Indicator */}
        {typingUsers.size > 0 && (
          <div className="flex gap-3 text-gray-500 text-sm italic">
            <div className="w-8" />
            <p>
              {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            onKeyPress={handleKeyPress}
            disabled={!isConnected || sending}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!isConnected || !newMessage.trim() || sending}
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}