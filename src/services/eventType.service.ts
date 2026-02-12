import api, { handleApiError } from "./api"
import type {serviceResponse} from "../types/api.type"
import type {PaginationQuery, PaginatedResponse} from "@/types/pagination.type"
import type {CreateEventTypeType, UpdateEventTypeType,EventTypeType } from "@/types/eventType.type"

export const eventTypeService = {
  getAll: async () : Promise<serviceResponse> => {
    try {
      const response = await api.get('/event-types/all')
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
      const response = await api.get(`/event-types/${id}`);
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

  create: async (data: CreateEventTypeType) : Promise<serviceResponse> => {
    try {
      const response = await api.post('/event-types', data);
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

  update: async (id: string, data: UpdateEventTypeType) : Promise<serviceResponse>  => {
    try {
      const response = await api.put(`/event-types/${id}`, data);
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
      await api.delete(`/event-types/${id}`);
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

  findAndPaginate: async(query: PaginationQuery): Promise<PaginatedResponse<EventTypeType>> => {
    try {
      const response = await api.get("/event-types", { params: query });
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
