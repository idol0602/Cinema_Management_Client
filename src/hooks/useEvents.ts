import { eventService } from "../services/event.service"
import type { EventType } from "../types/event.type"
import type { PaginationQuery, PaginatedResponse } from "../types/pagination.type"
import { useQuery } from "@tanstack/react-query"
import { defaultOption } from "./option"

interface UseEventsOptions extends PaginationQuery {
  initialData?: EventType[]
}

export const useEvents = (options: UseEventsOptions) => {
  const {
    page,
    limit,
    sortBy,
    search,
    searchBy,
    filter,
    initialData,
  } = options
  return useQuery<PaginatedResponse<EventType>>({
    queryKey: ["events", page, limit, sortBy, search, searchBy, JSON.stringify(filter ?? {})],
    queryFn: async () => {
      const response = await eventService.findAndPaginate({ page, limit, sortBy, search, searchBy, filter })
      return response as PaginatedResponse<EventType>
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
    } as PaginatedResponse<EventType> : undefined,
    ...defaultOption,
  })
}
