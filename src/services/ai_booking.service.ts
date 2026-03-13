import apiClient from "@/lib/api-client"
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
  movieId: string | null
  showTimeId: string | null
  showTimeSeatIds: string[]
  comboIds: string[]
  menuItems: Array<{ id: string; quantity: number }>
  eventId: string | null
  paymentMethod: string
}

export const aiBookingService = {
  async chatWithAgent(message: string, userId?: string): Promise<AiChatResponse[]> {
    const { data } = await apiClient.post("/ai-booking/chat", { message, user_id: userId }, { timeout: 60000 })
    return data.data
  },

  async clearAiBookingState(userId: string): Promise<boolean> {
    const { data } = await apiClient.delete(`/ai-booking/state/${userId}`)
    return data.success
  },

  async getAiBookingState(userId: string): Promise<AiBookingStatePayload | null> {
    try {
      const { data } = await apiClient.get(`/ai-booking/state/${userId}`)
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
      const { data } = await apiClient.get(`/ai-booking/state/${userId}/details`)
      if (!data?.success) {
        return null
      }
      return data.data as AiBookingStateDetails
    } catch (error) {
      console.error('Failed to load AI booking state details:', error)
      return null
    }
  },
}
