"use client"

import React, { useState, useEffect } from "react"
import { useNowShowingMovies } from "@/hooks/useNowShowingMovies"
import { useComingSoonMovies } from "@/hooks/useComingSoonMovies"
import { useMovieTypes } from "@/hooks/useMovieTypes"
import { moviePaginateConfig } from "@/config/paginate/movie.config"
import { MovieCard } from "./MovieCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MultiCombobox } from "@/components/ui/multi-combobox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { MovieType } from "@/types/movie.type"
import type { MovieTypeType } from "@/types/movieType.type"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, Film, Clapperboard } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface MovieListProps {
  initialNowShowing?: MovieType[]
  initialComingSoon?: MovieType[]
  initialMovieTypes?: MovieTypeType[]
}

// Shared filter + pagination section for each tab
function MovieTabContent({
  hookResult,
  isLoading,
  page,
  setPage,
  searchQuery,
  setSearchQuery,
  searchColumn,
  setSearchColumn,
  sortColumn,
  setSortColumn,
  orderColumn,
  setOrderColumn,
  movieTypes,
  emptyMessage,
  movieTypeColumns,
  setMovieTypeColumns,
}: {
  hookResult: any
  isLoading: boolean
  page: number
  setPage: (p: number | ((prev: number) => number)) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  searchColumn: string
  setSearchColumn: (c: string) => void
  sortColumn: string
  setSortColumn: (c: string) => void
  orderColumn: string
  setOrderColumn: (c: string) => void
  movieTypes: MovieTypeType[]
  emptyMessage: string
  movieTypeColumns: string[]
  setMovieTypeColumns: (c: string[]) => void
}) {
  const movies = hookResult?.data || []
  const meta = hookResult?.meta

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setPage(1)
    }
  }

  const handleClearFilter = (filterType: string) => {
    if (filterType === "type") setMovieTypeColumns([])
    if (filterType === "sort") {
      setSortColumn("")
      setOrderColumn("")
    }
    if (filterType === "search") {
      setSearchQuery("")
      setSearchColumn("")
    }
  }

  return (
    <div>
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Tìm kiếm phim..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          {/* Movie Type Filter */}
          <MultiCombobox
              datas={movieTypes.map((item) => ({
                value: item.id + "",
                label: item.type,
              }))}
              placeholder="Thể loại"
              onChange={setMovieTypeColumns}
              values={movieTypeColumns}
            />

          {/* Sort By */}
          <Select value={sortColumn || "DEFAULT"} onValueChange={(val) => setSortColumn(val === "DEFAULT" ? "" : val)}>
            <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
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
          <Select value={orderColumn || "DEFAULT"} onValueChange={(val) => setOrderColumn(val === "DEFAULT" ? "" : val)} disabled={!sortColumn}>
            <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500">
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
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Bộ lọc:</span>
            {searchQuery && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleClearFilter("search")}
                className="h-7 text-xs"
              >
                Tìm: &quot;{searchQuery}&quot; ×
              </Button>
            )}
            {movieTypeColumns.length > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleClearFilter("type")}
                className="h-7 text-xs"
              >
                Thể loại: {movieTypeColumns.map(id => movieTypes?.find(t => t.id === id)?.type || id).join(", ")} ×
              </Button>
            )}
            {sortColumn && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleClearFilter("sort")}
                className="h-7 text-xs"
              >
                Sắp xếp: {moviePaginateConfig.sortableColumns.find(c => c.value === sortColumn)?.label} {orderColumn === "ASC" ? "↑" : "↓"} ×
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Movie Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {movies.map((movie: MovieType) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-12">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Hiển thị {(meta.currentPage - 1) * meta.itemsPerPage + 1} -{" "}
                {Math.min(meta.currentPage * meta.itemsPerPage, meta.totalItems)}{" "}
                của {meta.totalItems} phim
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
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === meta.totalPages ||
                        Math.abs(p - page) <= 1
                    )
                    .map((p, index, array) => (
                      <div key={p} className="flex items-center">
                        {index > 0 && array[index - 1] !== p - 1 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        <Button
                          variant={page === p ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(p)}
                          className={
                            page === p
                              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white min-w-10"
                              : "hover:bg-orange-50 dark:hover:bg-orange-950 min-w-10"
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
        <div className="text-center py-16">
          <Film className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {emptyMessage}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Thử thay đổi bộ lọc hoặc tìm kiếm khác
          </p>
        </div>
      )}
    </div>
  )
}

export function MovieList({ initialNowShowing = [], initialComingSoon = [], initialMovieTypes = [] }: MovieListProps) {
  // Now Showing state
  const [nsPage, setNsPage] = useState(1)
  const [nsSearch, setNsSearch] = useState("")
  const [nsSearchCol, setNsSearchCol] = useState("")
  const [nsSort, setNsSort] = useState("")
  const [nsOrder, setNsOrder] = useState("")
  const [nsMovieTypeColumns, setNsMovieTypeColumns] = useState<string[]>([]);

  // Coming Soon state
  const [csPage, setCsPage] = useState(1)
  const [csSearch, setCsSearch] = useState("")
  const [csSearchCol, setCsSearchCol] = useState("")
  const [csSort, setCsSort] = useState("")
  const [csOrder, setCsOrder] = useState("")
  const [csMovieTypeColumns, setCsMovieTypeColumns] = useState<string[]>([]);

  const { data: movieTypes } = useMovieTypes({
    initialData: initialMovieTypes,
  })

  const buildSortBy = (sort: string, order: string) => {
    if (sort && order) return `${sort}:${order}`
    if (sort) return `${sort}:DESC`
    return moviePaginateConfig.defaultSortBy[0][0] + ":" + moviePaginateConfig.defaultSortBy[0][1]
  }

  const buildFilter = (typeColumns: string[]) => {
    const filter: Record<string, any> = {}
    if (typeColumns.length > 0) {
      filter["movie_movie_types.movie_type_id"] = typeColumns
    }
    return Object.keys(filter).length > 0 ? filter : undefined
  }

  // Now Showing hook
  const { data: nsResponse, isLoading: nsLoading } = useNowShowingMovies({
    page: nsPage,
    limit: moviePaginateConfig.defaultLimit,
    search: nsSearch || undefined,
    searchBy: nsSearchCol || undefined,
    sortBy: buildSortBy(nsSort, nsOrder),
    filter: buildFilter(nsMovieTypeColumns),
    initialData: nsPage === 1 && !nsSearch && nsMovieTypeColumns.length === 0 ? initialNowShowing : undefined,
  })

  // Coming Soon hook
  const { data: csResponse, isLoading: csLoading } = useComingSoonMovies({
    page: csPage,
    limit: moviePaginateConfig.defaultLimit,
    search: csSearch || undefined,
    searchBy: csSearchCol || undefined,
    sortBy: buildSortBy(csSort, csOrder),
    filter: buildFilter(csMovieTypeColumns),
    initialData: csPage === 1 && !csSearch && csMovieTypeColumns.length === 0 ? initialComingSoon : undefined,
  })

  // Auto-reset page on filter change (Now Showing)
  useEffect(() => {
    setNsPage(1)
  }, [nsMovieTypeColumns, nsSort, nsOrder, nsSearchCol])

  // Auto-reset page on filter change (Coming Soon)
  useEffect(() => {
    setCsPage(1)
  }, [csMovieTypeColumns, csSort, csOrder, csSearchCol])

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
            Danh Sách Phim
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Khám phá những bộ phim đang chiếu và sắp ra mắt
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="now-showing" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 bg-gray-200 dark:bg-gray-700 p-1 rounded-xl">
            <TabsTrigger
              value="now-showing"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white rounded-lg transition-all font-semibold"
            >
              <Film className="w-4 h-4" />
              Phim Đang Chiếu
            </TabsTrigger>
            <TabsTrigger
              value="coming-soon"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg transition-all font-semibold"
            >
              <Clapperboard className="w-4 h-4" />
              Phim Sắp Chiếu
            </TabsTrigger>
          </TabsList>

          <TabsContent value="now-showing">
            <MovieTabContent
              hookResult={nsResponse}
              isLoading={nsLoading}
              page={nsPage}
              setPage={setNsPage}
              searchQuery={nsSearch}
              setSearchQuery={setNsSearch}
              searchColumn={nsSearchCol}
              setSearchColumn={setNsSearchCol}
              sortColumn={nsSort}
              setSortColumn={setNsSort}
              orderColumn={nsOrder}
              setOrderColumn={setNsOrder}
              movieTypes={movieTypes || []}
              emptyMessage="Không có phim đang chiếu nào"
              movieTypeColumns={nsMovieTypeColumns}
              setMovieTypeColumns={setNsMovieTypeColumns}
            />
          </TabsContent>

          <TabsContent value="coming-soon">
            <MovieTabContent
              hookResult={csResponse}
              isLoading={csLoading}
              page={csPage}
              setPage={setCsPage}
              searchQuery={csSearch}
              setSearchQuery={setCsSearch}
              searchColumn={csSearchCol}
              setSearchColumn={setCsSearchCol}
              sortColumn={csSort}
              setSortColumn={setCsSort}
              orderColumn={csOrder}
              setOrderColumn={setCsOrder}
              movieTypes={movieTypes || []}
              emptyMessage="Không có phim sắp chiếu nào"
              movieTypeColumns={csMovieTypeColumns}
              setMovieTypeColumns={setCsMovieTypeColumns}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
