// components/groups/GroupChat.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Send, Loader2, UserPlus, X, Check } from 'lucide-react';
import AppLoader from '@/components/ui/AppLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSocket } from '@/lib/socket';
import { showError, showSuccess } from '@/lib/toast';

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
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Invite modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);

  const handleInvite = async () => {
    if (!inviteEmail) return;
    setInviteLoading(true);
    try {
      if (!user) throw new Error('Not authenticated');
      const token = await user.getIdToken();
      const res = await fetch(`/api/groups/${groupId}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ inviteeEmail: inviteEmail }),
      });
      const data = await res.json();
      if (data.success) {
        showSuccess('Invite sent successfully!');
        setInviteEmail('');
        setShowInviteModal(false);
      } else {
        showError(data.error || 'Failed to send invite');
      }
    } catch (err: any) {
      showError(err.message || 'Failed to send invite');
    } finally {
      setInviteLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [groupId]);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    if (!loading) scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (!socket || !groupId || !currentUserId) return;

    socket.emit('join_group', { groupId });

    const handleNewMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    };
    socket.on('new_message', handleNewMessage);

    const handleUserTyping = ({ userId, displayName }: any) => {
      if (userId !== currentUserId) {
        setTypingUsers((prev) => new Set(prev).add(displayName));
      }
    };
    socket.on('user_typing', handleUserTyping);

    const handleTypingStopped = ({ userId }: any) => {
      setTypingUsers((prev) => {
        const updated = new Set(prev);
        return updated;
      });
    };
    socket.on('typing_stopped', handleTypingStopped);

    return () => {
      socket.emit('leave_group', { groupId });
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('typing_stopped', handleTypingStopped);
    };
  }, [socket, groupId, currentUserId]);

  const fetchMessages = async () => {
    try {
      if (!user) throw new Error('Not authenticated');
      const token = await user.getIdToken();
      const response = await fetch(`/api/groups/${groupId}/messages?limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
        setTimeout(scrollToBottom, 100);
      } else {
        showError(data.error || 'Failed to fetch messages');
      }
    } catch (error: any) {
      console.error('Failed to fetch messages:', error);
      showError(error.message || 'Failed to fetch messages');
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

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

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
    setTimeout(scrollToBottom, 100); // Ensure scroll after sending
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: string) => {
    const messageDate = new Date(date);
    return messageDate.toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata',
    });
  };

  const formatDate = (date: string) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return messageDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const shouldShowDateDivider = (index: number) => {
    if (index === 0) return true;
    const currentDate = new Date(messages[index].createdAt).toDateString();
    const prevDate = new Date(messages[index - 1].createdAt).toDateString();
    return currentDate !== prevDate;
  };

  if (loading) {
    return <AppLoader message="Loading chat…" size="md" />;
  }

  return (
    <div className="flex flex-col h-full bg-linear-to-b from-white via-indigo-50 to-indigo-100">
      {/* Minimal Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-indigo-100 bg-transparent">
        <h2 className="font-semibold text-base text-indigo-700">Group Chat</h2>
        <Button
          onClick={() => setShowInviteModal(true)}
          variant="ghost"
          size="icon"
          className="text-indigo-500 hover:text-indigo-700"
        >
          <UserPlus className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages Area - visually focused */}
      <div className="flex-1 overflow-y-auto px-0 py-4 flex flex-col items-center">
        <div className="w-full max-w-2xl px-2">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-500 text-sm">No messages yet</p>
                <p className="text-gray-400 text-xs mt-1">Start the conversation!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message, index) => {
                const isOwn = message.sender._id === currentUserId;
                const showAvatar =
                  !isOwn && (
                    index === messages.length - 1 ||
                    messages[index + 1]?.sender._id !== message.sender._id
                  );
                const showName =
                  !isOwn && (
                    index === 0 ||
                    messages[index - 1].sender._id !== message.sender._id
                  );
                const isShortMessage = message.content.length < 40;
                return (
                  <div key={message._id} className="flex flex-col items-stretch">
                    {shouldShowDateDivider(index) && (
                      <div className="flex justify-center my-2">
                        <div className="bg-indigo-100 text-indigo-700 rounded-full px-3 py-0.5 text-xs font-medium shadow-sm">
                          {formatDate(message.createdAt)}
                        </div>
                      </div>
                    )}
                    <div className={`flex gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      {!isOwn && (
                        <div className="shrink-0 self-end">
                          {showAvatar ? (
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={message.sender.avatar} />
                              <AvatarFallback className="bg-indigo-200 text-indigo-700 text-xs">
                                {message.sender.displayName.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="w-8" />
                          )}
                        </div>
                      )}
                      <div
                        className={`relative rounded-2xl px-4 py-2 max-w-[80%] shadow-sm ${
                          isOwn
                            ? 'bg-indigo-600 text-white rounded-br-md'
                            : 'bg-white text-gray-900 rounded-bl-md border border-indigo-100'
                        }`}
                      >
                        {showName && (
                          <p className="text-xs font-semibold mb-1" style={{ color: isOwn ? 'rgba(255,255,255,0.9)' : '#6366f1' }}>
                            {message.sender.displayName}
                          </p>
                        )}
                        {isShortMessage ? (
                          <div className="flex items-end gap-2">
                            <span className="text-sm wrap-break-word">{message.content}</span>
                            <span 
                              className={`text-[10px] shrink-0 self-end ${
                                isOwn ? 'text-white/70' : 'text-gray-500'
                              }`}
                              style={{ lineHeight: '1.4' }}
                            >
                              {formatTime(message.createdAt)}
                            </span>
                            {isOwn && (
                              <Check className="w-3 h-3 shrink-0 self-end text-white/70" style={{ marginBottom: '1px' }} />
                            )}
                          </div>
                        ) : (
                          <div>
                            <div className="text-sm wrap-break-word pb-5 pr-16">
                              {message.content}
                            </div>
                            <div 
                              className={`absolute bottom-2 right-4 flex items-center gap-1 ${
                                isOwn ? 'text-white/70' : 'text-gray-500'
                              }`}
                            >
                              <span className="text-[10px]">
                                {formatTime(message.createdAt)}
                              </span>
                              {isOwn && (
                                <Check className="w-3 h-3" />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {typingUsers.size > 0 && (
                <div className="flex gap-2 items-center mt-2">
                  <div className="w-8" />
                  <div className="bg-white rounded-2xl rounded-bl-md px-3 py-2 shadow-sm border border-indigo-100">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Minimal Input Area */}
      <div className="border-t border-indigo-100 bg-white/80 px-4 py-2">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            onKeyPress={handleKeyPress}
            disabled={!isConnected || sending}
            className="flex-1 bg-white/0 border-none focus:ring-0 text-base"
          />
          <Button
            onClick={handleSend}
            disabled={!isConnected || !newMessage.trim() || sending}
            size="icon"
            className="bg-indigo-600 hover:bg-indigo-700 shadow-md"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowInviteModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Invite Member</h3>
              <Button
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteEmail('');
                }}
                variant="ghost"
                size="icon"
                className="text-gray-500"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && inviteEmail) {
                      handleInvite();
                    }
                  }}
                  disabled={inviteLoading}
                  className="w-full"
                  autoFocus
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteEmail('');
                  }}
                  variant="outline"
                  disabled={inviteLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleInvite}
                  disabled={!inviteEmail || inviteLoading}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {inviteLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Invite'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}