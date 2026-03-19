'use client';

import React, { useState, useEffect } from 'react';
import { useAiTicketPrices } from '@/hooks/ai-mode/useAiTicketPrices';
import { ticketPricePaginateConfig } from '@/config/paginate/ticket_price.config';
import { TicketPriceCard } from '@/components/ticketPrices/TicketPriceCard';
import { Button } from '@/components/ui/button';
import type { TicketPriceType } from '@/types/ticketPrice.type';
import type { FormatType } from '@/types/format.type';
import type { SeatTypeDetailType } from '@/types/seatTypeDetail.type';
import type { PaginationMeta } from '@/types/pagination.type';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, SlidersHorizontal, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface TicketPriceListProps {
  initialTicketPrices?: TicketPriceType[];
  initialMeta?: PaginationMeta;
  formats: FormatType[];
  seatTypes: SeatTypeDetailType[];
  disableFetch?: boolean;
}

export function AiTicketPriceList({
  initialTicketPrices = [],
  initialMeta,
  formats,
  seatTypes,
  disableFetch,
}: TicketPriceListProps) {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchColumn, setSearchColumn] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [orderColumn, setOrderColumn] = useState('');
  const [dayTypeColumn, setDayTypeColumn] = useState('');
  const [seatTypeIdColumn, setSeatTypeIdColumn] = useState('');
  const [formatIdColumn, setFormatIdColumn] = useState('');

  const useAiDataOnly =
    !!disableFetch &&
    page === 1 &&
    !searchQuery &&
    !searchColumn &&
    !sortColumn &&
    !orderColumn &&
    !dayTypeColumn &&
    !seatTypeIdColumn &&
    !formatIdColumn;

  const buildFilter = () => {
    const filter: Record<string, any> = {};
    if (dayTypeColumn) filter.day_type = dayTypeColumn;
    if (seatTypeIdColumn) filter.seat_type_id = seatTypeIdColumn;
    if (formatIdColumn) filter.format_id = formatIdColumn;
    return filter;
  };

  const buildSortBy = () => {
    if (sortColumn && orderColumn) return `${sortColumn}:${orderColumn}`;
    if (sortColumn) return `${sortColumn}:DESC`;
    return (
      ticketPricePaginateConfig.defaultSortBy[0] + ':' + ticketPricePaginateConfig.defaultSortBy[1]
    );
  };

  const { data: _ticketPricesResponse, isLoading } = useAiTicketPrices({
    page,
    limit: ticketPricePaginateConfig.defaultLimit,
    search: searchQuery || undefined,
    searchBy: searchColumn || undefined,
    sortBy: buildSortBy(),
    filter: buildFilter(),
    initialData:
      page === 1 && !searchQuery && !dayTypeColumn && !seatTypeIdColumn && !formatIdColumn
        ? initialTicketPrices
        : undefined,
    initialMeta:
      page === 1 && !searchQuery && !dayTypeColumn && !seatTypeIdColumn && !formatIdColumn
        ? initialMeta
        : undefined,
    enabled: !useAiDataOnly,
  });

  const ticketPricesResponse =
    useAiDataOnly && initialTicketPrices
      ? ({
          data: initialTicketPrices,
          meta: initialMeta || {
            totalItems: initialTicketPrices.length,
            currentPage: 1,
            totalPages: 1,
            itemsPerPage: initialTicketPrices.length,
          },
        } as any)
      : _ticketPricesResponse;

  const ticketPrices = ticketPricesResponse?.data || [];
  const meta = ticketPricesResponse?.meta;

  const getFormatName = (formatId: string) => {
    const format = formats.find((f) => f.id === formatId);
    return format ? format.name : formatId;
  };

  const getSeatTypeName = (seatTypeId: string) => {
    const seatType = seatTypes.find((s) => s.id === seatTypeId);
    return seatType ? seatType.name : seatTypeId;
  };

  useEffect(() => {
    setPage(1);
  }, [
    dayTypeColumn,
    seatTypeIdColumn,
    formatIdColumn,
    sortColumn,
    orderColumn,
    searchColumn,
    searchQuery,
  ]);

  const handleClearFilter = (filterType: string) => {
    if (filterType === 'dayType') setDayTypeColumn('');
    if (filterType === 'seatType') setSeatTypeIdColumn('');
    if (filterType === 'format') setFormatIdColumn('');
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
    <div>
      {/* Filters */}
      <div className="mb-10 rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {/* Day Type Filter */}
          <Select
            value={dayTypeColumn || 'ALL'}
            onValueChange={(val) => setDayTypeColumn(val === 'ALL' ? '' : val)}
          >
            <SelectTrigger className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Loại ngày" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả</SelectItem>
              {ticketPricePaginateConfig.filterableColumns.day_type.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Format Filter */}
          <Select
            value={formatIdColumn || 'ALL'}
            onValueChange={(val) => setFormatIdColumn(val === 'ALL' ? '' : val)}
          >
            <SelectTrigger className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600">
              <SelectValue placeholder="Định dạng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả</SelectItem>
              {formats.map((f) => (
                <SelectItem key={f.id} value={f.id!}>
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Seat Type Filter */}
          <Select
            value={seatTypeIdColumn || 'ALL'}
            onValueChange={(val) => setSeatTypeIdColumn(val === 'ALL' ? '' : val)}
          >
            <SelectTrigger className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600">
              <SelectValue placeholder="Loại ghế" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả</SelectItem>
              {seatTypes.map((s) => (
                <SelectItem key={s.id} value={s.id!}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select
            value={sortColumn || 'DEFAULT'}
            onValueChange={(val) => setSortColumn(val === 'DEFAULT' ? '' : val)}
          >
            <SelectTrigger className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DEFAULT">Mặc định</SelectItem>
              {ticketPricePaginateConfig.sortableColumns.map((col) => (
                <SelectItem key={col.value} value={col.value}>
                  {col.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Order Filter (ASC/DESC) */}
          <Select
            value={orderColumn || 'DESC'}
            onValueChange={(val) => setOrderColumn(val)}
            disabled={!sortColumn}
          >
            <SelectTrigger className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 disabled:opacity-50 dark:border-gray-600">
              <SelectValue placeholder="Thứ tự" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DESC">Giảm dần ↓</SelectItem>
              <SelectItem value="ASC">Tăng dần ↑</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {(searchQuery || dayTypeColumn || seatTypeIdColumn || formatIdColumn || sortColumn) && (
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
            {dayTypeColumn && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleClearFilter('dayType')}
                className="h-7 text-xs"
              >
                {
                  ticketPricePaginateConfig.filterableColumns.day_type.find(
                    (o) => o.value === dayTypeColumn
                  )?.label
                }{' '}
                ×
              </Button>
            )}
            {formatIdColumn && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleClearFilter('format')}
                className="h-7 text-xs"
              >
                {formats.find((f) => f.id === formatIdColumn)?.name || 'Định dạng'} ×
              </Button>
            )}
            {seatTypeIdColumn && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleClearFilter('seatType')}
                className="h-7 text-xs"
              >
                {seatTypes.find((s) => s.id === seatTypeIdColumn)?.name || 'Loại ghế'} ×
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
                {
                  ticketPricePaginateConfig.sortableColumns.find((c) => c.value === sortColumn)
                    ?.label
                }{' '}
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
            <div
              key={i}
              className="space-y-3 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700"
            >
              <Skeleton className="h-14 w-full" />
              <div className="space-y-3 p-5">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <Skeleton className="h-px w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : ticketPrices && ticketPrices.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ticketPrices.map((item: TicketPriceType) => (
              <TicketPriceCard
                key={item.id}
                item={item}
                formatName={getFormatName(item.format_id)}
                seatTypeName={getSeatTypeName(item.seat_type_id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Hiển thị {(meta.currentPage - 1) * meta.itemsPerPage + 1} -{' '}
                {Math.min(meta.currentPage * meta.itemsPerPage, meta.totalItems)} của{' '}
                {meta.totalItems} giá vé
              </div>

              <div className="mb-3 flex items-center gap-2">
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
                              ? 'min-w-10 bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                              : 'min-w-10 hover:bg-emerald-50 dark:hover:bg-emerald-950'
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
          <DollarSign className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300">
            Không tìm thấy giá vé nào
          </h3>
          <p className="text-gray-500 dark:text-gray-400">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
        </div>
      )}
    </div>
  );
}
