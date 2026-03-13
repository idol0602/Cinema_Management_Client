import { useQuery } from "@tanstack/react-query"
import { showTimeService } from "@/services/showTime.service"
import type { PaginationQuery, PaginatedResponse } from "@/types/pagination.type"
import type { ShowTimeType } from "@/types/showTime.type"
import { defaultOption } from "./option"

interface UseShowTimesOptions extends PaginationQuery {
  initialData?: ShowTimeType[]
  enabled?: boolean
}

export const useShowTimes = (options: UseShowTimesOptions) => {
  const {
    page,
    limit,
    sortBy,
    search,
    searchBy,
    filter,
    initialData,
    enabled,
  } = options

  return useQuery<PaginatedResponse<ShowTimeType>>({
    queryKey: ["showTimes", page, limit, sortBy, search, searchBy, JSON.stringify(filter ?? {})],
    queryFn: async () => {
      return await showTimeService.findAndPaginate({ page, limit, sortBy, search, searchBy, filter })
    },
    enabled: enabled !== false,
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
    } as PaginatedResponse<ShowTimeType> : undefined,
    ...defaultOption,
  })
}
