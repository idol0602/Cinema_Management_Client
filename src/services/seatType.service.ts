import api, { handleApiError } from "./api";
import type { SeatTypeDetailType, CreateSeatTypeDetailType, UpdateSeatTypeDetailType } from "@/types/seatTypeDetail.type";
import type { serviceResponse } from "@/types/api.type";
import type { PaginationQuery, PaginatedResponse } from "@/types/pagination.type";

export const seatTypeService = {
  create: async (data: CreateSeatTypeDetailType): Promise<serviceResponse> => {
    try {
      const response = await api.post("/seat-types", data);
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

  findAll: async (): Promise<serviceResponse> => {
    try {
      const response = await api.get("/seat-types/all");
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

  findById: async (id: string): Promise<serviceResponse> => {
    try {
      const response = await api.get(`/seat-types/${id}`);
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

  findByName: async (name: string): Promise<serviceResponse> => {
    try {
      const response = await api.get(`/seat-types/name?name=${name}`);
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

  update: async (id: string, data: UpdateSeatTypeDetailType): Promise<serviceResponse> => {
    try {
      const response = await api.put(`/seat-types/${id}`, data);
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

  remove: async (id: string): Promise<serviceResponse> => {
    try {
      const response = await api.delete(`/seat-types/${id}`);
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

  findAndPaginate: async (query: PaginationQuery): Promise<PaginatedResponse<SeatTypeDetailType>> => {
    try {
      const response = await api.get("/seat-types", { params: query });
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
        data: [] as SeatTypeDetailType[],
        success: false,
        error: apiError.message,
      };
    }
  },
};
