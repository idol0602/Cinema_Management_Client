import { comboService } from "../services/combo.service"
import type { ComboType } from "../types/combo.type"
import type { PaginationQuery, PaginatedResponse } from "../types/pagination.type"
import { useQuery } from "@tanstack/react-query"
import { defaultOption } from "./option"

interface UseCombosOptions extends PaginationQuery {
  initialData?: ComboType[]
}

export const useCombos = (options: UseCombosOptions) => {
  const {
    page,
    limit,
    sortBy,
    search,
    searchBy,
    filter,
    initialData,
  } = options
  return useQuery<PaginatedResponse<ComboType>>({
    queryKey: ["combos", page, limit, sortBy, search, searchBy, JSON.stringify(filter ?? {})],
    queryFn: async () => {
      const response = await comboService.findAndPaginate({ page, limit, sortBy, search, searchBy, filter })
      return response as PaginatedResponse<ComboType>
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
    } as PaginatedResponse<ComboType> : undefined,
    ...defaultOption,
  })
}
