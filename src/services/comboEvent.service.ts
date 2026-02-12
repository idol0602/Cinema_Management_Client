import api, { handleApiError } from "./api"
import type {serviceResponse} from "../types/api.type"
import type {CreateComboEventType, UpdateComboEventType} from "@/types/comboEvent.type"

export const comboEventService = {
  getAll: async () : Promise<serviceResponse> => {
    try {
      const response = await api.get('/combos-events')
      return {
        data: response.data.data,
        success : true,
        error: response.data.error
      }
    } catch (error) {
      const apiError = handleApiError(error);
      return {
        data:[],
        success: false,
        error: apiError.message
      }
    }
  },

  getById: async (id: string) : Promise<serviceResponse> => {
    try {
      const response = await api.get(`/combos-events/${id}`);
      return {
        data: response.data.data,
        success : true,
        error: response.data.error,
      };
    } catch (error) {
      const apiError = handleApiError(error);
      return {
        data: {},
        success : false,
        error: apiError.message
      }
    }
  },

  create: async (data: CreateComboEventType) : Promise<serviceResponse> => {
    try {
      const response = await api.post('/combos-events', data);
      return {
        data: response.data.data,
        success: true,
        error: response.data.error,
      };
    } catch (error) {
      const apiError = handleApiError(error);
      return {
        data: {},
        success: false,
        error: apiError.message,
      };
    }
  },

  update: async (id: string, data: UpdateComboEventType) : Promise<serviceResponse>  => {
    try {
      const response = await api.put(`/combos-events/${id}`, data);
      return {
        data: response.data.data,
        success: true,
        error: response.data.error,
      };
    } catch (error) {
      const apiError = handleApiError(error);
      return {
        data: {},
        success: false,
        error: apiError.message,
      };
    }
  },

  delete: async (id: string) : Promise<serviceResponse> => {
    try {
      await api.delete(`/combos-events/${id}`);
      return {
        data: {},
        success: true,
        error: ""
      };
    } catch (error) {
      const apiError = handleApiError(error);
      return {
        data: {},
        success: false,
        error: apiError.message,
      };
    }
  },
}
