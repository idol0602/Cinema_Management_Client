import api, { handleApiError } from "./api"
import type {serviceResponse} from "../types/api.type"
import type {PaginationQuery, PaginatedResponse} from "@/types/pagination.type"
import type {MovieMovieType, CreateMovieMovieType, UpdateMovieMovieType} from "@/types/movieMovieType.type"

export const MovieMovieTypeService = {
    create: async (data: CreateMovieMovieType): Promise<serviceResponse> => {
        try {
            const response = await api.post("/movie-movie-types", data);
            return {
                data: response.data.data,
                success: true,
                error: response.data.error || "",
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

    findAll: async (query: PaginationQuery): Promise<PaginatedResponse<MovieMovieType>> => {
        try {
            const response = await api.get("/movie-movie-types", { params: query });
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

    findById: async (id: string): Promise<serviceResponse> => {
        try {
            const response = await api.get(`/movie-movie-types/${id}`);
            return {
                data: response.data.data,
                success: true,
                error: response.data.error || "",
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

    update: async (id: string, data: UpdateMovieMovieType): Promise<serviceResponse> => {
        try {
            const response = await api.put(`/movie-movie-types/${id}`, data);
            return {
                data: response.data.data,
                success: true,
                error: response.data.error || "",
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
            const response = await api.delete(`/movie-movie-types/${id}`);
            return {
                data: response.data.data,
                success: true,
                error: response.data.error || "",
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

    findAndPaginate: async (query: PaginationQuery): Promise<PaginatedResponse<MovieMovieType>> => {
        try {
            const response = await api.get("/movie-movie-types", { params: query });
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