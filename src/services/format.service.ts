import api, { handleApiError } from "./api";
import type { FormatType, CreateFormatType, UpdateFormatType } from "@/types/format.type";
import type { serviceResponse } from "@/types/api.type";
import type { PaginationQuery, PaginatedResponse } from "@/types/pagination.type";

export const formatService = {
  create: async (data: CreateFormatType): Promise<serviceResponse> => {
    try {
      const response = await api.post("/formats", data);
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
      const response = await api.get("/formats/all");
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
      const response = await api.get(`/formats/${id}`);
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
      const response = await api.get(`/formats/name?name=${name}`);
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

  update: async (id: string, data: UpdateFormatType): Promise<serviceResponse> => {
    try {
      const response = await api.put(`/formats/${id}`, data);
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
      const response = await api.delete(`/formats/${id}`);
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

  findAndPaginate: async (query: PaginationQuery): Promise<PaginatedResponse<FormatType>> => {
    try {
      const response = await api.get("/formats", { params: query });
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
        data: [] as FormatType[],
        success: false,
        error: apiError.message,
      };
    }
  },
};
