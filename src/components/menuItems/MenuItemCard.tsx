"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import type { MenuItemType } from "@/types/menuItem.type"
import { UtensilsCrossed, Coffee, Gift } from "lucide-react"

interface MenuItemCardProps {
  item: MenuItemType
}

const itemTypeConfig: Record<string, { label: string; icon: React.ElementType; gradient: string; badge: string }> = {
  FOOD: {
    label: "Đồ ăn",
    icon: UtensilsCrossed,
    gradient: "from-orange-500 to-amber-500",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  },
  DRINK: {
    label: "Nước uống",
    icon: Coffee,
    gradient: "from-blue-500 to-cyan-500",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  GIFT: {
    label: "Quà tặng",
    icon: Gift,
    gradient: "from-purple-500 to-pink-500",
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const config = itemTypeConfig[item.item_type] || itemTypeConfig.FOOD
  const Icon = config.icon

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon className="w-16 h-16 text-gray-300 dark:text-gray-600" />
          </div>
        )}

        {/* Type badge */}
        <Badge className={`absolute top-3 left-3 ${config.badge} border-0 shadow-lg`}>
          <Icon className="w-3 h-3 mr-1" />
          {config.label}
        </Badge>

        {/* Out of stock overlay */}
        {item.num_instock !== undefined && item.num_instock <= 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg bg-red-600 px-4 py-1 rounded-full">
              Hết hàng
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-1 mb-1">
          {item.name}
        </h3>

        {item.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">
            {item.description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
          <span className={`text-lg font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
            {formatPrice(item.price)}
          </span>
        </div>
      </div>
    </div>
  )
}
