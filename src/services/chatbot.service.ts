import api from './api';

export interface ChatBotPayload {
  sessionId: string;
  message: string;
}

export interface ChatBotResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const chatWithBot = async (payload: ChatBotPayload): Promise<ChatBotResponse> => {
  const response = await api.post('/chatbot/chat', payload);
  console.log(response.data);
  return response.data;
};
