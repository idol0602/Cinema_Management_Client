import api, { handleApiError } from "./api"
import type {serviceResponse} from "../types/api.type"
import type {CreateShowTimeSeatType, UpdateShowTimeSeatType} from "@/types/showTimeSeat.type"

export const showTimeSeatService = {
  getAll: async () : Promise<serviceResponse> => {
    try {
      const response = await api.get('/show-time-seats/all')
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
      const response = await api.get(`/show-time-seats/${id}`);
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

  getStatusSeat: async (id: string) : Promise<serviceResponse> => {
    try {
      const response = await api.get(`/show-time-seats/status/${id}`);
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

  create: async (data: CreateShowTimeSeatType) : Promise<serviceResponse> => {
    try {
      const response = await api.post('/show-time-seats', data);
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

  update: async (id: string, data: UpdateShowTimeSeatType) : Promise<serviceResponse>  => {
    try {
      const response = await api.put(`/show-time-seats/${id}`, data);
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
      await api.delete(`/show-time-seats/${id}`);
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

  findAndPaginate: async (query: any) : Promise<serviceResponse> => {
    try {
      const response = await api.get('/show-time-seats', { params: query });
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

  // === Seat Hold Operations ===

  holdSeat: async (id: string, ttlSeconds: number = 600) : Promise<serviceResponse> => {
    try {
      const response = await api.post(`/show-time-seats/hold/${id}`, { ttlSeconds });
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

  cancelHoldSeat: async (id: string) : Promise<serviceResponse> => {
    try {
      const response = await api.delete(`/show-time-seats/hold/${id}`);
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

  getHoldInfo: async (id: string) : Promise<serviceResponse> => {
    try {
      const response = await api.get(`/show-time-seats/hold/${id}`);
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

  bulkHoldSeats: async (showTimeSeatIds: string[], ttlSeconds: number = 600) : Promise<serviceResponse> => {
    try {
      const response = await api.post('/show-time-seats/hold/bulk', { showTimeSeatIds, ttlSeconds });
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

  bulkCancelHoldSeats: async (showTimeSeatIds: string[]) : Promise<serviceResponse> => {
    try {
      const response = await api.delete('/show-time-seats/hold/bulk', { data: { showTimeSeatIds } });
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

  getAllHeldSeatsByUserId : async () : Promise<serviceResponse> => {
    try {
      const response = await api.get('/show-time-seats/hold-by-user/all');
      return {
        data: response.data.data,
        success: true,
        error: response.data.error,
      };
    } catch (error) {
      const apiError = handleApiError(error);
      return {
        data: [],
        success: false,
        error: apiError.message,
      };
    }
  },
}