import api, { handleApiError } from "./api"
import type {serviceResponse} from "../types/api.type"
import type { MovieType, createMovieWithTypes, updateMovieWithTypes } from "@/types/movie.type"
import type {PaginationQuery, PaginatedResponse} from "@/types/pagination.type"
import type {importResponse} from "@/types/importResponse.type"

export const movieService = {
  getAll: async () : Promise<serviceResponse> => {
        try {
            const response = await api.get('/movies/all')
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
            const response = await api.get(`/movies/${id}`);
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

  getByName: async (name: string) : Promise<serviceResponse> => {
    try {
      const response = await api.get(`/movies/name?name=${name}`);
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

  create: async (data: createMovieWithTypes) : Promise<serviceResponse> => {
    try {
      const response = await api.post('/movies', data);
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

  update: async (id: string, data: updateMovieWithTypes) : Promise<serviceResponse>  => {
    try {
      const response = await api.put(`/movies/${id}`, data);
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
      await api.delete(`/movies/${id}`);
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

  findAndPaginate: async(query: PaginationQuery): Promise<PaginatedResponse<MovieType>> => {
    try {
        const response = await api.get("/movies", { params: query });
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

  importFromExcel: async(file: File): Promise<importResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post("/movies/import", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response)

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
  },

  findNowShowing: async(query: PaginationQuery): Promise<PaginatedResponse<MovieType>> => {
    try {
      const response = await api.get("/movies/now-showingg", { params: query });
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
        error: apiError.message,
      };
    }
  },

  findComingSoon: async(query: PaginationQuery): Promise<PaginatedResponse<MovieType>> => {
    try {
      const response = await api.get("/movies/coming-soon", { params: query });
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
        error: apiError.message,
      };
    }
  }
}