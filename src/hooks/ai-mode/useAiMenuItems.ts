import { menuItemService } from "../../services/menuItem.service"
import type { MenuItemType } from "../../types/menuItem.type"
import type { PaginationQuery, PaginatedResponse, PaginationMeta } from "../../types/pagination.type"
import { useQuery } from "@tanstack/react-query"
import { coldOption } from "../option"

interface UseAiMenuItemsOptions extends PaginationQuery {
  initialData?: MenuItemType[]
  initialMeta?: PaginationMeta
  enabled?: boolean
}

export const useAiMenuItems = (options: UseAiMenuItemsOptions) => {
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

  // Always force is_active: true for customer-facing
  const finalFilter = { ...filter, is_active: "true" }

  return useQuery<PaginatedResponse<MenuItemType>>({
    queryKey: ["aiMenuItems", page, limit, sortBy, search, searchBy, JSON.stringify(finalFilter)],
    queryFn: async () => {
      const response = await menuItemService.findAndPaginate({
        page, limit, sortBy, search, searchBy, filter: finalFilter,
      })
      return response as PaginatedResponse<MenuItemType>
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
        } as PaginatedResponse<MenuItemType>
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
        } as PaginatedResponse<MenuItemType>
      : undefined,
    ...coldOption,
  })
}
