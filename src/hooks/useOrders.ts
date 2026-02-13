import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { orderService } from "@/services/order.service"
import type { PaginatedResponse } from "@/types/pagination.type"
import type { OrderType, OrderDetails } from "@/types/order.type"
import { defaultOption } from "./option"

export const useOrderHistory = () => {
  return useQuery<PaginatedResponse<OrderType>>({
    queryKey: ["orderHistory"],
    queryFn: async () => {
      return await orderService.getOrderHistory()
    },
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
