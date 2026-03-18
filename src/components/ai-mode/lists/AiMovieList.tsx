'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAiNowShowingMovies } from '@/hooks/ai-mode/useAiNowShowingMovies';
import { useAiComingSoonMovies } from '@/hooks/ai-mode/useAiComingSoonMovies';
import { useMovieTypes } from '@/hooks/useMovieTypes';
import { moviePaginateConfig } from '@/config/paginate/movie.config';
import { MovieCard } from '@/components/home/MovieCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MultiCombobox } from '@/components/ui/multi-combobox';
import type { MovieType } from '@/types/movie.type';
import type { MovieTypeType } from '@/types/movieType.type';
import type { PaginationMeta } from '@/types/pagination.type';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Film } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface MovieListProps {
  initialNowShowing?: MovieType[];
  initialNowShowingMeta?: PaginationMeta;
  initialComingSoon?: MovieType[];
  initialComingSoonMeta?: PaginationMeta;
  initialMovieTypes?: MovieTypeType[];
  disableFetch?: boolean;
  mode?: 'all' | 'now-showing' | 'coming-soon';
  title?: string;
  description?: string;
}

// Shared filter + pagination section for each tab
function MovieTabContent({
  hookResult,
  isLoading,
  page,
  setPage,
  searchQuery,
  setSearchQuery,
  setSearchColumn,
  sortColumn,
  setSortColumn,
  orderColumn,
  setOrderColumn,
  movieTypes,
  emptyMessage,
  movieTypeColumns,
  setMovieTypeColumns,
  selectType,
}: {
  hookResult: any;
  isLoading: boolean;
  page: number;
  setPage: (p: number | ((prev: number) => number)) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  setSearchColumn: (c: string) => void;
  sortColumn: string;
  setSortColumn: (c: string) => void;
  orderColumn: string;
  setOrderColumn: (c: string) => void;
  movieTypes: MovieTypeType[];
  emptyMessage: string;
  movieTypeColumns: string[];
  setMovieTypeColumns: (c: string[]) => void;
  selectType: 'now-showing' | 'coming-soon';
}) {
  const pathname = usePathname();
  const isAiMode = pathname?.includes('/ai-mode') ?? false;
  const movies = hookResult?.data || [];
  const meta = hookResult?.meta;

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setPage(1);
    }
  };

  const handleClearFilter = (filterType: string) => {
    if (filterType === 'type') setMovieTypeColumns([]);
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
      {!isAiMode && (
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Tìm kiếm phim..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="border-gray-300 pl-10 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600"
              />
            </div>

            {/* Movie Type Filter */}
            <MultiCombobox
              datas={movieTypes.map((item) => ({
                value: item.id + '',
                label: item.type,
              }))}
              placeholder="Thể loại"
              onChange={setMovieTypeColumns}
              values={movieTypeColumns}
            />

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
                {moviePaginateConfig.sortableColumns.map((col) => (
                  <SelectItem key={col.value} value={col.value}>
                    {col.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Order */}
            <Select
              value={orderColumn || 'DEFAULT'}
              onValueChange={(val) => setOrderColumn(val === 'DEFAULT' ? '' : val)}
              disabled={!sortColumn}
            >
              <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600">
                <SelectValue placeholder="Thứ tự" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEFAULT">Mặc định</SelectItem>
                <SelectItem value="ASC">Tăng dần</SelectItem>
                <SelectItem value="DESC">Giảm dần</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || movieTypeColumns.length > 0 || sortColumn) && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
              <span className="mr-2 text-sm text-gray-600 dark:text-gray-400">Bộ lọc:</span>
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
              {movieTypeColumns.length > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleClearFilter('type')}
                  className="h-7 text-xs"
                >
                  Thể loại:{' '}
                  {movieTypeColumns
                    .map((id) => movieTypes?.find((t) => t.id === id)?.type || id)
                    .join(', ')}{' '}
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
                  {moviePaginateConfig.sortableColumns.find((c) => c.value === sortColumn)?.label}{' '}
                  {orderColumn === 'ASC' ? '↑' : '↓'} ×
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Movie Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : movies && movies.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
            {movies.map((movie: MovieType) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                badgeTitle={selectType === 'now-showing' ? 'Đang chiếu' : 'Sắp chiếu'}
              />
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Hiển thị {(meta.currentPage - 1) * meta.itemsPerPage + 1} -{' '}
                {Math.min(meta.currentPage * meta.itemsPerPage, meta.totalItems)} của{' '}
                {meta.totalItems} phim
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev: number) => Math.max(1, prev - 1))}
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
                  onClick={() => setPage((prev: number) => Math.min(meta.totalPages, prev + 1))}
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
            {emptyMessage}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
        </div>
      )}
    </div>
  );
}

export function AiMovieList({
  initialNowShowing = [],
  initialNowShowingMeta,
  initialComingSoon = [],
  initialComingSoonMeta,
  initialMovieTypes = [],
  disableFetch,
  mode = 'all',
  title = 'Danh Sách Phim',
  description = 'Khám phá những bộ phim đang chiếu và sắp ra mắt',
}: MovieListProps) {
  // Now Showing state
  const [nsPage, setNsPage] = useState(1);
  const [nsSearch, setNsSearch] = useState('');
  const [nsSearchCol, setNsSearchCol] = useState('');
  const [nsSort, setNsSort] = useState('');
  const [nsOrder, setNsOrder] = useState('');
  const [nsMovieTypeColumns, setNsMovieTypeColumns] = useState<string[]>([]);

  // Coming Soon state
  const [csPage, setCsPage] = useState(1);
  const [csSearch, setCsSearch] = useState('');
  const [csSearchCol, setCsSearchCol] = useState('');
  const [csSort, setCsSort] = useState('');
  const [csOrder, setCsOrder] = useState('');
  const [csMovieTypeColumns, setCsMovieTypeColumns] = useState<string[]>([]);

  const { data: movieTypes } = useMovieTypes({
    initialData: initialMovieTypes,
  });

  const buildSortBy = (sort: string, order: string) => {
    if (sort && order) return `${sort}:${order}`;
    if (sort) return `${sort}:DESC`;
    return moviePaginateConfig.defaultSortBy[0][0] + ':' + moviePaginateConfig.defaultSortBy[0][1];
  };

  const buildFilter = (typeColumns: string[]) => {
    const filter: Record<string, any> = {};
    if (typeColumns.length > 0) {
      filter['movie_movie_types.movie_type_id'] = typeColumns;
    }
    return Object.keys(filter).length > 0 ? filter : undefined;
  };

  // Now Showing hook
  const useAiNowShowingOnly =
    !!disableFetch &&
    nsPage === 1 &&
    !nsSearch &&
    !nsSearchCol &&
    !nsSort &&
    !nsOrder &&
    nsMovieTypeColumns.length === 0;

  const useAiComingSoonOnly =
    !!disableFetch &&
    csPage === 1 &&
    !csSearch &&
    !csSearchCol &&
    !csSort &&
    !csOrder &&
    csMovieTypeColumns.length === 0;

  const enableNowShowing = mode !== 'coming-soon';
  const enableComingSoon = mode !== 'now-showing';

  const { data: _nsResponse, isLoading: nsLoading } = useAiNowShowingMovies({
    page: nsPage,
    limit: moviePaginateConfig.defaultLimit,
    search: nsSearch || undefined,
    searchBy: nsSearchCol || undefined,
    sortBy: buildSortBy(nsSort, nsOrder),
    filter: buildFilter(nsMovieTypeColumns),
    initialData:
      nsPage === 1 && !nsSearch && nsMovieTypeColumns.length === 0 ? initialNowShowing : undefined,
  });

  // Coming Soon hook
  const { data: _csResponse, isLoading: csLoading } = useAiComingSoonMovies({
    page: csPage,
    limit: moviePaginateConfig.defaultLimit,
    search: csSearch || undefined,
    searchBy: csSearchCol || undefined,
    sortBy: buildSortBy(csSort, csOrder),
    filter: buildFilter(csMovieTypeColumns),
    initialData:
      csPage === 1 && !csSearch && csMovieTypeColumns.length === 0 ? initialComingSoon : undefined,
  });

  const nsFallbackResponse = {
    data: initialNowShowing,
    meta: initialNowShowingMeta || {
      totalItems: initialNowShowing.length,
      currentPage: 1,
      totalPages: 1,
      itemsPerPage: moviePaginateConfig.defaultLimit,
    },
  };

  const csFallbackResponse = {
    data: initialComingSoon,
    meta: initialComingSoonMeta || {
      totalItems: initialComingSoon.length,
      currentPage: 1,
      totalPages: 1,
      itemsPerPage: moviePaginateConfig.defaultLimit,
    },
  };

  const nsResponse =
    useAiNowShowingOnly && initialNowShowing
      ? ({
          data: initialNowShowing,
          meta: initialNowShowingMeta || {
            totalItems: initialNowShowing.length,
            currentPage: 1,
            totalPages: 1,
            itemsPerPage: initialNowShowing.length,
          },
        } as any)
      : _nsResponse || nsFallbackResponse;

  const csResponse =
    useAiComingSoonOnly && initialComingSoon
      ? ({
          data: initialComingSoon,
          meta: initialComingSoonMeta || {
            totalItems: initialComingSoon.length,
            currentPage: 1,
            totalPages: 1,
            itemsPerPage: initialComingSoon.length,
          },
        } as any)
      : _csResponse || csFallbackResponse;

  // Auto-reset page on filter change (Now Showing)
  useEffect(() => {
    setNsPage(1);
  }, [nsMovieTypeColumns, nsSort, nsOrder, nsSearchCol, nsSearch]);

  // Auto-reset page on filter change (Coming Soon)
  useEffect(() => {
    setCsPage(1);
  }, [csMovieTypeColumns, csSort, csOrder, csSearchCol, csSearch]);

  return (
    <section className="bg-gradient-to-b from-orange-50/40 via-white to-white py-16 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
            {title}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
        </div>

        {mode === 'all' ? (
          <div className="space-y-8">
            <div className="rounded-2xl border border-orange-100 bg-white/80 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                <Film className="h-4 w-4" />
                Phim Đang Chiếu
              </div>
              <MovieTabContent
                hookResult={nsResponse}
                isLoading={nsLoading}
                page={nsPage}
                setPage={setNsPage}
                searchQuery={nsSearch}
                setSearchQuery={setNsSearch}
                setSearchColumn={setNsSearchCol}
                sortColumn={nsSort}
                setSortColumn={setNsSort}
                orderColumn={nsOrder}
                setOrderColumn={setNsOrder}
                movieTypes={movieTypes || []}
                emptyMessage="Không có phim đang chiếu nào"
                movieTypeColumns={nsMovieTypeColumns}
                setMovieTypeColumns={setNsMovieTypeColumns}
                selectType="now-showing"
              />
            </div>

            <div className="rounded-2xl border border-orange-100 bg-white/80 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                <Film className="h-4 w-4" />
                Phim Sắp Chiếu
              </div>
              <MovieTabContent
                hookResult={csResponse}
                isLoading={csLoading}
                page={csPage}
                setPage={setCsPage}
                searchQuery={csSearch}
                setSearchQuery={setCsSearch}
                setSearchColumn={setCsSearchCol}
                sortColumn={csSort}
                setSortColumn={setCsSort}
                orderColumn={csOrder}
                setOrderColumn={setCsOrder}
                movieTypes={movieTypes || []}
                emptyMessage="Không có phim sắp chiếu nào"
                movieTypeColumns={csMovieTypeColumns}
                setMovieTypeColumns={setCsMovieTypeColumns}
                selectType="coming-soon"
              />
            </div>
          </div>
        ) : mode === 'now-showing' ? (
          <div className="rounded-2xl border border-orange-100 bg-white/80 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <MovieTabContent
              hookResult={nsResponse}
              isLoading={nsLoading}
              page={nsPage}
              setPage={setNsPage}
              searchQuery={nsSearch}
              setSearchQuery={setNsSearch}
              setSearchColumn={setNsSearchCol}
              sortColumn={nsSort}
              setSortColumn={setNsSort}
              orderColumn={nsOrder}
              setOrderColumn={setNsOrder}
              movieTypes={movieTypes || []}
              emptyMessage="Không có phim đang chiếu nào"
              movieTypeColumns={nsMovieTypeColumns}
              setMovieTypeColumns={setNsMovieTypeColumns}
              selectType="now-showing"
            />
          </div>
        ) : (
          <div className="rounded-2xl border border-orange-100 bg-white/80 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <MovieTabContent
              hookResult={csResponse}
              isLoading={csLoading}
              page={csPage}
              setPage={setCsPage}
              searchQuery={csSearch}
              setSearchQuery={setCsSearch}
              setSearchColumn={setCsSearchCol}
              sortColumn={csSort}
              setSortColumn={setCsSort}
              orderColumn={csOrder}
              setOrderColumn={setCsOrder}
              movieTypes={movieTypes || []}
              emptyMessage="Không có phim sắp chiếu nào"
              movieTypeColumns={csMovieTypeColumns}
              setMovieTypeColumns={setCsMovieTypeColumns}
              selectType="coming-soon"
            />
          </div>
        )}
      </div>
    </section>
  );
}
