import api from "./api"
import type { AiBookingStateDetails } from "@/types/aiBookingStateDetails.type"

export interface AiChatResponse {
  step: string
  action: string | null
  message: string
  data: any
  hasData: boolean
}

export interface AiBookingStatePayload {
  step?: string
  movieId?: string | null
  showTimeId?: string | null
  showTimeSeatIds?: string[]
  comboIds?: string[]
  menuItems?: Array<{ id?: string; menuItemId?: string; quantity: number }>
  eventId?: string | null
  paymentMethod?: string
}

export const aiBookingService = {
  async chatWithAgent(message: string, userId?: string): Promise<AiChatResponse[]> {
    const { data } = await api.post("/ai-booking/chat", { message, user_id: userId }, { timeout: 60000 })
    return data.data
  },

  async clearAiBookingState(userId: string): Promise<boolean> {
    const { data } = await api.delete(`/ai-booking/state/${userId}`)
    return data.success
  },

  async getAiBookingState(userId: string): Promise<AiBookingStatePayload | null> {
    try {
      const { data } = await api.get(`/ai-booking/state/${userId}`)
      if (!data?.success) {
        return null
      }
      return data.data as AiBookingStatePayload
    } catch (error) {
      console.error('Failed to load AI booking state:', error)
      return null
    }
  },

  async getAiBookingStateDetails(userId: string): Promise<AiBookingStateDetails | null> {
    try {
      const { data } = await api.get(`/ai-booking/state/${userId}/details`)
      if (!data?.success) {
        return null
      }
      return data.data as AiBookingStateDetails
    } catch (error) {
      console.error('Failed to load AI booking state details:', error)
      return null
    }
  },

  async saveAiBookingState(userId: string, state: AiBookingStatePayload): Promise<boolean> {
    try {
      const { data } = await api.post(`/ai-booking/state`, { id: userId, state })
      return !!data?.success
    } catch (error) {
      console.error('Failed to save AI booking state:', error)
      return false
    }
  },

  async createOrderWithAi(): Promise<any> {
    try {
      const { data } = await api.post(`/ai-booking/booking`)
      return {
        success: !!data?.success,
        data: data?.data,
        error: data?.message || data?.error || null,
      }
    } catch (error) {
      console.error('Failed to create order with AI:', error)
      const apiError = error as any
      return {
        success: false,
        data: null,
        error:
          apiError?.response?.data?.message ||
          apiError?.response?.data?.error ||
          apiError?.message ||
          'Không thể tạo đơn hàng AI',
      }
    }
  }
}
