"use client"

import { useState } from "react"
import { useOrderHistory } from "@/hooks/useOrders"
import { OrderDetailDialog } from "./OrderDetailDialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import {
  Film,
  Eye,
  RotateCcw,
  Receipt,
  CalendarDays,
  CreditCard,
} from "lucide-react"
import { toast } from "sonner"

export function OrderHistory() {
  const { data: response, isLoading } = useOrderHistory()
  const orders = response?.data || []

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount?: number) => {
    if (amount == null) return "0₫"
    return amount.toLocaleString("vi-VN") + "₫"
  }

  const statusMap: Record<string, { label: string; color: string }> = {
    COMPLETED: { label: "Hoàn thành", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    PENDING: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
    FAILED: { label: "Thất bại", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    CANCELED: { label: "Đã hủy", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" },
    REFUND_PENDING: { label: "Chờ hoàn tiền", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    REFUNDED: { label: "Đã hoàn tiền", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  }

  const handleViewDetail = (orderId: string) => {
    setSelectedOrderId(orderId)
    setDetailOpen(true)
  }

  const handleRefund = (orderId: string) => {
    // Placeholder — logic will be implemented later
    toast.info(`Yêu cầu hoàn tiền cho đơn ${orderId} — tính năng đang phát triển`)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <Skeleton className="w-16 h-24 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-16">
        <Receipt className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Chưa có đơn hàng nào
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Hãy đặt vé xem phim để bắt đầu!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex gap-4 items-start">
            {/* Movie thumbnail */}
            <div className="relative w-16 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
              {order.movies?.thumbnail ? (
                <Image
                  src={order.movies.thumbnail}
                  alt={order.movies.title || ""}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Film className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {order.movies?.title || `Đơn hàng #${order.id}`}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">{order.id}</p>
                </div>
                <Badge className={`flex-shrink-0 ${statusMap[order.payment_status || ""]?.color || ""}`}>
                  {statusMap[order.payment_status || ""]?.label || order.payment_status}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {formatDate(order.created_at)}
                </span>
                {order.payment_method && (
                  <span className="flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5" />
                    {order.payment_method}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mt-3">
                <span className="text-lg font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  {formatCurrency(order.total_price)}
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetail(order.id!)}
                    className="gap-1 text-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Chi tiết
                  </Button>
                  {order.payment_status === "COMPLETED" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRefund(order.id!)}
                      className="gap-1 text-xs text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Hoàn tiền
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Detail Dialog */}
      <OrderDetailDialog
        orderId={selectedOrderId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}
