import api from './api';

export interface ChatBotPayload {
  user_id: string;
  message: string;
}

export interface ChatBotResponse {
  success: boolean;
  message: string;
  data?: string;
}

function extractBotMessage(payload: unknown): string {
  if (typeof payload === 'string') {
    return payload;
  }

  if (Array.isArray(payload)) {
    return payload
      .map((item) => {
        if (typeof item === 'string') return item;
        if (
          item &&
          typeof item === 'object' &&
          'message' in item &&
          typeof (item as { message?: unknown }).message === 'string'
        ) {
          return (item as { message: string }).message;
        }
        return '';
      })
      .filter(Boolean)
      .join('\n\n');
  }

  if (payload && typeof payload === 'object') {
    const data = payload as { message?: unknown; output?: unknown };
    if (typeof data.message === 'string') return data.message;
    if (Array.isArray(data.output)) return extractBotMessage(data.output);
  }

  return '';
}

export const chatWithBot = async (payload: ChatBotPayload): Promise<ChatBotResponse> => {
  const response = await api.post('/chatbot/chat', payload);
  const normalizedData = extractBotMessage(response.data?.data);

  return {
    ...response.data,
    data: normalizedData,
  };
};
