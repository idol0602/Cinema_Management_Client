"use client"

import { Badge } from "@/components/ui/badge"
import type { TicketPriceType } from "@/types/ticketPrice.type"
import { DollarSign, Calendar, Armchair, Film } from "lucide-react"

interface TicketPriceCardProps {
  item: TicketPriceType
  formatName: string
  seatTypeName: string
}

const dayTypeConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  WEEKDAY: {
    label: "Ngày thường",
    color: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  WEEKEND: {
    label: "Cuối tuần",
    color: "text-orange-700 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
  },
}

export function TicketPriceCard({ item, formatName, seatTypeName }: TicketPriceCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const dayConfig = dayTypeConfig[item.day_type] || dayTypeConfig.WEEKDAY

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header stripe */}
      <div className={`px-5 py-3 ${item.day_type === "WEEKEND" ? "bg-gradient-to-r from-orange-500 to-amber-500" : "bg-gradient-to-r from-emerald-500 to-teal-500"}`}>
        <div className="flex items-center justify-between">
          <Badge className={`${dayConfig.bgColor} ${dayConfig.color} border-0 shadow-sm`}>
            <Calendar className="w-3 h-3 mr-1" />
            {dayConfig.label}
          </Badge>
          <DollarSign className="w-5 h-5 text-white/80" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Format */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <Film className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Định dạng</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatName}</p>
          </div>
        </div>

        {/* Seat Type */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
            <Armchair className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Loại ghế</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{seatTypeName}</p>
          </div>
        </div>

        {/* Price */}
        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Giá vé</span>
            <span className={`text-xl font-bold bg-gradient-to-r ${item.day_type === "WEEKEND" ? "from-orange-500 to-amber-500" : "from-emerald-500 to-teal-500"} bg-clip-text text-transparent`}>
              {formatPrice(item.price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
