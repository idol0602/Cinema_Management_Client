"use client"

import React, { useState, useEffect } from "react"
import { useMovies } from "@/hooks/useMovies"
import { useMovieTypes } from "@/hooks/useMovieTypes"
import { moviePaginateConfig } from "@/config/paginate/movie.config"
import { MovieCard } from "./MovieCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { MovieType } from "@/types/movie.type"
import type { MovieTypeType } from "@/types/movieType.type"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface MovieListProps {
  initialMovies?: MovieType[]
  initialMovieTypes?: MovieTypeType[]
}

export function MovieList({ initialMovies = [], initialMovieTypes = [] }: MovieListProps) {
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchColumn, setSearchColumn] = useState("")
  const [sortColumn, setSortColumn] = useState("")
  const [orderColumn, setOrderColumn] = useState("")
  const [statusColumn, setStatusColumn] = useState("")
  const [movieTypeColumn, setMovieTypeColumn] = useState("")

  const { data: movieTypes } = useMovieTypes({
    initialData: initialMovieTypes,
  })
  
  // Build filter object
  const buildFilter = () => {
    const filter: Record<string, any> = { is_active: "true" }
    if (statusColumn) {
      filter.is_active = statusColumn
    }
    if (movieTypeColumn) {
      filter.movie_type_id = movieTypeColumn
    }
    return filter
  }

  // Build sortBy string
  const buildSortBy = () => {
    if (sortColumn && orderColumn) {
      return `${sortColumn}:${orderColumn}`
    } else if (sortColumn) {
      return `${sortColumn}:DESC`
    }
    return moviePaginateConfig.defaultSortBy[0] + ":" + moviePaginateConfig.defaultSortBy[1]
  }

  const { data: moviesResponse, isLoading } = useMovies({
    page,
    limit: moviePaginateConfig.defaultLimit,
    search: searchQuery || undefined,
    searchBy: searchColumn || undefined,
    sortBy: buildSortBy(),
    filter: buildFilter(),
    initialData: page === 1 && !searchQuery && !statusColumn && !movieTypeColumn ? initialMovies : undefined,
  })

  const movies = moviesResponse?.data || []
  const meta = moviesResponse?.meta

  // Reset to page 1 when filters change
  const handleSearch = () => {
    setPage(1)
  }

  // Handle search on Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  // Auto-search when filters change
  useEffect(() => {
    setPage(1)
  }, [statusColumn, movieTypeColumn, sortColumn, orderColumn, searchColumn])

  // Clear filter
  const handleClearFilter = (filterType: string) => {
    if (filterType === "status") setStatusColumn("")
    if (filterType === "type") setMovieTypeColumn("")
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
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              Phim Đang Chiếu
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Khám phá những bộ phim mới nhất đang được chiếu
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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

            {/* Search By */}
            <Select value={searchColumn || "ALL"} onValueChange={(val) => setSearchColumn(val === "ALL" ? "" : val)}>
              <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500">
                <SelectValue placeholder="Tìm theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                {moviePaginateConfig.searchableColumns.map((col) => (
                  <SelectItem key={col.value} value={col.value}>
                    {col.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Movie Type Filter */}
            <Select value={movieTypeColumn || "ALL"} onValueChange={(val) => setMovieTypeColumn(val === "ALL" ? "" : val)}>
              <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Thể loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                {movieTypes?.map((type) => (
                  <SelectItem key={type.id} value={type.id || ""}>
                    {type.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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
            <Select value={orderColumn} onValueChange={setOrderColumn} disabled={!sortColumn}>
              <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500">
                <SelectValue placeholder="Thứ tự" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASC">Tăng dần</SelectItem>
                <SelectItem value="DESC">Giảm dần</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || searchColumn || movieTypeColumn || sortColumn) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Bộ lọc đang áp dụng:</span>
              {searchQuery && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleClearFilter("search")}
                  className="h-7 text-xs"
                >
                  Tìm: "{searchQuery}" ×
                </Button>
              )}
              {movieTypeColumn && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleClearFilter("type")}
                  className="h-7 text-xs"
                >
                  Thể loại: {movieTypes?.find(t => t.id === movieTypeColumn)?.name} ×
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between mt-12">
                {/* Meta info */}
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Hiển thị {(meta.currentPage - 1) * meta.itemsPerPage + 1} -{" "}
                  {Math.min(meta.currentPage * meta.itemsPerPage, meta.totalItems)}{" "}
                  của {meta.totalItems} phim
                </div>

                {/* Pagination buttons */}
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
          <div className="text-center py-16">
            <Filter className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Không tìm thấy phim nào
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Thử thay đổi bộ lọc hoặc tìm kiếm khác
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
