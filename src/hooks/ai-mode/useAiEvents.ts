import { eventService } from "../../services/event.service"
import type { EventType } from "../../types/event.type"
import type { PaginationQuery, PaginatedResponse } from "../../types/pagination.type"
import { useQuery } from "@tanstack/react-query"
import { defaultOption } from "../option"

interface UseAiEventsOptions extends PaginationQuery {
  initialData?: EventType[]
  enabled?: boolean
}

export const useAiEvents = (options: UseAiEventsOptions) => {
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
  return useQuery<PaginatedResponse<EventType>>({
    queryKey: ["aiEvents", page, limit, sortBy, search, searchBy, JSON.stringify(filter ?? {})],
    queryFn: async () => {
      const response = await eventService.findAndPaginate({ page, limit, sortBy, search, searchBy, filter })
      return response as PaginatedResponse<EventType>
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
    } as PaginatedResponse<EventType> : undefined,
    ...defaultOption,
  })
}
