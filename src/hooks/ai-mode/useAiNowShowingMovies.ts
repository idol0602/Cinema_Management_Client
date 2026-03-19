import { movieService } from "../../services/movie.service"
import type { MovieType } from "../../types/movie.type"
import type { PaginationQuery, PaginatedResponse, PaginationMeta } from "../../types/pagination.type"
import { useQuery } from "@tanstack/react-query"
import { warmOption } from "../option"

interface UseAiNowShowingMoviesOptions extends PaginationQuery {
  initialData?: MovieType[]
  initialMeta?: PaginationMeta
}

export const useAiNowShowingMovies = (options: UseAiNowShowingMoviesOptions) => {
  const { page, limit, sortBy, search, searchBy, filter, initialData, initialMeta } = options

  return useQuery<PaginatedResponse<MovieType>>({
    queryKey: ["aiNowShowingMovies", page, limit, sortBy, search, searchBy, JSON.stringify(filter ?? {})],
    queryFn: async () => {
      return await movieService.findNowShowing({ page, limit, sortBy, search, searchBy, filter })
    },
    initialData: initialData && initialMeta
      ? {
          data: initialData,
          success: true,
          error: "",
          meta: initialMeta,
          links: {
            current: `?page=${page || 1}&limit=${limit || 10}`,
          },
        } as PaginatedResponse<MovieType>
      : initialData && !initialMeta
      ? {
          data: initialData,
          success: true,
          error: "",
          meta: {
            itemsPerPage: limit || 10,
            totalItems: initialData.length,
            currentPage: page || 1,
            totalPages: Math.ceil(initialData.length / (limit || 10)),
          },
          links: {
            current: `?page=${page || 1}&limit=${limit || 10}`,
          },
        } as PaginatedResponse<MovieType>
      : undefined,
    ...warmOption,
  })
}
