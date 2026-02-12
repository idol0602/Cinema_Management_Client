import { postService } from "../services/post.service"
import type { PostType } from "../types/post.type"
import type { PaginationQuery, PaginatedResponse } from "../types/pagination.type"
import { useQuery } from "@tanstack/react-query"
import { defaultOption } from "./option"

interface UsePostsOptions extends PaginationQuery {
  initialData?: PostType[]
}

export const usePosts = (options: UsePostsOptions) => {
  const {
    page,
    limit,
    sortBy,
    search,
    searchBy,
    filter,
    initialData,
  } = options
  
  return useQuery<PaginatedResponse<PostType>>({
    queryKey: ["posts", page, limit, sortBy, search, searchBy, JSON.stringify(filter ?? {})],
    queryFn: async () => {
      const response = await postService.findAndPaginate({ page, limit, sortBy, search, searchBy, filter })
      return response as PaginatedResponse<PostType>
    },
    initialData: initialData ? {
      data: initialData,
      success: true,
      error: "",
      meta: {
        itemsPerPage: limit || 10,
        totalItems: initialData.length,
        currentPage: page || 1,
        totalPages: Math.ceil(initialData.length / (limit || 10))
      },
      links: {
        current: `?page=${page || 1}&limit=${limit || 10}`
      }
    } as PaginatedResponse<PostType> : undefined,
    ...defaultOption,
  })
}
