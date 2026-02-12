export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  question: string;
  session_id: string;
}

export interface ChatResponse {
  success: boolean;
  data: string;
  message: string;
}
