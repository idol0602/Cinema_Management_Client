'use client';

import React, { useState, useEffect } from 'react';
import { useAiCombos } from '@/hooks/ai-mode/useAiCombos';
import { comboPaginateConfig } from '@/config/paginate/combo.config';
import { ComboCard } from '@/components/combos/ComboCard';
import { ComboDetailDialog } from '@/components/combos/ComboDetailDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ComboType } from '@/types/combo.type';
import type { PaginationMeta } from '@/types/pagination.type';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ComboListProps {
  initialCombos?: ComboType[];
  initialMeta?: PaginationMeta;
  disableFetch?: boolean;
}

export function AiComboList({ initialCombos = [], initialMeta, disableFetch }: ComboListProps) {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchColumn, setSearchColumn] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [orderColumn, setOrderColumn] = useState('');
  const [statusColumn, setStatusColumn] = useState('');
  const [eventComboColumn, setEventComboColumn] = useState('');

  // Detail dialog state
  const [selectedComboId, setSelectedComboId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const useAiDataOnly =
    !!disableFetch &&
    page === 1 &&
    !searchQuery &&
    !searchColumn &&
    !sortColumn &&
    !orderColumn &&
    !statusColumn &&
    !eventComboColumn;

  const buildFilter = () => {
    const filter: Record<string, any> = { is_active: 'true' };
    if (statusColumn) filter.is_active = statusColumn;
    if (eventComboColumn) filter.is_event_combo = eventComboColumn;
    return filter;
  };

  const buildSortBy = () => {
    if (sortColumn && orderColumn) return `${sortColumn}:${orderColumn}`;
    if (sortColumn) return `${sortColumn}:DESC`;
    return comboPaginateConfig.defaultSortBy[0][0] + ':' + comboPaginateConfig.defaultSortBy[0][1];
  };

  const { data: _combosResponse, isLoading } = useAiCombos({
    page,
    limit: comboPaginateConfig.defaultLimit,
    search: searchQuery || undefined,
    searchBy: searchColumn || undefined,
    sortBy: buildSortBy(),
    filter: buildFilter(),
    initialData:
      page === 1 && !searchQuery && !statusColumn && !eventComboColumn ? initialCombos : undefined,
    enabled: !useAiDataOnly,
  });

  const combosResponse =
    useAiDataOnly && initialCombos
      ? ({
          data: initialCombos,
          meta: initialMeta || {
            totalItems: initialCombos.length,
            currentPage: 1,
            totalPages: 1,
            itemsPerPage: initialCombos.length,
          },
        } as any)
      : _combosResponse;

  const combos = combosResponse?.data || [];
  const meta = combosResponse?.meta;

  const handleSearch = () => setPage(1);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  useEffect(() => {
    setPage(1);
  }, [statusColumn, eventComboColumn, sortColumn, orderColumn, searchColumn, searchQuery]);

  const handleClearFilter = (filterType: string) => {
    if (filterType === 'status') setStatusColumn('');
    if (filterType === 'eventCombo') setEventComboColumn('');
    if (filterType === 'sort') {
      setSortColumn('');
      setOrderColumn('');
    }
    if (filterType === 'search') {
      setSearchQuery('');
      setSearchColumn('');
    }
  };

  const handleViewDetail = (id: string) => {
    setSelectedComboId(id);
    setDetailOpen(true);
  };

  return (
    <section className="bg-gray-50 py-16 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              Combo Ưu Đãi
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Những combo hấp dẫn dành riêng cho bạn
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Tìm kiếm combo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="border-gray-300 pl-10 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600"
              />
            </div>

            {/* Search By */}
            <Select
              value={searchColumn || 'ALL'}
              onValueChange={(val) => setSearchColumn(val === 'ALL' ? '' : val)}
            >
              <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600">
                <SelectValue placeholder="Tìm theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                {comboPaginateConfig.searchableColumns.map((col) => (
                  <SelectItem key={col.value} value={col.value}>
                    {col.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Event Combo Filter */}
            <Select
              value={eventComboColumn || 'ALL'}
              onValueChange={(val) => setEventComboColumn(val === 'ALL' ? '' : val)}
            >
              <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Loại combo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                {comboPaginateConfig.filterableColumns.is_event_combo.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select
              value={sortColumn || 'DEFAULT'}
              onValueChange={(val) => setSortColumn(val === 'DEFAULT' ? '' : val)}
            >
              <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEFAULT">Mặc định</SelectItem>
                {comboPaginateConfig.sortableColumns.map((col) => (
                  <SelectItem key={col.value} value={col.value}>
                    {col.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Order */}
            <Select value={orderColumn} onValueChange={setOrderColumn} disabled={!sortColumn}>
              <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600">
                <SelectValue placeholder="Thứ tự" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASC">Tăng dần</SelectItem>
                <SelectItem value="DESC">Giảm dần</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || searchColumn || eventComboColumn || sortColumn) && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
              <span className="mr-2 text-sm text-gray-600 dark:text-gray-400">
                Bộ lọc đang áp dụng:
              </span>
              {searchQuery && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleClearFilter('search')}
                  className="h-7 text-xs"
                >
                  Tìm: &quot;{searchQuery}&quot; ×
                </Button>
              )}
              {eventComboColumn && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleClearFilter('eventCombo')}
                  className="h-7 text-xs"
                >
                  {
                    comboPaginateConfig.filterableColumns.is_event_combo.find(
                      (o) => o.value === eventComboColumn
                    )?.label
                  }{' '}
                  ×
                </Button>
              )}
              {sortColumn && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleClearFilter('sort')}
                  className="h-7 text-xs"
                >
                  Sắp xếp:{' '}
                  {comboPaginateConfig.sortableColumns.find((c) => c.value === sortColumn)?.label}{' '}
                  {orderColumn === 'ASC' ? '↑' : '↓'} ×
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : combos && combos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {combos.map((combo) => (
                <ComboCard key={combo.id} combo={combo} onViewDetail={handleViewDetail} />
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Hiển thị {(meta.currentPage - 1) * meta.itemsPerPage + 1} -{' '}
                  {Math.min(meta.currentPage * meta.itemsPerPage, meta.totalItems)} của{' '}
                  {meta.totalItems} combo
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Trước
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === meta.totalPages || Math.abs(p - page) <= 1)
                      .map((p, index, array) => (
                        <div key={p} className="flex items-center">
                          {index > 0 && array[index - 1] !== p - 1 && (
                            <span className="px-2 text-gray-400">...</span>
                          )}
                          <Button
                            variant={page === p ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPage(p)}
                            className={
                              page === p
                                ? 'min-w-10 bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                                : 'min-w-10 hover:bg-orange-50 dark:hover:bg-orange-950'
                            }
                          >
                            {p}
                          </Button>
                        </div>
                      ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.min(meta.totalPages, prev + 1))}
                    disabled={page === meta.totalPages}
                    className="gap-1"
                  >
                    Sau
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-16 text-center">
            <Filter className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300">
              Không tìm thấy combo nào
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Thử thay đổi bộ lọc hoặc tìm kiếm khác
            </p>
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <ComboDetailDialog comboId={selectedComboId} open={detailOpen} onOpenChange={setDetailOpen} />
    </section>
  );
}
