// components/groups/GroupChat.tsx
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Send, Loader2, UserPlus, X, Check, WifiOff, Wifi } from 'lucide-react';
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
  const [hasJoinedGroup, setHasJoinedGroup] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingEmittedRef = useRef(false);
  const messageSetRef = useRef<Set<string>>(new Set());
  const lastMessageIdRef = useRef<string | null>(null);
  const shouldAutoScrollRef = useRef(true);
  const pendingMessageRef = useRef<string | null>(null);

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

  // Check if user is near bottom of chat
  const isNearBottom = useCallback(() => {
    if (!messagesContainerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const threshold = 150; // pixels from bottom
    return scrollHeight - scrollTop - clientHeight < threshold;
  }, []);

  // Smart scroll - only scroll if user is near bottom or it's their own message
  const scrollToBottom = useCallback((force = false) => {
    if (force || shouldAutoScrollRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Track scroll position to determine auto-scroll behavior
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      shouldAutoScrollRef.current = isNearBottom();
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isNearBottom]);

  // Fetch messages on mount
  useEffect(() => {
    fetchMessages();
  }, [groupId]);

  // Only auto-scroll on initial load
  useEffect(() => {
    if (!loading && messages.length > 0 && lastMessageIdRef.current === null) {
      // Initial load - always scroll to bottom
      setTimeout(() => scrollToBottom(true), 100);
      lastMessageIdRef.current = messages[messages.length - 1]?._id || null;
    }
  }, [loading, messages, scrollToBottom]);

  // Join group handler with callback support
  const joinGroup = useCallback(() => {
    if (!socket || !groupId || !currentUserId) return;

    setHasJoinedGroup(true);

    socket.emit('join_group', { groupId }, (response: any) => {
      if (response?.success) {
        console.log('✅ Joined group successfully');
      } else {
        console.error('Failed to join group:', response?.error);
        setHasJoinedGroup(false);
        showError(response?.error || 'Failed to join group');
      }
    });
  }, [socket, groupId, currentUserId]);

  // Socket connection and event handlers
  useEffect(() => {
    if (!socket || !groupId || !currentUserId) return;

    joinGroup();

    const handleReconnect = () => {
      console.log('🔄 Socket reconnected, rejoining group...');
      joinGroup();
      fetchMessages();
    };

    socket.on('connect', handleReconnect);

    // Handle new messages with smart scrolling
    const handleNewMessage = (message: Message) => {
      console.log('📨 Received new message:', message._id);
      
      if (messageSetRef.current.has(message._id)) {
        console.log('⚠️ Duplicate message ignored:', message._id);
        return;
      }
      messageSetRef.current.add(message._id);
      
      // Clear pending message ref if this is the message we sent
      if (pendingMessageRef.current === message._id) {
        console.log('✅ Pending message confirmed:', message._id);
        pendingMessageRef.current = null;
      }
      
      setMessages((prev) => {
        if (prev.some(m => m._id === message._id)) {
          console.log('⚠️ Message already in state:', message._id);
          return prev;
        }
        
        // Only auto-scroll if it's the current user's message OR user is near bottom
        const isOwnMessage = message.sender._id === currentUserId;
        if (isOwnMessage || shouldAutoScrollRef.current) {
          setTimeout(() => scrollToBottom(isOwnMessage), 50);
        }
        
        lastMessageIdRef.current = message._id;
        return [...prev, message];
      });
    };
    socket.on('new_message', handleNewMessage);

    const handleUserTyping = ({ userId, displayName }: any) => {
      if (userId !== currentUserId) {
        setTypingUsers((prev) => new Set(prev).add(displayName));
        // Auto-scroll if near bottom when someone starts typing
        if (shouldAutoScrollRef.current) {
          setTimeout(() => scrollToBottom(false), 100);
        }
      }
    };
    socket.on('user_typing', handleUserTyping);

    const handleTypingStopped = ({ userId, displayName }: any) => {
      if (userId !== currentUserId) {
        setTypingUsers((prev) => {
          const updated = new Set(prev);
          updated.delete(displayName);
          return updated;
        });
      }
    };
    socket.on('typing_stopped', handleTypingStopped);

    const handleError = (error: any) => {
      console.error('Socket error:', error);
      showError(error.message || 'Connection error occurred');
    };
    socket.on('error', handleError);

    const handleServerShutdown = () => {
      showError('Server is restarting. Please wait...');
    };
    socket.on('server_shutdown', handleServerShutdown);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      
      if (isTypingEmittedRef.current) {
        socket.emit('typing_stop', { groupId });
        isTypingEmittedRef.current = false;
      }
      
      socket.emit('leave_group', { groupId });
      socket.off('connect', handleReconnect);
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('typing_stopped', handleTypingStopped);
      socket.off('error', handleError);
      socket.off('server_shutdown', handleServerShutdown);
    };
  }, [socket, groupId, currentUserId, joinGroup, scrollToBottom]);

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
        messageSetRef.current = new Set(data.messages.map((m: Message) => m._id));
        lastMessageIdRef.current = null; // Reset for initial scroll
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

  const handleTyping = () => {
    if (!socket || !isConnected) return;

    if (!isTypingEmittedRef.current) {
      socket.emit('typing_start', { groupId });
      isTypingEmittedRef.current = true;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingEmittedRef.current && socket) {
        socket.emit('typing_stop', { groupId });
        isTypingEmittedRef.current = false;
      }
      typingTimeoutRef.current = null;
    }, 2000);
  };

  const stopTyping = () => {
    if (!socket) return;
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    
    if (isTypingEmittedRef.current) {
      socket.emit('typing_stop', { groupId });
      isTypingEmittedRef.current = false;
    }
  };

  const handleSend = async () => {
    if (!socket || !newMessage.trim() || !isConnected) return;

    setSending(true);
    const messageContent = newMessage.trim();
    setNewMessage('');
    stopTyping();

    console.log('📤 Sending message:', messageContent);

    // Increase timeout to 20 seconds
    let sendTimeout = setTimeout(() => {
      console.error('⏱️ Message send timeout');
      setSending(false);
      showError('Message send failed. Retrying...');
      setNewMessage(messageContent); // Restore message
      pendingMessageRef.current = null;
    }, 20000);

    // Ensure callback is the last argument, not inside the data object
    socket.emit(
      'send_message',
      {
        groupId,
        content: messageContent,
        type: 'text',
      },
      function(response: { success: boolean; error?: string; message?: Message }) {
        clearTimeout(sendTimeout);
        console.log('📬 Send callback received:', response);
        if (!response) {
          console.error('❌ No response from server');
          setSending(false);
          setNewMessage(messageContent);
          showError('No response from server. Please try again.');
          return;
        }
        if (!response.success) {
          console.error('❌ Send failed:', response.error);
          setSending(false);
          setNewMessage(messageContent);
          showError(response.error || 'Failed to send message');
          pendingMessageRef.current = null;
        } else {
          console.log('✅ Message sent successfully:', response.message?._id);
          if (response.message?._id) {
            pendingMessageRef.current = response.message._id;
            if (!messageSetRef.current.has(response.message._id)) {
              messageSetRef.current.add(response.message._id);
              setMessages(prev => {
                if (prev.some(m => m._id === response.message!._id)) {
                  return prev;
                }
                return [...prev, response.message!];
              });
            }
          }
          setSending(false);
          setTimeout(() => scrollToBottom(true), 100);
        }
      }
    );
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
      {/* Header with connection status */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-indigo-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-base text-indigo-700">Group Chat</h2>
          {isConnected ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-500 animate-pulse"  />
          )}
        </div>
        <Button
          onClick={() => setShowInviteModal(true)}
          variant="ghost"
          size="icon"
          className="text-indigo-500 hover:text-indigo-700"
        >
          <UserPlus className="w-5 h-5" />
        </Button>
      </div>

      {/* Connection status banner */}
      {!isConnected && (
        <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2 text-center">
          <p className="text-sm text-yellow-800 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Reconnecting to chat...
          </p>
        </div>
      )}

      {/* Messages Area - with ref for scroll detection */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-0 py-4 flex flex-col items-center"
      >
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
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-xs text-gray-600 ml-1">
                        {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {/* Extra padding to prevent input from blocking messages */}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-indigo-100 bg-white/80 backdrop-blur-sm px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            placeholder={isConnected ? "Type a message..." : "Connecting..."}
            value={newMessage}
            onChange={e => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            onKeyDown={handleKeyPress}
            disabled={!isConnected || sending || !hasJoinedGroup}
            rows={1}
            style={{
              resize: 'none',
              minHeight: '40px',
              maxHeight: '120px',
              overflowY: 'auto',
              width: '100%',
              fontSize: '1rem',
              background: 'white',
              border: '1px solid #e0e7ff',
              borderRadius: '0.75rem',
              padding: '0.75rem',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              transition: 'border 0.2s',
            }}
            className="flex-1 focus:ring-2 focus:ring-indigo-500"
            autoFocus={false}
            onInput={e => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = '40px';
              target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
            }}
          />
          <Button
            onClick={handleSend}
            disabled={!isConnected || !newMessage.trim() || sending || !hasJoinedGroup}
            size="icon"
            className="bg-indigo-600 hover:bg-indigo-700 shadow-md disabled:opacity-50"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        {!isConnected && (
          <p className="text-xs text-gray-500 mt-1 text-center">
            Waiting for connection...
          </p>
        )}
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