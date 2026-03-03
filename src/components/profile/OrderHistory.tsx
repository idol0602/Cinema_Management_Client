"use client"

import { useState, useEffect } from "react"
import { useOrderHistory } from "@/hooks/useOrders"
import { OrderDetailDialog } from "./OrderDetailDialog"
import { orderService } from "@/services/order.service"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Image from "next/image"
import { statusMap } from "@/lib/statusMap"
import { orderPaginationConfig } from "@/config/paginate/order.config"
import {
  Film,
  Eye,
  RotateCcw,
  Receipt,
  CalendarDays,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  AlertTriangle,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { OrderType } from "@/types/order.type"
import { useQueryClient } from "@tanstack/react-query"

const paymentStatusOptions = [
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "PENDING", label: "Chờ xử lý" },
  { value: "FAILED", label: "Thất bại" },
  { value: "CANCELED", label: "Đã hủy" },
  { value: "REFUND_PENDING", label: "Chờ hoàn tiền" },
  { value: "REFUNDED", label: "Đã hoàn tiền" },
]

export function OrderHistory() {
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortColumn, setSortColumn] = useState("")
  const [orderColumn, setOrderColumn] = useState("")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("")

  // Build filter
  const buildFilter = () => {
    const filter: Record<string, any> = {}
    if (paymentStatusFilter) {
      filter.payment_status = paymentStatusFilter
    }
    return filter
  }

  // Build sortBy
  const buildSortBy = () => {
    if (sortColumn && orderColumn) {
      return `${sortColumn}:${orderColumn}`
    } else if (sortColumn) {
      return `${sortColumn}:DESC`
    }
    return orderPaginationConfig.defaultSortBy[0].join(":")
  }

  const initialData: OrderType[] = []
  const { data: response, isLoading } = useOrderHistory({
    page,
    limit: orderPaginationConfig.defaultLimit,
    sortBy: buildSortBy(),
    search: searchQuery || "",
    searchBy: searchQuery ? "id" : "",
    filter: buildFilter(),
    initialData,
  })

  const orders = response?.data || []
  const meta = response?.meta

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [refundDialogOpen, setRefundDialogOpen] = useState(false)
  const [refundOrder, setRefundOrder] = useState<OrderType | null>(null)
  const [isRefunding, setIsRefunding] = useState(false)
  const [refundEligible, setRefundEligible] = useState(false)
  const [refundMessage, setRefundMessage] = useState("")
  const queryClient = useQueryClient()

  // Auto-search when filters change
  useEffect(() => {
    setPage(1)
  }, [sortColumn, orderColumn, paymentStatusFilter])

  const handleSearch = () => {
    setPage(1)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleClearFilter = (filterType: string) => {
    if (filterType === "sort") {
      setSortColumn("")
      setOrderColumn("")
    }
    if (filterType === "search") {
      setSearchQuery("")
    }
    if (filterType === "status") {
      setPaymentStatusFilter("")
    }
  }

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

  const handleViewDetail = (orderId: string) => {
    setSelectedOrderId(orderId)
    setDetailOpen(true)
  }

  const handleRefund = async (order: OrderType) => {
    // Check conditions on client side
    const isMomo = order.payment_method === "MOMO"

    if (!isMomo) {
      setRefundEligible(false)
      setRefundMessage(
        "Đơn hàng này không đủ điều kiện hoàn tiền. Chỉ hỗ trợ hoàn tiền cho đơn hàng thanh toán qua MoMo."
      )
      setRefundOrder(order)
      setRefundDialogOpen(true)
      return
    }

    // Fetch order details to get showtime start_time
    try {
      const detailRes = await orderService.getOrderDetails(order.id!)
      if (!detailRes.success || !detailRes.data) {
        toast.error("Không thể tải thông tin đơn hàng")
        return
      }

      const details = detailRes.data as any
      const startTime = details.tickets?.[0]?.showtime?.start_time

      if (!startTime) {
        toast.error("Không tìm thấy thông tin suất chiếu")
        return
      }

      const now = new Date()
      const showStart = new Date(startTime)
      const twoHoursMs = 2 * 60 * 60 * 1000
      const isBeforeTwoHours = showStart.getTime() - now.getTime() >= twoHoursMs

      if (!isBeforeTwoHours) {
        setRefundEligible(false)
        setRefundMessage(
          "Đơn hàng này không đủ điều kiện hoàn tiền. Bạn chỉ có thể yêu cầu hoàn tiền trước thời gian bắt đầu suất chiếu ít nhất 2 giờ."
        )
      } else {
        setRefundEligible(true)
        setRefundMessage(
          `Bạn có chắc chắn muốn yêu cầu hoàn tiền cho đơn hàng này?\n\nSố tiền: ${formatCurrency(order.total_price)}\nPhương thức: ${order.payment_method}`
        )
      }

      setRefundOrder(order)
      setRefundDialogOpen(true)
    } catch {
      toast.error("Có lỗi xảy ra khi kiểm tra điều kiện hoàn tiền")
    }
  }

  const handleConfirmRefund = async () => {
    if (!refundOrder?.id) return
    setIsRefunding(true)
    try {
      const res = await orderService.requestRefund(refundOrder.id)
      if (res.success) {
        toast.success("Yêu cầu hoàn tiền đã được gửi thành công!")
        setRefundDialogOpen(false)
        setRefundOrder(null)
        // Refresh order list
        queryClient.invalidateQueries({ queryKey: ["orderHistory"] })
      } else {
        toast.error(res.error || "Yêu cầu hoàn tiền thất bại")
      }
    } catch {
      toast.error("Có lỗi xảy ra khi gửi yêu cầu hoàn tiền")
    } finally {
      setIsRefunding(false)
    }
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

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Tìm theo mã đơn hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-9 h-9 text-sm"
            />
          </div>

          {/* Payment Status */}
          <Select value={paymentStatusFilter || "ALL"} onValueChange={(val) => setPaymentStatusFilter(val === "ALL" ? "" : val)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              {paymentStatusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select value={sortColumn || "DEFAULT"} onValueChange={(val) => setSortColumn(val === "DEFAULT" ? "" : val)}>
            <SelectTrigger className="h-9 text-sm">
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DEFAULT">Mặc định</SelectItem>
              {orderPaginationConfig.sortableColumns.map((col) => (
                <SelectItem key={col.value} value={col.value}>
                  {col.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Order */}
          <Select value={orderColumn || "DESC"} onValueChange={setOrderColumn} disabled={!sortColumn}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Thứ tự" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ASC">Tăng dần</SelectItem>
              <SelectItem value="DESC">Giảm dần</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {(searchQuery || paymentStatusFilter || sortColumn) && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <span className="text-xs text-gray-500 mr-1">Bộ lọc:</span>
            {searchQuery && (
              <Button variant="secondary" size="sm" onClick={() => handleClearFilter("search")} className="h-6 text-xs px-2">
                Tìm: &quot;{searchQuery}&quot; ×
              </Button>
            )}
            {paymentStatusFilter && (
              <Button variant="secondary" size="sm" onClick={() => handleClearFilter("status")} className="h-6 text-xs px-2">
                {paymentStatusOptions.find(o => o.value === paymentStatusFilter)?.label} ×
              </Button>
            )}
            {sortColumn && (
              <Button variant="secondary" size="sm" onClick={() => handleClearFilter("sort")} className="h-6 text-xs px-2">
                {orderPaginationConfig.sortableColumns.find(c => c.value === sortColumn)?.label} {orderColumn === "ASC" ? "↑" : "↓"} ×
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Orders */}
      {!orders || orders.length === 0 ? (
        <div className="text-center py-16">
          <Receipt className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Chưa có đơn hàng nào
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {paymentStatusFilter || searchQuery
              ? "Không tìm thấy đơn hàng phù hợp. Thử thay đổi bộ lọc."
              : "Hãy đặt vé xem phim để bắt đầu!"}
          </p>
        </div>
      ) : (
        <>
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
                      {order.payment_status === "COMPLETED" && order.payment_method === "MOMO" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRefund(order)}
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

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-12">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Hiển thị {(meta.currentPage - 1) * meta.itemsPerPage + 1} -{" "}
                {Math.min(meta.currentPage * meta.itemsPerPage, meta.totalItems)}{" "}
                của {meta.totalItems} đơn hàng
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === meta.totalPages ||
                        Math.abs(p - page) <= 1
                    )
                    .map((p, index, array) => (
                      <div key={p} className="flex items-center">
                        {index > 0 && array[index - 1] !== p - 1 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        <Button
                          variant={page === p ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(p)}
                          className={
                            page === p
                              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white min-w-10"
                              : "hover:bg-orange-50 dark:hover:bg-orange-950 min-w-10"
                          }
                        >
                          {p}
                        </Button>
                      </div>
                    ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.min(meta.totalPages, prev + 1))}
                  disabled={page === meta.totalPages}
                  className="gap-1"
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail Dialog */}
      <OrderDetailDialog
        orderId={selectedOrderId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      {/* Refund Confirm Dialog */}
      <AlertDialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className={`w-5 h-5 ${refundEligible ? "text-orange-500" : "text-red-500"}`} />
              {refundEligible ? "Xác nhận yêu cầu hoàn tiền" : "Không đủ điều kiện hoàn tiền"}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p className="whitespace-pre-line">{refundMessage}</p>
                <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 text-sm text-orange-700 dark:text-orange-400">
                  <p className="font-semibold mb-1">📋 Chính sách hoàn tiền:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Chỉ hỗ trợ hoàn tiền cho đơn hàng thanh toán qua <strong>MoMo</strong></li>
                    <li>Yêu cầu phải trước thời gian bắt đầu suất chiếu <strong>ít nhất 2 giờ</strong></li>
                    <li>Sau khi gửi yêu cầu, nhân viên sẽ xử lý hoàn tiền trong thời gian sớm nhất</li>
                  </ul>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRefunding}>Đóng</AlertDialogCancel>
            {refundEligible && (
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={handleConfirmRefund}
                disabled={isRefunding}
              >
                {isRefunding ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RotateCcw className="w-4 h-4 mr-2" />
                )}
                Gửi yêu cầu hoàn tiền
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
