"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ComboType } from "@/types/combo.type"
import { Eye, UtensilsCrossed } from "lucide-react"

interface ComboCardProps {
  combo: ComboType
  onViewDetail: (id: string) => void
}

export function ComboCard({ combo, onViewDetail }: ComboCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
        {combo.image ? (
          <Image
            src={combo.image}
            alt={combo.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UtensilsCrossed className="w-16 h-16 text-gray-300 dark:text-gray-600" />
          </div>
        )}

        {/* Event badge */}
        {combo.is_event_combo && (
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            🎉 Combo sự kiện
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-1 mb-1">
          {combo.name}
        </h3>

        {combo.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">
            {combo.description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
          <span className="text-lg font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
            {formatPrice(combo.total_price)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => combo.id && onViewDetail(combo.id)}
            className="gap-1.5 border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-950"
          >
            <Eye className="w-4 h-4" />
            Chi tiết
          </Button>
        </div>
      </div>
    </div>
  )
}
