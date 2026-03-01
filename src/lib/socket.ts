import { io, Socket } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const SOCKET_URL = API_BASE_URL.replace('/api', '');

// ==================== TYPES ====================

export enum ConversationStatus {
  WAITING = 'WAITING',
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
}

export interface Conversation {
  id: string;
  customer_id: string;
  staff_id: string | null;
  status: ConversationStatus;
  created_at: string;
  updated_at: string;
  customer?: { id: string; name: string; email: string; phone?: string };
  staff?: { id: string; name: string; email: string; phone?: string };
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  type: 'TEXT' | 'IMAGE' | 'RECALLED';
  image_url: string | null;
  is_seen: boolean;
  seen_at: string | null;
  created_at: string;
  sender?: { id: string; name: string; email: string };
}

// ==================== SOCKET SERVICE ====================

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (typeof window === 'undefined') return;

    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      this.socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // ==================== CONVERSATION ====================

  // Tạo cuộc hội thoại mới (hoặc lấy lại nếu đã tồn tại WAITING/ACTIVE)
  createConversation(): Promise<{ data?: Conversation; error?: string }> {
    return new Promise((resolve) => {
      if (!this.socket) return resolve({ error: 'Socket not connected' });
      this.socket.emit('conversation:create', (res: { data?: Conversation; error?: string }) => {
        resolve(res);
      });
    });
  }

  // Tạo conversation + gửi tin nhắn đầu tiên
  createConversationWithMessage(
    content: string
  ): Promise<{ data?: { conversation: Conversation; message: Message }; error?: string }> {
    return new Promise((resolve) => {
      if (!this.socket) return resolve({ error: 'Socket not connected' });

      this.socket.emit('conversation:create', (resConv: { data?: Conversation; error?: string }) => {
        if (resConv?.error) return resolve({ error: resConv.error });
        const conversation = resConv?.data;
        if (!conversation) return resolve({ error: 'Failed to create conversation' });

        this.socket!.emit(
          'message:send',
          { conversationId: conversation.id, content },
          (resMsg: { data?: Message; error?: string }) => {
            if (resMsg?.error) return resolve({ error: resMsg.error });
            const message = resMsg?.data;
            resolve({ data: { conversation, message: message! } });
          }
        );
      });
    });
  }

  // Lấy cuộc hội thoại WAITING/ACTIVE hiện tại của customer
  getCurrentConversation(): Promise<{ data?: Conversation | null; error?: string }> {
    return new Promise((resolve) => {
      if (!this.socket) return resolve({ error: 'Socket not connected' });
      this.socket.emit(
        'conversation:current',
        (res: { data?: Conversation | null; error?: string }) => {
          resolve(res);
        }
      );
    });
  }

  // Join conversation room
  joinConversation(conversationId: string) {
    if (!this.socket) return;
    this.socket.emit('conversation:join', { conversationId });
  }

  // Đóng cuộc hội thoại (soft delete)
  closeConversation(conversationId: string): Promise<{ success?: boolean; error?: string }> {
    return new Promise((resolve) => {
      if (!this.socket) return resolve({ error: 'Socket not connected' });
      this.socket.emit('conversation:close', { conversationId }, (res: { success?: boolean; error?: string }) => {
        resolve(res);
      });
    });
  }

  // ==================== MESSAGE ====================

  // Gửi tin nhắn text
  sendMessage(conversationId: string, content: string): Promise<{ data?: Message; error?: string }> {
    return new Promise((resolve) => {
      if (!this.socket) return resolve({ error: 'Socket not connected' });
      this.socket.emit('message:send', { conversationId, content }, (response: { data?: Message; error?: string }) => {
        resolve(response);
      });
    });
  }

  // Gửi tin nhắn ảnh (base64)
  sendImageMessage(
    conversationId: string,
    base64: string,
    content?: string
  ): Promise<{ data?: Message; error?: string }> {
    return new Promise((resolve) => {
      if (!this.socket) return resolve({ error: 'Socket not connected' });
      this.socket.emit(
        'message:image',
        { conversationId, base64Image: base64, content: content || '' },
        (response: { data?: Message; error?: string }) => {
          resolve(response);
        }
      );
    });
  }

  // Load lịch sử tin nhắn
  getMessages(conversationId: string, limit = 50, offset = 0): Promise<{ data?: Message[]; error?: string }> {
    return new Promise((resolve) => {
      if (!this.socket) return resolve({ error: 'Socket not connected' });
      this.socket.emit(
        'message:list',
        { conversationId, limit, offset },
        (res: { data?: Message[]; error?: string }) => {
          resolve(res);
        }
      );
    });
  }

  // Đánh dấu đã đọc
  markAsRead(conversationId: string): Promise<{ success?: boolean; error?: string }> {
    return new Promise((resolve) => {
      if (!this.socket) return resolve({ error: 'Socket not connected' });
      this.socket.emit('message:read', { conversationId }, (res: { success?: boolean; error?: string }) => {
        resolve(res);
      });
    });
  }

  // ==================== EVENT LISTENERS ====================

  onConversationAssigned(callback: (conv: Conversation) => void) {
    if (!this.socket) return () => {};
    this.socket.on('conversation:assigned', callback);
    return () => {
      this.socket?.off('conversation:assigned', callback);
    };
  }

  onConversationClosed(callback: (data: { conversationId: string }) => void) {
    if (!this.socket) return () => {};
    this.socket.on('conversation:closed', callback);
    return () => {
      this.socket?.off('conversation:closed', callback);
    };
  }

  onNewMessage(callback: (msg: Message) => void) {
    if (!this.socket) return () => {};
    this.socket.on('message:new', callback);
    return () => {
      this.socket?.off('message:new', callback);
    };
  }

  onMessageReadUpdate(callback: (data: { userId: string; conversationId: string }) => void) {
    if (!this.socket) return () => {};
    this.socket.on('message:read:update', callback);
    return () => {
      this.socket?.off('message:read:update', callback);
    };
  }

  // Thu hồi tin nhắn
  recallMessage(messageId: string): Promise<{ data?: Message; error?: string }> {
    return new Promise((resolve) => {
      if (!this.socket) return resolve({ error: 'Socket not connected' });
      this.socket.emit(
        'message:recall',
        { messageId },
        (res: { data?: Message; error?: string }) => {
          resolve(res);
        }
      );
    });
  }

  // Tin nhắn bị thu hồi
  onMessageRecalled(callback: (msg: Message) => void) {
    if (!this.socket) return () => {};
    this.socket.on('message:recalled', callback);
    return () => {
      this.socket?.off('message:recalled', callback);
    };
  }
}

export const socketService = new SocketService();
