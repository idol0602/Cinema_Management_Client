import { comboService } from "@/services/combo.service"
import { ComboList } from "@/components/combos/ComboList"
import type { ComboType } from "@/types/combo.type"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Combo Ưu Đãi",
  description: "Khám phá những combo ưu đãi hấp dẫn tại Meta Cinema",
}

export default async function CombosPage() {
  const response = await comboService.findAndPaginate({
    page: 1,
    limit: 10,
    filter: { is_active: "true" },
  })

  const initialCombos = Array.isArray(response.data) ? (response.data as ComboType[]) : []

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8">
      <ComboList initialCombos={initialCombos} />
    </main>
  )
}
