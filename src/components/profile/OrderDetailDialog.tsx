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
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
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
          <div className="space-y-6">
            {/* Order Info */}
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Mã đơn hàng</p>
                <p className="font-mono font-semibold text-gray-900 dark:text-gray-100">{details.order.id}</p>
              </div>
              <div className="text-right">
                <Badge className={statusMap[details.order.payment_status]?.color || ""}>
                  {statusMap[details.order.payment_status]?.label || details.order.payment_status}
                </Badge>
                <p className="text-xs text-gray-400 mt-1">{formatDate(details.order.created_at)}</p>
              </div>
            </div>

            {/* Movie */}
            <div className="flex gap-4 items-start">
              <div className="relative w-20 h-28 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                {details.movie?.image && (
                  <Image src={details.movie.image} alt={details.movie.title} fill className="object-cover" sizes="80px" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Film className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  {details.movie?.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {details.movie?.director} • {details.movie?.country} • {details.movie?.duration} phút
                </p>
                {details.movie?.movie_type && (
                  <Badge variant="outline" className="mt-2 text-xs">{details.movie.movie_type.type}</Badge>
                )}
              </div>
            </div>

            {/* Tickets */}
            {details.tickets && details.tickets.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
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
                        <Armchair className="w-4 h-4 text-orange-500" />
                        <div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {ticket.showtime_seat?.seat?.seat_number}
                          </span>
                          <span className="text-gray-400 mx-1">•</span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {ticket.showtime_seat?.seat?.seat_type?.name}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(ticket.ticket_price?.price)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Showtime info from first ticket */}
                  {details.tickets[0]?.showtime && (
                    <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-3 text-sm space-y-1">
                      <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {formatTime(details.tickets[0].showtime.start_time)} - {formatTime(details.tickets[0].showtime.end_time)}
                        </span>
                        <span className="text-orange-500/60 mx-1">•</span>
                        <CalendarDays className="w-3.5 h-3.5" />
                        <span>{formatDate(details.tickets[0].showtime.start_time)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400/80">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>
                          {details.tickets[0].showtime.room?.name} - {details.tickets[0].showtime.room?.location}
                          {details.tickets[0].showtime.room?.format && ` (${details.tickets[0].showtime.room.format.name})`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Menu Items */}
            {details.menu_items && details.menu_items.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-orange-500" />
                  Đồ ăn / Thức uống
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
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4 text-orange-500" />
                  Combo
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
              <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4">
                <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1 flex items-center gap-2">
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
              <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4">
                <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-1 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  Sự kiện: {details.event.name}
                </h4>
                <p className="text-sm text-purple-600 dark:text-purple-400/80">
                  {formatDate(details.event.start_date)} - {formatDate(details.event.end_date)}
                </p>
              </div>
            )}

            {/* Total */}
            <div className="flex items-center justify-between pt-4 border-t-2 border-orange-200 dark:border-orange-800">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Tổng cộng</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                {formatCurrency(details.order.total_price)}
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
