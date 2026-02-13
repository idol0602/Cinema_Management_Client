"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { comboService } from "@/services/combo.service"
import type { ComboDetailType } from "@/types/combo.type"
import { UtensilsCrossed, Film, Calendar, Tag, Package } from "lucide-react"

interface ComboDetailDialogProps {
  comboId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ComboDetailDialog({ comboId, open, onOpenChange }: ComboDetailDialogProps) {
  const [detail, setDetail] = useState<ComboDetailType | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (comboId && open) {
      setLoading(true)
      comboService.getDetails(comboId).then((res) => {
        if (res.success) {
          setDetail(res.data as ComboDetailType)
        }
        setLoading(false)
      })
    } else {
      setDetail(null)
    }
  }, [comboId, open])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        {loading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
            </div>
          </div>
        ) : detail ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-500" />
                {detail.name}
              </DialogTitle>
            </DialogHeader>

            {/* Combo Image & Info */}
            <div className="flex flex-col sm:flex-row gap-4">
              {detail.image && (
                <div className="relative w-full sm:w-48 aspect-[4/3] rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                  <Image
                    src={detail.image}
                    alt={detail.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 space-y-2">
                {detail.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{detail.description}</p>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                    {formatPrice(detail.total_price)}
                  </span>
                  {detail.is_event_combo && (
                    <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
                      🎉 Combo sự kiện
                    </Badge>
                  )}
                  <Badge variant={detail.is_active ? "default" : "secondary"}>
                    {detail.is_active ? "Đang bán" : "Ngưng bán"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Combo Items */}
            {detail.combo_items && detail.combo_items.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold text-base flex items-center gap-2 mb-3">
                    <UtensilsCrossed className="w-4 h-4 text-orange-500" />
                    Thành phần combo ({detail.combo_items.length} món)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {detail.combo_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      >
                        {item.menu_item.image && (
                          <div className="relative w-14 h-14 rounded-md overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-600">
                            <Image
                              src={item.menu_item.image}
                              alt={item.menu_item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.menu_item.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            SL: {item.quantity} × {formatPrice(item.unit_price)}
                          </p>
                          <Badge variant="outline" className="text-[10px] mt-1">
                            {item.menu_item.item_type === "FOOD" ? "🍿 Đồ ăn" : item.menu_item.item_type === "DRINK" ? "🥤 Đồ uống" : "🎁 Quà tặng"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Associated Movies */}
            {detail.combo_movies && detail.combo_movies.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold text-base flex items-center gap-2 mb-3">
                    <Film className="w-4 h-4 text-orange-500" />
                    Phim áp dụng ({detail.combo_movies.length})
                  </h3>
                  <div className="space-y-2">
                    {detail.combo_movies.map((cm) => (
                      <div
                        key={cm.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      >
                        {cm.movie.image && (
                          <div className="relative w-10 h-14 rounded overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-600">
                            <Image
                              src={cm.movie.image}
                              alt={cm.movie.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{cm.movie.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {cm.movie.director} • {cm.movie.duration} phút
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Associated Events */}
            {detail.combos_events && detail.combos_events.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold text-base flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    Sự kiện áp dụng ({detail.combos_events.length})
                  </h3>
                  <div className="space-y-2">
                    {detail.combos_events.map((ce) => (
                      <div
                        key={ce.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      >
                        {ce.event.image && (
                          <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-600">
                            <Image
                              src={ce.event.image}
                              alt={ce.event.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{ce.event.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(ce.event.start_date)} - {formatDate(ce.event.end_date)}
                          </p>
                          {ce.event.discount && (
                            <Badge className="mt-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-0 text-[10px]">
                              <Tag className="w-3 h-3 mr-1" />
                              Giảm {ce.event.discount.discount_percent}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="py-8 text-center text-gray-500">Không tìm thấy thông tin combo</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
