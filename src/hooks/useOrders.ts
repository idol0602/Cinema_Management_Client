import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { orderService } from "@/services/order.service"
import type {PaginationQuery, PaginatedResponse} from "../types/pagination.type"
import type { OrderType, OrderDetails } from "@/types/order.type"
import { defaultOption } from "./option"

interface UseOrderHistoryOptions extends PaginationQuery {
    initialData?: OrderType[]
}

export const useOrderHistory = (options: UseOrderHistoryOptions) => {
    const {
        page,
        limit,
        sortBy,
        search,
        searchBy,
        filter,
        initialData,
      } = options
  return useQuery<PaginatedResponse<OrderType>>({
    queryKey: ["orderHistory", page, limit, sortBy, search, searchBy, JSON.stringify(filter ?? {})],
    queryFn: async () => {
      return await orderService.getOrderHistory({ page, limit, sortBy, search, searchBy, filter })
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
    } as PaginatedResponse<OrderType> : undefined,
    ...defaultOption,
  })
}

export const useOrderDetails = (orderId: string | null) => {
  return useQuery<{ data: OrderDetails; success: boolean; error?: string }>({
    queryKey: ["orderDetails", orderId],
    queryFn: async () => {
      const response = await orderService.getOrderDetails(orderId!)
      return response as { data: OrderDetails; success: boolean; error?: string }
    },
    enabled: !!orderId,
    ...defaultOption,
  })
}

export const useProcessOrderPayment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: Parameters<typeof orderService.processOrderPayment>[0]) => {
      return await orderService.processOrderPayment(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orderHistory"] })
    },
  })
}
