import api, { handleApiError } from "./api"
import type {serviceResponse} from "../types/api.type"
import type {PaginationQuery, PaginatedResponse} from "@/types/pagination.type"
import type {CreateEventType, UpdateEventType, EventType} from "@/types/event.type"

export const eventService = {
  getAll: async () : Promise<serviceResponse> => {
    try {
      const response = await api.get('/events/all')
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
      const response = await api.get(`/events/${id}`);
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

  create: async (data: CreateEventType) : Promise<serviceResponse> => {
    try {
      const response = await api.post('/events', data);
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

  update: async (id: string, data: UpdateEventType) : Promise<serviceResponse>  => {
    try {
      const response = await api.put(`/events/${id}`, data);
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
      await api.delete(`/events/${id}`);
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

  findAndPaginate: async(query: PaginationQuery): Promise<PaginatedResponse<EventType>> => {
    try {
      const response = await api.get("/events", { params: query });
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
}