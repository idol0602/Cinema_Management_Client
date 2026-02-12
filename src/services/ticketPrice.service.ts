import api, { handleApiError } from "./api"
import type {serviceResponse} from "../types/api.type"
import type {CreateTicketPriceType, UpdateTicketPriceType, TicketPriceType} from "@/types/ticketPrice.type"
import type {PaginationQuery, PaginatedResponse} from "@/types/pagination.type"

export const ticketPriceService = {
  getAll: async () : Promise<serviceResponse> => {
    try {
      const response = await api.get('/ticket-prices')
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
      const response = await api.get(`/ticket-prices/${id}`);
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

  create: async (data: CreateTicketPriceType) : Promise<serviceResponse> => {
    try {
      const response = await api.post('/ticket-prices', data);
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

  update: async (id: string, data: UpdateTicketPriceType) : Promise<serviceResponse>  => {
    try {
      const response = await api.put(`/ticket-prices/${id}`, data);
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
      await api.delete(`/ticket-prices/${id}`);
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

  findAndPaginate: async (query: PaginationQuery): Promise<PaginatedResponse<TicketPriceType>> => {
    try {
      const response = await api.get("/ticket-prices", { params: query });
      return {
        data: response.data.data,
        success: true,
        error: response.data.error || "",
        meta: response.data.meta,
        links: response.data.links,
      };
    } catch (error) {
      const apiError = handleApiError(error);
      return {
        data: [] as TicketPriceType[],
        success: false,
        error: apiError.message,
      };
    }
  },
}
