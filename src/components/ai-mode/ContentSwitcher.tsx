"use client"

import { cn } from "@/lib/utils"
import {
  Film,
  Clock,
  DollarSign,
  Calendar,
  Package,
  UtensilsCrossed,
  Armchair,
} from "lucide-react"

export type ContentViewType =
  | "movies"
  | "showTimes"
  | "seats"
  | "ticketPrices"
  | "events"
  | "combos"
  | "menuItems"

interface ContentSwitcherProps {
  activeView: ContentViewType
  onViewChange: (view: ContentViewType) => void
}

const viewButtons: { id: ContentViewType; label: string; icon: React.ElementType }[] = [
  { id: "movies", label: "Phim", icon: Film },
  { id: "showTimes", label: "Suất chiếu", icon: Clock },
  { id: "seats", label: "Sơ đồ ghế", icon: Armchair },
  { id: "ticketPrices", label: "Giá vé", icon: DollarSign },
  { id: "events", label: "Sự kiện", icon: Calendar },
  { id: "combos", label: "Combo", icon: Package },
  { id: "menuItems", label: "Đồ ăn", icon: UtensilsCrossed },
]

export function ContentSwitcher({ activeView, onViewChange }: ContentSwitcherProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-2">
      {viewButtons.map((btn) => {
        const Icon = btn.icon
        const isActive = activeView === btn.id
        return (
          <button
            key={btn.id}
            onClick={() => onViewChange(btn.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
              isActive
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                : "text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{btn.label}</span>
          </button>
        )
      })}
    </div>
  )
}
