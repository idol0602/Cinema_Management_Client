'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { chatWithBot } from '@/services/chatbot.service';
import { useAuthStore } from '@/store/useAuthStore';
import {
  socketService,
  type Conversation,
  type Message as SocketMessage,
  ConversationStatus,
} from '@/lib/socket';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types/chat.type';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
  MessageSquareText,
  Ticket,
  Headset,
  ImagePlus,
  CheckCheck,
  Maximize2,
  Minimize2,
  Trash2,
  Undo2,
  Ban,
  Download,
} from 'lucide-react';

type ChatMode = 'qa' | 'booking' | 'staff';

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ChatPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mode, setMode] = useState<ChatMode>('qa');

  // QA state
  const [qaMessages, setQaMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());

  // Staff chat state
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [staffMessages, setStaffMessages] = useState<SocketMessage[]>([]);
  const [staffInput, setStaffInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const staffMessagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const staffInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const conversationRef = useRef<string | null>(null);

  const { user, isAuthenticated } = useAuthStore();

  // ---------- Scroll ----------
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    staffMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [qaMessages, staffMessages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (mode === 'staff') staffInputRef.current?.focus();
        else inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, mode]);

  // ---------- Track current conversation for closures ----------
  useEffect(() => {
    conversationRef.current = conversation?.id ?? null;
  }, [conversation]);

  // ---------- Track socket connection state reactively ----------
  useEffect(() => {
    if (!isAuthenticated) {
      setSocketConnected(false);
      return;
    }

    const cleanupFns: (() => void)[] = [];

    const setup = () => {
      const socket = socketService.getSocket();
      if (!socket) return false;

      if (socket.connected) {
        setSocketConnected(true);
      }

      const onConnect = () => setSocketConnected(true);
      const onDisconnect = () => setSocketConnected(false);

      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);

      cleanupFns.push(() => {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
      });

      return true;
    };

    // Try immediately, if socket not ready yet, poll until available
    if (!setup()) {
      const interval = setInterval(() => {
        if (setup()) {
          clearInterval(interval);
        }
      }, 100);
      cleanupFns.push(() => clearInterval(interval));
    }

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, [isAuthenticated]);

  // ---------- Load existing conversation on mount / when switching to staff mode ----------
  useEffect(() => {
    if (!isAuthenticated || !socketConnected) return;
    if (mode !== 'staff') return;

    const loadExisting = async () => {
      setIsLoadingHistory(true);
      try {
        const res = await socketService.getCurrentConversation();
        if (res.data) {
          setConversation(res.data);
          socketService.joinConversation(res.data.id);

          if (res.data.status === ConversationStatus.WAITING) {
            setIsConnecting(true);
          }

          // Load message history
          const msgRes = await socketService.getMessages(res.data.id, 100, 0);
          if (msgRes.data) {
            setStaffMessages([...msgRes.data].reverse());
          }
        }
      } catch (err) {
        console.error('Failed to load existing conversation:', err);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadExisting();
  }, [isAuthenticated, socketConnected, mode]);

  // ---------- Socket listeners for staff chat ----------
  useEffect(() => {
    if (!isAuthenticated || !socketConnected) return;

    const offAssigned = socketService.onConversationAssigned((conv) => {
      setConversation((prev) => {
        if (prev?.id === conv.id) {
          setIsConnecting(false);
          return conv;
        }
        return prev;
      });
    });

    const offClosed = socketService.onConversationClosed(({ conversationId }) => {
      setConversation((prev) => {
        if (prev?.id === conversationId) {
          setStaffMessages([]);
          return null;
        }
        return prev;
      });
    });

    const offMessage = socketService.onNewMessage((msg) => {
      // Chỉ thêm nếu message thuộc conversation hiện tại
      if (msg.conversation_id === conversationRef.current) {
        setStaffMessages((prev) => {
          if (prev.find((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
    });

    const offRead = socketService.onMessageReadUpdate(({ userId: readUserId }) => {
      if (readUserId !== user?.id) {
        setStaffMessages((prev) =>
          prev.map((m) => (m.sender_id === user?.id ? { ...m, is_seen: true } : m))
        );
      }
    });

    const offRecalled = socketService.onMessageRecalled((msg) => {
      setStaffMessages((prev) => prev.map((m) => (m.id === msg.id ? msg : m)));
    });

    return () => {
      offAssigned();
      offClosed();
      offMessage();
      offRead();
      offRecalled();
    };
  }, [isAuthenticated, socketConnected, user?.id]);

  // ---------- QA: send ----------
  const handleSendQA = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setQaMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithBot({
        sessionId,
        message: trimmed,
      });

      const botMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.data || response.message || 'Xin lỗi, tôi không hiểu câu hỏi của bạn.',
        timestamp: new Date(),
      };
      setQaMessages((prev) => [...prev, botMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
        timestamp: new Date(),
      };
      setQaMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- Staff: start conversation with first message ----------
  const handleSendStaffFirstMessage = useCallback(async (content: string) => {
    if (!socketService.isConnected()) return;
    setIsConnecting(true);
    setIsSending(true);

    try {
      const res = await socketService.createConversationWithMessage(content);
      if (res.data) {
        setConversation(res.data.conversation);
        socketService.joinConversation(res.data.conversation.id);

        // Thêm tin nhắn đầu tiên vào danh sách
        if (res.data.message) {
          setStaffMessages([res.data.message]);
        }

        // Nếu conversation đã ACTIVE (tìm lại conversation cũ), tắt isConnecting
        if (res.data.conversation.status === ConversationStatus.ACTIVE) {
          setIsConnecting(false);
        }
      }
    } catch (err) {
      console.error('Failed to create conversation with message:', err);
      setIsConnecting(false);
    } finally {
      setIsSending(false);
    }
  }, []);

  // ---------- Staff: send message ----------
  const handleSendStaff = useCallback(async () => {
    if (!staffInput.trim() || isSending) return;

    const content = staffInput.trim();
    setStaffInput('');

    // Nếu chưa có conversation → tạo mới + gửi tin nhắn đầu
    if (!conversation) {
      await handleSendStaffFirstMessage(content);
      return;
    }

    setIsSending(true);

    try {
      const res = await socketService.sendMessage(conversation.id, content);
      if (res.error) {
        console.error('Send failed:', res.error);
        setStaffInput(content);
      }
    } catch (err) {
      console.error('Send failed:', err);
      setStaffInput(content);
    } finally {
      setIsSending(false);
    }
  }, [staffInput, conversation, isSending, handleSendStaffFirstMessage]);

  // ---------- Staff: send image ----------
  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Nếu chưa có conversation → tạo trước rồi gửi ảnh
      if (!conversation) {
        const reader = new FileReader();
        reader.onload = async () => {
          const base64 = reader.result as string;
          setIsSending(true);
          setIsConnecting(true);
          try {
            // Tạo conversation trước
            const convRes = await socketService.createConversation();
            if (convRes.data) {
              setConversation(convRes.data);
              socketService.joinConversation(convRes.data.id);

              // Gửi ảnh
              const imgRes = await socketService.sendImageMessage(convRes.data.id, base64);
              if (imgRes.data) {
                setStaffMessages([imgRes.data]);
              }

              if (convRes.data.status === ConversationStatus.ACTIVE) {
                setIsConnecting(false);
              }
            }
          } catch (err) {
            console.error('Image send failed:', err);
            setIsConnecting(false);
          } finally {
            setIsSending(false);
          }
        };
        reader.readAsDataURL(file);
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        setIsSending(true);
        try {
          await socketService.sendImageMessage(conversation.id, base64);
        } catch (err) {
          console.error('Image send failed:', err);
        } finally {
          setIsSending(false);
        }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    },
    [conversation]
  );

  // ---------- Staff: close (delete) conversation ----------
  const handleCloseStaffChat = useCallback(async () => {
    if (!conversation) return;
    try {
      await socketService.closeConversation(conversation.id);
    } catch {
      // ignore
    }
    setConversation(null);
    setStaffMessages([]);
    setIsConnecting(false);
  }, [conversation]);

  // ---------- Staff: recall message ----------
  const handleRecall = useCallback(async (messageId: string) => {
    try {
      const res = await socketService.recallMessage(messageId);
      if (res.error) {
        console.error('Recall failed:', res.error);
      }
    } catch (err) {
      console.error('Recall failed:', err);
    }
  }, []);

  // ---------- Key handling ----------
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (mode === 'staff') handleSendStaff();
      else handleSendQA();
    }
  };

  // ---------- Panel size ----------
  const panelClasses = isFullscreen
    ? 'fixed inset-0 z-50 m-0 rounded-none'
    : 'fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)]';

  const chatHeight = isFullscreen ? 'h-screen' : 'h-[560px]';

  return (
    <>
      {/* Floating Toggle Button */}
      {!isFullscreen && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-110',
            isOpen
              ? 'rotate-0 bg-gray-700 hover:bg-gray-600'
              : 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-orange-500/40 hover:from-orange-600 hover:to-orange-700'
          )}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <MessageCircle className="h-6 w-6 text-white" />
          )}
        </button>
      )}

      {/* Chat Panel */}
      <div
        className={cn(
          'origin-bottom-right transition-all duration-300',
          panelClasses,
          isOpen || isFullscreen
            ? 'translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none translate-y-4 scale-95 opacity-0'
        )}
      >
        <div
          className={cn(
            'flex flex-col overflow-hidden border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900',
            chatHeight,
            isFullscreen ? '' : 'rounded-2xl'
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              {mode === 'staff' ? (
                <Headset className="h-5 w-5 text-white" />
              ) : (
                <Bot className="h-5 w-5 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white">
                {mode === 'staff' ? 'Chat với nhân viên' : 'Meta Cinema AI'}
              </h3>
              <p className="text-xs text-orange-100">
                {mode === 'staff'
                  ? conversation?.staff
                    ? `${conversation.staff.name} đang hỗ trợ`
                    : 'Đang chờ kết nối...'
                  : 'Luôn sẵn sàng hỗ trợ bạn'}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {mode === 'staff' && conversation && (
                <Badge variant="outline" className="border-white/30 text-[10px] text-white">
                  {conversation.status === ConversationStatus.ACTIVE ? 'Đang hỗ trợ' : 'Đang chờ'}
                </Badge>
              )}
              {!isFullscreen && (
                <Badge variant="outline" className="border-white/30 text-[10px] text-white">
                  Online
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white hover:bg-white/20"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? 'Thu nhỏ' : 'Phóng to'}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
              {isFullscreen && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white hover:bg-white/20"
                  onClick={() => {
                    setIsFullscreen(false);
                    setIsOpen(false);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setMode('qa')}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors',
                mode === 'qa'
                  ? 'border-b-2 border-orange-500 bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              )}
            >
              <MessageSquareText className="h-4 w-4" />
              Hỏi đáp
            </button>
            <button
              onClick={() => setMode('staff')}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors',
                mode === 'staff'
                  ? 'border-b-2 border-orange-500 bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              )}
            >
              <Headset className="h-4 w-4" />
              Nhân viên
            </button>
            <button
              onClick={() => setMode('booking')}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors',
                mode === 'booking'
                  ? 'border-b-2 border-orange-500 bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              )}
            >
              <Ticket className="h-4 w-4" />
              Đặt vé
            </button>
          </div>

          {/* ============ QA MODE ============ */}
          {mode === 'qa' && (
            <>
              <ScrollArea className="flex-1 p-4">
                {qaMessages.length === 0 ? (
                  <div className="space-y-3 py-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                      <Bot className="h-8 w-8 text-orange-500" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Xin chào! Tôi là trợ lý AI của Meta Cinema.
                      <br />
                      Hãy hỏi tôi bất cứ điều gì!
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['Phim nào hay?', 'Giá vé bao nhiêu?', 'Combo nào rẻ nhất?'].map((q) => (
                        <button
                          key={q}
                          onClick={() => {
                            setInput(q);
                            inputRef.current?.focus();
                          }}
                          className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-600 transition-colors hover:bg-orange-100 hover:text-orange-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-orange-950 dark:hover:text-orange-400"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {qaMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          'flex items-end gap-2',
                          msg.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {msg.role === 'assistant' && (
                          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                            <Bot className="h-4 w-4 text-orange-500" />
                          </div>
                        )}
                        <div
                          className={cn(
                            'max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                            msg.role === 'user'
                              ? 'rounded-br-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                              : 'rounded-bl-sm bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                          )}
                        >
                          {msg.content}
                        </div>
                        {msg.role === 'user' && (
                          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                            <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex items-end gap-2">
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                          <Bot className="h-4 w-4 text-orange-500" />
                        </div>
                        <div className="rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-3 dark:bg-gray-800">
                          <div className="flex gap-1">
                            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
                            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* QA Input */}
              <div className="border-t border-gray-200 p-3 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Nhập tin nhắn..."
                    disabled={isLoading}
                    className="flex-1 rounded-full border-gray-300 text-sm focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600"
                  />
                  <Button
                    onClick={handleSendQA}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="h-9 w-9 flex-shrink-0 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-orange-700"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* ============ STAFF CHAT MODE ============ */}
          {mode === 'staff' && (
            <>
              {!isAuthenticated ? (
                /* Not logged in */
                <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                    <Headset className="h-10 w-10 text-orange-500" />
                  </div>
                  <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                    Đăng nhập để chat
                  </h4>
                  <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    Bạn cần đăng nhập để trò chuyện với nhân viên hỗ trợ.
                  </p>
                </div>
              ) : isLoadingHistory ? (
                /* Loading existing conversation */
                <div className="flex flex-1 flex-col items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                  <p className="mt-2 text-sm text-gray-500">Đang tải...</p>
                </div>
              ) : !conversation ? (
                /* No active conversation – show input to send first message */
                <>
                  <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                      <Headset className="h-10 w-10 text-orange-500" />
                    </div>
                    <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                      Chat với nhân viên
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Gửi tin nhắn hoặc ảnh để bắt đầu cuộc trò chuyện với nhân viên hỗ trợ.
                    </p>
                  </div>

                  {/* Input for first message */}
                  <div className="border-t border-gray-200 p-3 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 shrink-0 text-gray-400 hover:text-orange-500"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isSending}
                      >
                        <ImagePlus className="h-5 w-5" />
                      </Button>
                      <Input
                        ref={staffInputRef}
                        value={staffInput}
                        onChange={(e) => setStaffInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Nhập tin nhắn để bắt đầu..."
                        disabled={isSending}
                        className="flex-1 rounded-full border-gray-300 text-sm focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600"
                      />
                      <Button
                        onClick={handleSendStaff}
                        disabled={!staffInput.trim() || isSending}
                        size="icon"
                        className="h-9 w-9 flex-shrink-0 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-orange-700"
                      >
                        {isSending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Connecting indicator */}
                  {/* {isConnecting && (
                    <div className="flex items-center gap-2 border-b border-orange-200 bg-orange-50 px-4 py-2 dark:border-orange-900 dark:bg-orange-950/30">
                      <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                      <span className="text-xs text-orange-600 dark:text-orange-400">
                        Đang chờ nhân viên kết nối...
                      </span>
                    </div>
                  )} */}

                  {/* Staff Messages */}
                  <ScrollArea className="flex-1 p-4">
                    {staffMessages.length === 0 ? (
                      <div className="flex h-full flex-col items-center justify-center py-8 text-center">
                        <Headset className="mb-2 h-10 w-10 text-orange-300" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {conversation.status === ConversationStatus.WAITING
                            ? 'Đang chờ nhân viên nhận hỗ trợ...'
                            : 'Hãy bắt đầu cuộc trò chuyện!'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {staffMessages.map((msg) => {
                          const isMe = msg.sender_id === user?.id;

                          return (
                            <div
                              key={msg.id}
                              className={cn(
                                'group flex items-end gap-2',
                                isMe ? 'justify-end' : 'justify-start'
                              )}
                            >
                              {!isMe && (
                                <Avatar className="h-7 w-7">
                                  <AvatarImage
                                    className="text-[10px]"
                                    name={msg.sender?.name || 'Staff'}
                                  />
                                </Avatar>
                              )}
                              {msg.type === 'RECALLED' ? (
                                <div
                                  className={cn(
                                    'flex max-w-[75%] items-center gap-1.5 rounded-2xl border border-dashed px-3.5 py-2 text-sm italic opacity-60',
                                    isMe
                                      ? 'rounded-br-sm border-orange-300 dark:border-orange-700'
                                      : 'rounded-bl-sm border-gray-400 dark:border-gray-600'
                                  )}
                                >
                                  <Ban className="h-3.5 w-3.5 shrink-0" />
                                  <span>Tin nhắn đã bị thu hồi</span>
                                </div>
                              ) : (
                                <>
                                  {isMe && (
                                    <button
                                      onClick={() => handleRecall(msg.id)}
                                      className="mb-1 hidden shrink-0 rounded-full p-1 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-500 group-hover:block dark:hover:bg-red-950"
                                      title="Thu hồi tin nhắn"
                                    >
                                      <Undo2 className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                  <div
                                    className={cn(
                                      'max-w-[75%] rounded-2xl px-3.5 py-2 text-sm',
                                      isMe
                                        ? 'rounded-br-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                                        : 'rounded-bl-sm bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                                    )}
                                  >
                                    {msg.image_url && (
                                      <img
                                        src={msg.image_url}
                                        alt="Ảnh"
                                        className="mb-1 max-h-48 cursor-pointer rounded-lg object-cover transition-opacity hover:opacity-80"
                                        onClick={() => setPreviewImage(msg.image_url)}
                                      />
                                    )}
                                    {msg.content && (
                                      <p className="whitespace-pre-wrap">{msg.content}</p>
                                    )}
                                    <div
                                      className={cn(
                                        'mt-1 flex items-center gap-1 text-[10px]',
                                        isMe ? 'justify-end opacity-70' : 'opacity-50'
                                      )}
                                    >
                                      <span>{formatTime(msg.created_at)}</span>
                                      {isMe && msg.is_seen && <CheckCheck className="h-3 w-3" />}
                                    </div>
                                  </div>
                                </>
                              )}
                              {isMe && (
                                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                                  <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div ref={staffMessagesEndRef} />
                  </ScrollArea>

                  {/* Staff Input */}
                  <div className="border-t border-gray-200 p-3 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 shrink-0 text-gray-400 hover:text-orange-500"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isSending}
                      >
                        <ImagePlus className="h-5 w-5" />
                      </Button>
                      <Input
                        ref={staffInputRef}
                        value={staffInput}
                        onChange={(e) => setStaffInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder={
                          conversation.status === ConversationStatus.WAITING
                            ? 'Đang chờ nhân viên nhận...'
                            : 'Nhập tin nhắn...'
                        }
                        disabled={isSending}
                        className="flex-1 rounded-full border-gray-300 text-sm focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600"
                      />
                      <Button
                        onClick={handleSendStaff}
                        disabled={!staffInput.trim() || isSending}
                        size="icon"
                        className="h-9 w-9 flex-shrink-0 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-orange-700"
                      >
                        {isSending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {/* Nút xóa cuộc trò chuyện */}
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={handleCloseStaffChat}
                        className="flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                        Xóa cuộc trò chuyện
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* ============ BOOKING MODE ============ */}
          {mode === 'booking' && (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                <Ticket className="h-10 w-10 text-orange-500" />
              </div>
              <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">Đặt vé qua AI</h4>
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                Tính năng đang được phát triển. Bạn có thể sử dụng chế độ Hỏi đáp để tìm hiểu thông
                tin phim và suất chiếu.
              </p>
              <Button
                variant="outline"
                onClick={() => setMode('qa')}
                className="border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-950"
              >
                <MessageSquareText className="mr-2 h-4 w-4" />
                Chuyển sang Hỏi đáp
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewImage}
              alt="Preview"
              className="max-h-[85vh] max-w-full rounded-lg object-contain"
            />
            <div className="absolute -right-3 -top-3 flex gap-1">
              <a
                href={previewImage}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                title="Tải xuống"
                onClick={(e) => e.stopPropagation()}
              >
                <Download className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </a>
              <button
                onClick={() => setPreviewImage(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                title="Đóng"
              >
                <X className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
