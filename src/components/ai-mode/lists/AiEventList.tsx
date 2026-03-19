'use client';

import React, { useState, useEffect } from 'react';
import { useAiEvents } from '@/hooks/ai-mode/useAiEvents';
import { eventPaginateConfig } from '@/config/paginate/event.config';
import { EventCard } from '@/components/events/EventCard';
import { EventDetailDialog } from '@/components/events/EventDetailDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { EventType } from '@/types/event.type';
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

interface EventListProps {
  initialEvents?: EventType[];
  initialMeta?: PaginationMeta;
  disableFetch?: boolean;
}

export function AiEventList({ initialEvents = [], initialMeta, disableFetch }: EventListProps) {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchColumn, setSearchColumn] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [orderColumn, setOrderColumn] = useState('');
  const [statusColumn, setStatusColumn] = useState('');
  const [counterColumn, setCounterColumn] = useState('');
  const [inComboColumn, setInComboColumn] = useState('');

  // Event detail dialog state
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const useAiDataOnly =
    !!disableFetch &&
    page === 1 &&
    !searchQuery &&
    !searchColumn &&
    !sortColumn &&
    !orderColumn &&
    !statusColumn &&
    !counterColumn &&
    !inComboColumn;

  const handleViewDetail = (event: EventType) => {
    setSelectedEvent(event);
    setDetailDialogOpen(true);
  };

  const buildFilter = () => {
    const filter: Record<string, any> = { is_active: 'true' };
    if (statusColumn) filter.is_active = statusColumn;
    if (counterColumn) filter.only_at_counter = counterColumn;
    if (inComboColumn) filter.is_in_combo = inComboColumn;
    return filter;
  };

  const buildSortBy = () => {
    if (sortColumn && orderColumn) return `${sortColumn}:${orderColumn}`;
    if (sortColumn) return `${sortColumn}:DESC`;
    return eventPaginateConfig.defaultSortBy[0][0] + ':' + eventPaginateConfig.defaultSortBy[0][1];
  };

  const { data: _eventsResponse, isLoading } = useAiEvents({
    page,
    limit: eventPaginateConfig.defaultLimit,
    search: searchQuery || undefined,
    searchBy: searchColumn || undefined,
    sortBy: buildSortBy(),
    filter: buildFilter(),
    initialData:
      page === 1 && !searchQuery && !statusColumn && !counterColumn && !inComboColumn
        ? initialEvents
        : undefined,
    initialMeta:
      page === 1 && !searchQuery && !statusColumn && !counterColumn && !inComboColumn
        ? initialMeta
        : undefined,
    enabled: !useAiDataOnly,
  });

  const eventsResponse =
    useAiDataOnly && initialEvents
      ? ({
          data: initialEvents,
          meta: initialMeta || {
            totalItems: initialEvents.length,
            currentPage: 1,
            totalPages: 1,
            itemsPerPage: initialEvents.length,
          },
        } as any)
      : _eventsResponse;

  const events = eventsResponse?.data || [];
  const meta = eventsResponse?.meta;

  const handleSearch = () => setPage(1);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  useEffect(() => {
    setPage(1);
  }, [
    statusColumn,
    counterColumn,
    inComboColumn,
    sortColumn,
    orderColumn,
    searchColumn,
    searchQuery,
  ]);

  const handleClearFilter = (filterType: string) => {
    if (filterType === 'status') setStatusColumn('');
    if (filterType === 'counter') setCounterColumn('');
    if (filterType === 'inCombo') setInComboColumn('');
    if (filterType === 'sort') {
      setSortColumn('');
      setOrderColumn('');
    }
    if (filterType === 'search') {
      setSearchQuery('');
      setSearchColumn('');
    }
  };

  return (
    <section className="bg-gray-50 py-16 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              Sự Kiện Nổi Bật
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Cập nhật những sự kiện và khuyến mãi mới nhất
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-7">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Tìm kiếm sự kiện..."
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
                {eventPaginateConfig.searchableColumns.map((col) => (
                  <SelectItem key={col.value} value={col.value}>
                    {col.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Only At Counter Filter */}
            <Select
              value={counterColumn || 'ALL'}
              onValueChange={(val) => setCounterColumn(val === 'ALL' ? '' : val)}
            >
              <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Hình thức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                {eventPaginateConfig.filterableColumns.only_at_counter.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* In Combo Filter */}
            <Select
              value={inComboColumn || 'ALL'}
              onValueChange={(val) => setInComboColumn(val === 'ALL' ? '' : val)}
            >
              <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Combo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                {eventPaginateConfig.filterableColumns.is_in_combo.map((opt) => (
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
                {eventPaginateConfig.sortableColumns.map((col) => (
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
          {(searchQuery || searchColumn || counterColumn || inComboColumn || sortColumn) && (
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
              {counterColumn && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleClearFilter('counter')}
                  className="h-7 text-xs"
                >
                  {
                    eventPaginateConfig.filterableColumns.only_at_counter.find(
                      (o) => o.value === counterColumn
                    )?.label
                  }{' '}
                  ×
                </Button>
              )}
              {inComboColumn && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleClearFilter('inCombo')}
                  className="h-7 text-xs"
                >
                  {
                    eventPaginateConfig.filterableColumns.is_in_combo.find(
                      (o) => o.value === inComboColumn
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
                  {eventPaginateConfig.sortableColumns.find((c) => c.value === sortColumn)?.label}{' '}
                  {orderColumn === 'ASC' ? '↑' : '↓'} ×
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[16/9] w-full rounded-lg" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event: EventType) => (
                <EventCard key={event.id} event={event} onViewDetail={handleViewDetail} />
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Hiển thị {(meta.currentPage - 1) * meta.itemsPerPage + 1} -{' '}
                  {Math.min(meta.currentPage * meta.itemsPerPage, meta.totalItems)} của{' '}
                  {meta.totalItems} sự kiện
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
              Không tìm thấy sự kiện nào
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Thử thay đổi bộ lọc hoặc tìm kiếm khác
            </p>
          </div>
        )}
      </div>

      {/* Event Detail Dialog */}
      <EventDetailDialog
        event={selectedEvent}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />
    </section>
  );
}
