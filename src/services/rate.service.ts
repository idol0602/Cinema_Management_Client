import api, { handleApiError } from "./api"
import type {serviceResponse} from "../types/api.type"
import type {CreateRateType, UpdateRateType, RateType} from "@/types/rate.type"
import type {PaginatedResponse} from "../types/pagination.type"

export const rateService = {
  getAll: async () : Promise<serviceResponse> => {
    try {
      const response = await api.get('/rates')
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
      const response = await api.get(`/rates/${id}`);
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

  create: async (data: CreateRateType) : Promise<serviceResponse> => {
    try {
      const response = await api.post('/rates', data);
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

  update: async (id: string, data: UpdateRateType) : Promise<serviceResponse>  => {
    try {
      const response = await api.put(`/rates/${id}`, data);
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
      await api.delete(`/rates/${id}`);
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

  findAndPaginate: async (params: any) : Promise<PaginatedResponse<RateType>> => {
    try {
      const response = await api.get('/rates', { params });
      return {
        data: response.data.data,
        success: true,
        error: response.data.error,
        meta: response.data.meta,
        links: response.data.links
      };
    } catch (error) {
      const apiError = handleApiError(error);
      return {
        data: [],
        success: false,
        error: apiError.message,
      };
    }
  }
}