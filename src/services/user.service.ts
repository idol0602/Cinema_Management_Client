import api, { handleApiError } from "./api"
import type {serviceResponse} from "../types/api.type"
import type {PaginationQuery, PaginatedResponse} from "@/types/pagination.type"
import type {CreateUserType, UpdateUserType, User} from "@/types/user.type"

export const userService = {
  getAll: async () : Promise<serviceResponse> => {
    try {
      const response = await api.get('/users/all')
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
      const response = await api.get(`/users/${id}`);
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

  create: async (data: CreateUserType) : Promise<serviceResponse> => {
    try {
      const response = await api.post('/users', data);
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

  update: async (id: string, data: UpdateUserType) : Promise<serviceResponse>  => {
    try {
      const response = await api.put(`/users/${id}`, data);
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
      await api.delete(`/users/${id}`);
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

  findAndPaginate: async(query: PaginationQuery): Promise<PaginatedResponse<User>> => {
    try {
      const response = await api.get("/users", { params: query });
      return {
        data: response.data.data,
        success: true,
        error: response.data.error || "",
        meta: response.data.meta,
        links: response.data.links
      };
    } catch (error) {
      const apiError = handleApiError(error);
      return {
        data: [],
        success: false,
        error: apiError.message
      };
    }
  },

  sendOnline: async(userId: string) => {
    try {
      await api.put(`/users/online/${userId}`);
      return { success: true };
    } catch (error) {
      const apiError = handleApiError(error);
      return { success: false, error: apiError.message };
    }
  },

  sendOffline: async(userId: string) => {
    try {
      await api.put(`/users/offline/${userId}`);
      return { success: true };
    } catch (error) {
      const apiError = handleApiError(error);
      return { success: false, error: apiError.message };
    }
  },

  sendHeartbeat: async(userId: string) => {
    try {
      await api.post(`/users/heartbeat/${userId}`);
      return { success: true };
    } catch (error) {
      const apiError = handleApiError(error);
      return { success: false, error: apiError.message };
    }
  }
}