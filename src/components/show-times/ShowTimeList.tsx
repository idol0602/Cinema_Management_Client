'use client';

import { useState, useEffect, useMemo } from 'react';
import { useShowTimes } from '@/hooks/useShowTimes';
import { useRooms } from '@/hooks/useRooms';
import { showTimePaginateConfig } from '@/config/paginate/show_time.config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Film,
  Clock,
  Calendar,
  MapPin,
  Ticket,
  Monitor,
  ArrowUpDown,
} from 'lucide-react';
import type { ShowTimeType } from '@/types/showTime.type';

import Link from 'next/link';

interface ShowTimeListProps {
  initialShowTimes?: ShowTimeType[];
  metaShowTimes?: PaginationMeta;
  movieId?: string;
}

export function ShowTimeList({
  initialShowTimes = [],
  metaShowTimes = {
    totalItems: 0,
    itemsPerPage: 0,
    totalPages: 0,
    currentPage: 0,
  },
  movieId,
}: ShowTimeListProps) {
  const [page, setPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('');
  const [orderColumn, setOrderColumn] = useState('');
  const [dayTypeFilter, setDayTypeFilter] = useState('');
  const [roomFilter, setRoomFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const defaultStartTimeIso = useMemo(() => new Date().toISOString(), []);

  // Fetch rooms for filter
  const { data: rooms } = useRooms();

  // Build filter object
  const buildFilter = () => {
    const filter: Record<string, any> = { is_active: true };
    if (movieId) {
      filter.movie_id = movieId;
    }
    if (dayTypeFilter) {
      filter.day_type = dayTypeFilter;
    }
    if (roomFilter) {
      filter.room_id = roomFilter;
    }
    if (startDate) {
      filter.start_time = filter.start_time || {};
      filter.start_time.$gte = `${startDate}T00:00:00Z`;
    } else {
      filter.start_time = filter.start_time || {};
      filter.start_time.$gte = defaultStartTimeIso;
    }
    if (endDate) {
      filter.end_time = filter.end_time || {};
      filter.end_time.$lte = `${endDate}T23:59:00Z`;
    }

    return filter;
  };

  // Build sortBy string
  const buildSortBy = () => {
    if (sortColumn && orderColumn) {
      return `${sortColumn}:${orderColumn}`;
    } else if (sortColumn) {
      return `${sortColumn}:DESC`;
    }
    return 'start_time:ASC';
  };

  const { data: _response, isLoading } = useShowTimes({
    page,
    limit: showTimePaginateConfig.defaultLimit,
    sortBy: buildSortBy(),
    filter: buildFilter(),
    initialData:
      page === 1 && !movieId && !dayTypeFilter && !roomFilter && !startDate && !endDate
        ? initialShowTimes
        : undefined,
    metaData: metaShowTimes,
  });

  const response = _response;

  const showTimes: ShowTimeType[] = (response?.data || initialShowTimes || []) as ShowTimeType[];
  const meta = response?.meta || metaShowTimes;

  // Auto-search when filters change
  useEffect(() => {
    setPage(1);
  }, [movieId, sortColumn, orderColumn, dayTypeFilter, roomFilter, startDate, endDate]);

  const handleClearFilter = (filterType: string) => {
    if (filterType === 'sort') {
      setSortColumn('');
      setOrderColumn('');
    }
    if (filterType === 'dayType') {
      setDayTypeFilter('');
    }
    if (filterType === 'room') {
      setRoomFilter('');
    }
    if (filterType === 'date') {
      setStartDate('');
      setEndDate('');
    }
  };

  // Format datetime
  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString('vi-VN', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      time: d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const getDayTypeBadge = (dayType?: string) => {
    if (!dayType) return <Badge variant="outline">N/A</Badge>;
    if (dayType.toLowerCase() === 'weekend') {
      return (
        <Badge className="bg-purple-500 text-xs text-white hover:bg-purple-600">Cuối tuần</Badge>
      );
    }
    return <Badge className="bg-blue-500 text-xs text-white hover:bg-blue-600">Ngày thường</Badge>;
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              Lịch Chiếu
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Tìm và đặt vé cho suất chiếu yêu thích
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
            {/* Room Filter */}
            <Select
              value={roomFilter || 'ALL'}
              onValueChange={(val) => setRoomFilter(val === 'ALL' ? '' : val)}
            >
              <SelectTrigger className="border-gray-300 dark:border-gray-600">
                <MapPin className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Phòng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả phòng</SelectItem>
                {rooms?.map((room) => (
                  <SelectItem key={room.id} value={room.id || ''}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Day Type Filter */}
            <Select
              value={dayTypeFilter || 'ALL'}
              onValueChange={(val) => setDayTypeFilter(val === 'ALL' ? '' : val)}
            >
              <SelectTrigger className="border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Loại ngày" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                {showTimePaginateConfig.filterableColumns.day_type?.map(
                  (opt: { value: string; label: string }) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select
              value={sortColumn || 'DEFAULT'}
              onValueChange={(val) => setSortColumn(val === 'DEFAULT' ? '' : val)}
            >
              <SelectTrigger className="border-gray-300 dark:border-gray-600">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEFAULT">Mặc định</SelectItem>
                {showTimePaginateConfig.sortableColumns.map(
                  (col: { value: string; label: string }) => (
                    <SelectItem key={col.value} value={col.value}>
                      {col.label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            {/* Sort Order */}
            <Select
              value={orderColumn || 'DEFAULT'}
              onValueChange={(val) => setOrderColumn(val === 'DEFAULT' ? '' : val)}
              disabled={!sortColumn}
            >
              <SelectTrigger className="border-gray-300 dark:border-gray-600">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Thứ tự" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEFAULT">Mặc định</SelectItem>
                <SelectItem value="ASC">Tăng dần</SelectItem>
                <SelectItem value="DESC">Giảm dần</SelectItem>
              </SelectContent>
            </Select>

            {/* Start Date */}
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              title="Từ ngày"
              placeholder="Từ ngày"
              className="border-gray-300 dark:border-gray-600"
            />

            {/* End Date */}
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              title="Đến ngày"
              placeholder="Đến ngày"
              className="border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Active Filters */}
          {(dayTypeFilter || roomFilter || sortColumn || startDate || endDate) && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
              <span className="mr-2 text-sm text-gray-600 dark:text-gray-400">Bộ lọc:</span>
              {roomFilter && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleClearFilter('room')}
                  className="h-7 text-xs"
                >
                  Phòng: {rooms?.find((r) => r.id === roomFilter)?.name} ×
                </Button>
              )}
              {dayTypeFilter && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleClearFilter('dayType')}
                  className="h-7 text-xs"
                >
                  {dayTypeFilter === 'weekday' ? 'Ngày thường' : 'Cuối tuần'} ×
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
                    showTimePaginateConfig.sortableColumns.find(
                      (c: { value: string }) => c.value === sortColumn
                    )?.label
                  }{' '}
                  {orderColumn === 'ASC' ? '↑' : '↓'} ×
                </Button>
              )}
              {(startDate || endDate) && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleClearFilter('date')}
                  className="h-7 text-xs"
                >
                  Ngày: {startDate || '...'} — {endDate || '...'} ×
                </Button>
              )}
            </div>
          )}
        </div>

        {/* ShowTimes List */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="space-y-3 rounded-xl border border-gray-200 bg-white p-5 shadow dark:border-gray-700 dark:bg-gray-800"
              >
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : showTimes && showTimes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {showTimes.map((showTime) => {
                const start = formatDateTime(showTime.start_time);
                const end = showTime.end_time ? formatDateTime(showTime.end_time) : null;

                return (
                  <div
                    key={showTime.id}
                    className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:border-orange-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:hover:border-orange-700"
                  >
                    <div className="flex flex-1 flex-col p-5">
                      {/* Movie Title */}
                      <h3 className="mb-3 line-clamp-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                        {showTime.movies?.title || 'N/A'}
                      </h3>

                      <div className="flex-1 space-y-2.5">
                        {/* Room & Format */}
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 shrink-0 text-orange-500" />
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {showTime.rooms?.name || 'N/A'}
                          </span>
                          {showTime.rooms && (showTime.rooms as any).formats?.name && (
                            <Badge variant="outline" className="ml-1 text-xs">
                              <Monitor className="mr-1 h-3 w-3" />
                              {(showTime.rooms as any).formats.name}
                            </Badge>
                          )}
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4 shrink-0 text-orange-500" />
                          <span>{start.date}</span>
                          <span className="ml-auto">{getDayTypeBadge(showTime.day_type)}</span>
                        </div>

                        {/* Time Range */}
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 shrink-0 text-orange-500" />
                          <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {start.time}
                          </span>
                          {end && (
                            <>
                              <span className="text-gray-400">—</span>
                              <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                                {end.time}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="mt-4 border-t border-gray-100 pt-3 dark:border-gray-700">
                        <Link href={`/show-times/${showTime.id}`} className="block">
                          <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 font-semibold text-white shadow-md hover:from-orange-600 hover:to-orange-700">
                            <Ticket className="mr-2 h-4 w-4" />
                            Đặt vé
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Hiển thị {(meta.currentPage - 1) * meta.itemsPerPage + 1} -{' '}
                  {Math.min(meta.currentPage * meta.itemsPerPage, meta.totalItems)} của{' '}
                  {meta.totalItems} suất chiếu
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
            <Film className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300">
              Không tìm thấy suất chiếu nào
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Thử thay đổi bộ lọc hoặc tìm kiếm khác
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
