'use client';

import { useState } from 'react';
import { ComboList } from './ComboList';
import { MenuItemList } from '@/components/menuItems/MenuItemList';
import type { ComboType } from '@/types/combo.type';
import type { MenuItemType } from '@/types/menuItem.type';
import type { PaginationMeta } from '@/types/pagination.type';
import { UtensilsCrossed, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CombosPageClientProps {
  initialCombos: ComboType[];
  metaCombos: PaginationMeta;
  initialMenuItems: MenuItemType[];
  metaMenuItems: PaginationMeta;
}

type TabType = 'combos' | 'menuItems';

export function CombosPageClient({
  initialCombos,
  metaCombos,
  initialMenuItems,
  metaMenuItems,
}: CombosPageClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('combos');

  const tabs = [
    {
      id: 'combos' as TabType,
      label: 'Combo',
      icon: Package,
    },
    {
      id: 'menuItems' as TabType,
      label: 'Đồ ăn & Nước uống',
      icon: UtensilsCrossed,
    },
  ];

  return (
    <div className="container mx-auto px-4">
      {/* Tab Header */}
      <div className="mb-8 flex items-center justify-center">
        <div className="inline-flex max-w-full flex-wrap justify-center gap-1 rounded-xl border border-gray-200 bg-white p-1.5 shadow-md dark:border-gray-700 dark:bg-gray-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 sm:px-6 sm:py-2.5',
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600 dark:text-gray-400 dark:hover:bg-orange-950/30 dark:hover:text-orange-400'
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300">
        {activeTab === 'combos' && (
          <ComboList initialCombos={initialCombos} metaCombos={metaCombos} />
        )}
        {activeTab === 'menuItems' && (
          <MenuItemList initialMenuItems={initialMenuItems} metaMenuItems={metaMenuItems} />
        )}
      </div>
    </div>
  );
}
