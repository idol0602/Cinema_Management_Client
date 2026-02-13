import { commentService } from "../services/comment.service";
import type {
  CommentWithUserType,
  CreateCommentType,
  UpdateCommentType,
} from "../types/comment.type";
import type {
  PaginationQuery,
  PaginatedResponse,
} from "../types/pagination.type";

import {
  useQuery,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";

import { defaultOption } from "./option";

interface UseCommentsOptions extends PaginationQuery {
  initialData?: CommentWithUserType[];
}

export const useComments = (options: UseCommentsOptions) => {
  const queryClient = useQueryClient();

  const {
    page,
    limit,
    sortBy,
    search,
    searchBy,
    filter,
    initialData,
  } = options;

  // ================================
  // QUERY KEY
  // ================================
  const baseKey = ["comments"];

  const queryKey = [
    ...baseKey,
    page,
    limit,
    sortBy,
    search,
    searchBy,
    JSON.stringify(filter ?? {}),
  ];

  // ================================
  // FETCH COMMENTS
  // ================================
  const query = useQuery<PaginatedResponse<CommentWithUserType>>({
    queryKey,
    queryFn: async () => {
      const response = await commentService.findAndPaginate({
        page,
        limit,
        sortBy,
        search,
        searchBy,
        filter,
      });

      if (!response.success) {
        throw new Error(response.error);
      }

      return response as PaginatedResponse<CommentWithUserType>;
    },

    initialData: initialData
      ? {
          data: initialData,
          success: true,
          error: "",
          meta: {
            itemsPerPage: limit || 10,
            totalItems: initialData.length,
            currentPage: page || 1,
            totalPages: Math.ceil(
              initialData.length / (limit || 10)
            ),
          },
          links: {
            current: `?page=${page || 1}&limit=${limit || 10}`,
          },
        }
      : undefined,

    ...defaultOption,
  });

  // ================================
  // CREATE COMMENT
  // ================================
  const createMutation = useMutation({
    mutationFn: async (data: CreateCommentType) => {
      const response = await commentService.create(data);

      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: baseKey });
    },
  });

  // ================================
  // UPDATE COMMENT
  // ================================
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCommentType;
    }) => {
      const response = await commentService.update(id, data);

      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: baseKey });
    },
  });

  // ================================
  // DELETE COMMENT
  // ================================
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await commentService.delete(id);

      if (!response.success) {
        throw new Error(response.error);
      }

      return id;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: baseKey });
    },
  });

  // ================================
  // RETURN
  // ================================
  return {
    // query data
    ...query,

    // actions
    createComment: createMutation.mutate,
    updateComment: updateMutation.mutate,
    deleteComment: deleteMutation.mutate,

    // async versions (await được)
    createCommentAsync: createMutation.mutateAsync,
    updateCommentAsync: updateMutation.mutateAsync,
    deleteCommentAsync: deleteMutation.mutateAsync,

    // loading states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // error states
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,

    // manual invalidate
    invalidate: () =>
      queryClient.invalidateQueries({ queryKey: baseKey }),
  };
};
