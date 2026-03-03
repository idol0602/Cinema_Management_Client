"use client"

import { useOrderDetails } from "@/hooks/useOrders"
import type { OrderDetails } from "@/types/order.type"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import {
  Film,
  MapPin,
  Clock,
  Armchair,
  UtensilsCrossed,
  Package,
  Tag,
  CalendarDays,
  Ticket,
  Receipt,
  Sparkles,
  ShoppingCart,
} from "lucide-react"

interface OrderDetailDialogProps {
  orderId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDetailDialog({ orderId, open, onOpenChange }: OrderDetailDialogProps) {
  const { data: response, isLoading } = useOrderDetails(orderId)
  const details: OrderDetails | undefined = response?.data

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleTimeString("vi-VN", {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-orange-500" />
            Chi tiết đơn hàng
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : !details ? (
          <p className="text-center text-gray-500 py-8">Không thể tải chi tiết đơn hàng</p>
        ) : (
          <div className="space-y-5">
            {/* Order Info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Mã đơn hàng</p>
                <p className="font-mono font-semibold text-sm text-gray-900 dark:text-gray-100 break-all">{details.order.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Trạng thái</p>
                <Badge className={`mt-0.5 ${statusMap[details.order.payment_status]?.color || ""}`}>
                  {statusMap[details.order.payment_status]?.label || details.order.payment_status}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Phương thức</p>
                <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                  {details.order.payment_method || "Tại quầy"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Tổng tiền</p>
                <p className="font-bold text-base bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  {formatCurrency(details.order.total_price)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Thuế VAT (10%)</p>
                <p className="font-semibold text-sm text-orange-500">{formatCurrency(details.order.service_vat)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ngày đặt</p>
                <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{formatDate(details.order.created_at)}</p>
              </div>
              {details.order.trans_id && (
                <div className="col-span-full">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Mã giao dịch</p>
                  <p className="font-mono font-semibold text-sm text-gray-900 dark:text-gray-100">{details.order.trans_id}</p>
                </div>
              )}
            </div>

            {/* Movie */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2 text-sm">
                <Film className="w-4 h-4 text-orange-500" />
                Thông Tin Phim
              </h4>
              <div className="flex gap-4 items-start">
                <div className="relative w-20 h-28 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0 shadow-md">
                  {details.movie?.image && (
                    <Image src={details.movie.image} alt={details.movie.title} fill className="object-cover" sizes="80px" />
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-base">{details.movie?.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Đạo diễn:</span> {details.movie?.director}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Thời lượng:</span> {details.movie?.duration} phút • {details.movie?.country}
                  </p>
                  {details.movie?.movie_type && (
                    <Badge variant="outline" className="text-xs mt-1">{details.movie.movie_type.type}</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Showtime Info - Extracted from first ticket */}
            {details.tickets && details.tickets.length > 0 && details.tickets[0]?.showtime && (
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
                <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-3 flex items-center gap-2 text-sm">
                  <CalendarDays className="w-4 h-4" />
                  Thông Tin Suất Chiếu
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Clock className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                    <span>
                      <span className="font-medium">Giờ chiếu:</span>{" "}
                      {formatTime(details.tickets[0].showtime.start_time)}
                      {details.tickets[0].showtime.end_time ? ` - ${formatTime(details.tickets[0].showtime.end_time)}` : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <CalendarDays className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                    <span>
                      <span className="font-medium">Ngày chiếu:</span>{" "}
                      {formatDate(details.tickets[0].showtime.start_time)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <MapPin className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                    <span>
                      <span className="font-medium">Phòng:</span>{" "}
                      {details.tickets[0].showtime.room?.name}
                      {details.tickets[0].showtime.room?.format && ` (${details.tickets[0].showtime.room.format.name})`}
                    </span>
                  </div>
                  {details.tickets[0].showtime.room?.location && (
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                      <span className="truncate" title={details.tickets[0].showtime.room.location}>
                        <span className="font-medium">Vị trí:</span>{" "}
                        {details.tickets[0].showtime.room.location}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Tag className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                    <span>
                      <span className="font-medium">Loại ngày:</span>{" "}
                      {details.tickets[0].showtime.day_type === "WEEKDAY" ? "Ngày thường" : "Cuối tuần/Lễ"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tickets */}
            {details.tickets && details.tickets.length > 0 && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2 text-sm">
                  <Ticket className="w-4 h-4 text-orange-500" />
                  Vé ({details.tickets.length})
                </h4>
                <div className="space-y-2">
                  {details.tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <Armchair className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {ticket.showtime_seat?.seat?.seat_number}
                          </span>
                          <span className="text-gray-400 mx-1">•</span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {ticket.showtime_seat?.seat?.seat_type?.name}
                          </span>
                          {ticket.checked_in !== undefined && (
                            <Badge variant={ticket.checked_in ? "default" : "outline"} className="ml-2 text-xs">
                              {ticket.checked_in ? "Đã check-in" : "Chưa check-in"}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(ticket.ticket_price?.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Menu Items */}
            {details.menu_items && details.menu_items.length > 0 && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2 text-sm">
                  <UtensilsCrossed className="w-4 h-4 text-orange-500" />
                  Đồ ăn / Thức uống ({details.menu_items.length})
                </h4>
                <div className="space-y-2">
                  {details.menu_items.map((mi) => (
                    <div key={mi.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-sm">
                      <div className="flex items-center gap-3">
                        {mi.item?.image && (
                          <div className="relative w-10 h-10 rounded overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                            <Image src={mi.item.image} alt={mi.item.name} fill className="object-cover" sizes="40px" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{mi.item?.name}</p>
                          <p className="text-gray-400 text-xs">x{mi.quantity} • {formatCurrency(mi.unit_price)}/cái</p>
                        </div>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(mi.total_price)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Combos */}
            {details.combos && details.combos.length > 0 && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2 text-sm">
                  <Package className="w-4 h-4 text-orange-500" />
                  Combo ({details.combos.length})
                </h4>
                <div className="space-y-2">
                  {details.combos.map((c) => (
                    <div key={c.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-sm">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{c.combo?.name}</p>
                        <p className="font-medium text-orange-600 dark:text-orange-400">{formatCurrency(c.combo?.total_price)}</p>
                      </div>
                      <p className="text-gray-400 text-xs">{c.combo?.description}</p>
                      {c.combo?.items && c.combo.items.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 space-y-1">
                          {c.combo.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                              <span>{item.menu_item?.name} x{item.quantity}</span>
                              <span>{formatCurrency(item.unit_price)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Discount */}
            {details.discount && (
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1 flex items-center gap-2 text-sm">
                  <Tag className="w-4 h-4" />
                  Giảm giá: {details.discount.name}
                </h4>
                <p className="text-sm text-green-600 dark:text-green-400/80">
                  Giảm {details.discount.discount_percent}% • {details.discount.description}
                </p>
              </div>
            )}

            {/* Event */}
            {details.event && (
              <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-1 flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4" />
                  Sự kiện: {details.event.name}
                </h4>
                <p className="text-sm text-purple-600 dark:text-purple-400/80">
                  {details.event.description}
                </p>
                <p className="text-xs text-purple-500 dark:text-purple-400/60 mt-1">
                  {formatDate(details.event.start_date)} - {formatDate(details.event.end_date)}
                </p>
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/10 dark:to-amber-950/10 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2 text-sm">
                <Receipt className="w-4 h-4 text-orange-500" />
                Tổng Kết Đơn Hàng
              </h4>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Tiền vé ({details.tickets?.length || 0} vé):</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {formatCurrency(
                      details.tickets?.reduce((sum, t) => sum + (t.ticket_price?.price || 0), 0) || 0
                    )}
                  </span>
                </div>
                {details.menu_items && details.menu_items.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Đồ ăn/uống:</span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {formatCurrency(details.menu_items.reduce((sum, m) => sum + (m.total_price || 0), 0))}
                    </span>
                  </div>
                )}
                {details.combos && details.combos.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Combo:</span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {formatCurrency(details.combos.reduce((sum, c) => sum + (c.combo?.total_price || 0), 0))}
                    </span>
                  </div>
                )}
                {details.discount && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Giảm giá ({details.discount.discount_percent}%):</span>
                    <span>
                      -{formatCurrency(
                        ((details.order.total_price - details.order.service_vat) *
                          details.discount.discount_percent) /
                          (100 - details.discount.discount_percent)
                      )}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-orange-600 dark:text-orange-400">
                  <span>Phí dịch vụ (10% VAT):</span>
                  <span>+{formatCurrency(details.order.service_vat)}</span>
                </div>
                <div className="border-t border-orange-200 dark:border-orange-700 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900 dark:text-gray-100">Tổng thanh toán:</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                      {formatCurrency(details.order.total_price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
