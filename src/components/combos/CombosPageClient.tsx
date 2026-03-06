"use client"

import { useState } from "react"
import { ComboList } from "./ComboList"
import { MenuItemList } from "@/components/menuItems/MenuItemList"
import type { ComboType } from "@/types/combo.type"
import type { MenuItemType } from "@/types/menuItem.type"
import { UtensilsCrossed, Package } from "lucide-react"
import { cn } from "@/lib/utils"

interface CombosPageClientProps {
  initialCombos: ComboType[]
  initialMenuItems: MenuItemType[]
}

type TabType = "combos" | "menuItems"

export function CombosPageClient({ initialCombos, initialMenuItems }: CombosPageClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("combos")

  const tabs = [
    {
      id: "combos" as TabType,
      label: "Combo",
      icon: Package,
    },
    {
      id: "menuItems" as TabType,
      label: "Đồ ăn & Nước uống",
      icon: UtensilsCrossed,
    },
  ]

  return (
    <div className="container mx-auto px-4">
      {/* Tab Header */}
      <div className="flex items-center justify-center mb-8">
        <div className="inline-flex bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-300",
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                    : "text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300">
        {activeTab === "combos" && <ComboList initialCombos={initialCombos} />}
        {activeTab === "menuItems" && <MenuItemList initialMenuItems={initialMenuItems} />}
      </div>
    </div>
  )
}
