import { comboService } from "@/services/combo.service"
import { menuItemService } from "@/services/menuItem.service"
import { CombosPageClient } from "@/components/combos/CombosPageClient"
import type { ComboType } from "@/types/combo.type"
import type { MenuItemType } from "@/types/menuItem.type"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Combos & Đồ Ăn",
  description: "Khám phá những combo ưu đãi và đồ ăn nước uống hấp dẫn tại Meta Cinema",
}

export default async function CombosPage() {
  const [comboResponse, menuItemResponse] = await Promise.all([
    comboService.findAndPaginate({
      page: 1,
      limit: 10,
      filter: { is_active: "true" },
    }),
    menuItemService.findAndPaginate({
      page: 1,
      limit: 10,
      filter: { is_active: "true" },
    }),
  ])

  const initialCombos = Array.isArray(comboResponse.data) ? (comboResponse.data as ComboType[]) : []
  const initialMenuItems = Array.isArray(menuItemResponse.data) ? (menuItemResponse.data as MenuItemType[]) : []

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8">
      <CombosPageClient initialCombos={initialCombos} initialMenuItems={initialMenuItems} />
    </main>
  )
}
