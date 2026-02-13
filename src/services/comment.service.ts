import api, { handleApiError } from "./api"
import type {serviceResponse} from "../types/api.type"
import type {CreateCommentType, UpdateCommentType, CommentType} from "@/types/comment.type"
import type {PaginationQuery, PaginatedResponse} from "../types/pagination.type"

export const commentService = {
  // getById: async (id: string) : Promise<serviceResponse> => {
  //   try {
  //     const response = await api.get(`/comments/${id}`);
  //     return {
  //       data: response.data.data,
  //       success : true,
  //       error: response.data.error,
  //     };
  //   } catch (error) {
  //     const apiError = handleApiError(error);
  //     return {
  //       data: {},
  //       success : false,
  //       error: apiError.message
  //     }
  //   }
  // },

  create: async (data: CreateCommentType) : Promise<serviceResponse> => {
    try {
      const response = await api.post('/comments', data);
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

  update: async (id: string, data: UpdateCommentType) : Promise<serviceResponse>  => {
    try {
      const response = await api.put(`/comments/${id}`, data);
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
      await api.delete(`/comments/${id}`);
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

  findAndPaginate: async(query: PaginationQuery): Promise<PaginatedResponse<CommentType>> => {
    try {
      const response = await api.get("/comments", { params: query });
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