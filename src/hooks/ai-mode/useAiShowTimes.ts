import { useQuery } from "@tanstack/react-query"
import { showTimeService } from "../../services/showTime.service"
import type { PaginationQuery, PaginatedResponse, PaginationMeta } from "../../types/pagination.type"
import type { ShowTimeType } from "../../types/showTime.type"
import { hotOption } from "../option"

interface UseAiShowTimesOptions extends PaginationQuery {
  initialData?: ShowTimeType[]
  initialMeta?: PaginationMeta
  enabled?: boolean
}

export const useAiShowTimes = (options: UseAiShowTimesOptions) => {
  const {
    page,
    limit,
    sortBy,
    search,
    searchBy,
    filter,
    initialData,
    initialMeta,
    enabled,
  } = options

  return useQuery<PaginatedResponse<ShowTimeType>>({
    queryKey: ["aiShowTimes", page, limit, sortBy, search, searchBy, JSON.stringify(filter ?? {})],
    queryFn: async () => {
      return await showTimeService.findAndPaginate({ page, limit, sortBy, search, searchBy, filter })
    },
    enabled: enabled !== false,
    initialData: initialData && initialMeta
      ? {
          data: initialData,
          success: true,
          error: "",
          meta: initialMeta,
          links: {
            current: `?page=${page || 1}&limit=${limit || 10}`
          }
        } as PaginatedResponse<ShowTimeType>
      : initialData && !initialMeta
      ? {
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
        } as PaginatedResponse<ShowTimeType>
      : undefined,
    ...hotOption,
  })
}
