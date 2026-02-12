import api, { handleApiError } from "./api"
import type {serviceResponse} from "../types/api.type"
import type {SeatTypeCreate, SeatTypeUpdate, SeatType} from "@/types/seat.type"
import type {PaginationQuery, PaginatedResponse} from "@/types/pagination.type"
import type {importResponse} from "@/types/importResponse.type"

export const seatService = {
  getAll: async () : Promise<serviceResponse> => {
    try {
      const response = await api.get('/seats/all')
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
      const response = await api.get(`/seats/${id}`);
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

  create: async (data: SeatTypeCreate) : Promise<serviceResponse> => {
    try {
      const response = await api.post('/seats', data);
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

  update: async (id: string, data: SeatTypeUpdate) : Promise<serviceResponse>  => {
    try {
      const response = await api.put(`/seats/${id}`, data);
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
      await api.delete(`/seats/${id}`);
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

  getSeatByRoomId : async (roomId: string) => {
    try {
      const response = await api.get(`/seats/room/${roomId}`);
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

  findAndPaginate: async(query: PaginationQuery): Promise<PaginatedResponse<SeatType>> => {
    try {
        const response = await api.get("/seats", { params: query });
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

  importFromExcel: async(file: File, roomId: string): Promise<importResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('roomId', roomId);
      
      const response = await api.post("/seats/import", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: response.data.success,
        message: response.data.message,
        data: {
            imported: response.data.data.imported,
            skipped: response.data.data.skipped
        }
      }
    } catch (error) {
      const apiError = handleApiError(error);
      return {
        success: false,
        message: apiError.message,
        data: {
            imported: 0,
            skipped: 0
        }
      }
    }
  }
}