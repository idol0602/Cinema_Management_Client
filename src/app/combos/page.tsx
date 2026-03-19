import { comboService } from '@/services/combo.service';
import { menuItemService } from '@/services/menuItem.service';
import { CombosPageClient } from '@/components/combos/CombosPageClient';
import type { ComboType } from '@/types/combo.type';
import type { MenuItemType } from '@/types/menuItem.type';
import type { PaginationMeta } from '@/types/pagination.type';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Combos & Đồ Ăn',
  description: 'Khám phá những combo ưu đãi và đồ ăn nước uống hấp dẫn tại Meta Cinema',
};

export default async function CombosPage() {
  const [comboResponse, menuItemResponse] = await Promise.all([
    comboService.findAndPaginate({
      page: 1,
      limit: 10,
      filter: { is_active: 'true' },
    }),
    menuItemService.findAndPaginate({
      page: 1,
      limit: 10,
      filter: { is_active: 'true' },
    }),
  ]);

  const initialCombos = Array.isArray(comboResponse.data)
    ? (comboResponse.data as ComboType[])
    : [];
  const metaCombos: PaginationMeta = comboResponse.meta || {
    totalItems: 0,
    itemsPerPage: 0,
    totalPages: 0,
    currentPage: 0,
  };

  const initialMenuItems = Array.isArray(menuItemResponse.data)
    ? (menuItemResponse.data as MenuItemType[])
    : [];
  const metaMenuItems = menuItemResponse.meta || {
    totalItems: 0,
    itemsPerPage: 0,
    totalPages: 0,
    currentPage: 0,
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-8 dark:bg-gray-900">
      <CombosPageClient
        initialCombos={initialCombos}
        metaCombos={metaCombos}
        initialMenuItems={initialMenuItems}
        metaMenuItems={metaMenuItems}
      />
    </main>
  );
}
