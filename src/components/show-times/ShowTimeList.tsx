"use client"

import { useState, useEffect } from "react"
import { useShowTimes } from "@/hooks/useShowTimes"
import { showTimePaginateConfig } from "@/config/paginate/show_time.config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Film,
  Clock,
  Calendar,
  MapPin,
  Ticket,
} from "lucide-react"
import type { ShowTimeType } from "@/types/showTime.type"
import Image from "next/image"
import Link from "next/link"

interface ShowTimeListProps {
  initialShowTimes?: ShowTimeType[]
  movieId?: string
}

export function ShowTimeList({ initialShowTimes = [], movieId }: ShowTimeListProps) {
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortColumn, setSortColumn] = useState("")
  const [orderColumn, setOrderColumn] = useState("")
  const [dayTypeFilter, setDayTypeFilter] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Build filter object
  const buildFilter = () => {
    const filter: Record<string, any> = { is_active: true }
    if (movieId) {
      filter.movie_id = movieId
    }
    if (dayTypeFilter) {
      filter.day_type = dayTypeFilter
    }
    if (startDate) {
      filter.start_time = filter.start_time || {}
      filter.start_time.$gte = `${startDate}T00:00:00Z`
    }
    if (endDate) {
      filter.end_time = filter.end_time || {}
      filter.end_time.$lte = `${endDate}T23:59:00Z`
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
    return showTimePaginateConfig.defaultSortBy[0][0] + ":" + showTimePaginateConfig.defaultSortBy[0][1]
  }

  const { data: response, isLoading } = useShowTimes({
    page,
    limit: showTimePaginateConfig.defaultLimit,
    search: searchQuery || undefined,
    searchBy: searchQuery ? "movies.title" : undefined,
    sortBy: buildSortBy(),
    filter: buildFilter(),
    initialData: page === 1 && !searchQuery && !dayTypeFilter && !startDate && !endDate
      ? initialShowTimes
      : undefined,
  })

  const showTimes = response?.data || []
  const meta = response?.meta

  const handleSearch = () => {
    setPage(1)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  // Auto-search when filters change
  useEffect(() => {
    setPage(1)
  }, [sortColumn, orderColumn, dayTypeFilter, startDate, endDate])

  const handleClearFilter = (filterType: string) => {
    if (filterType === "sort") {
      setSortColumn("")
      setOrderColumn("")
    }
    if (filterType === "search") {
      setSearchQuery("")
    }
    if (filterType === "dayType") {
      setDayTypeFilter("")
    }
    if (filterType === "date") {
      setStartDate("")
      setEndDate("")
    }
  }

  // Format datetime
  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr)
    return {
      date: d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }),
      time: d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    }
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "N/A"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const getDayTypeBadge = (dayType?: string) => {
    if (!dayType) return <Badge variant="outline">N/A</Badge>
    if (dayType.toLowerCase() === "weekend") {
      return <Badge className="bg-purple-500 hover:bg-purple-600 text-white text-xs">Cuối tuần</Badge>
    }
    return <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs">Ngày thường</Badge>
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              Lịch Chiếu
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Tìm và đặt vé cho suất chiếu yêu thích
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
                placeholder="Tìm kiếm theo tên phim..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            {/* Day Type Filter */}
            <Select value={dayTypeFilter || "ALL"} onValueChange={(val) => setDayTypeFilter(val === "ALL" ? "" : val)}>
              <SelectTrigger className="border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Loại ngày" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                {showTimePaginateConfig.filterableColumns.day_type?.map((opt: { value: string; label: string }) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortColumn || "DEFAULT"} onValueChange={(val) => setSortColumn(val === "DEFAULT" ? "" : val)}>
              <SelectTrigger className="border-gray-300 dark:border-gray-600">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEFAULT">Mặc định</SelectItem>
                {showTimePaginateConfig.sortableColumns.map((col: { value: string; label: string }) => (
                  <SelectItem key={col.value} value={col.value}>
                    {col.label}
                  </SelectItem>
                ))}
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
          {(searchQuery || dayTypeFilter || sortColumn || startDate || endDate) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Bộ lọc:</span>
              {searchQuery && (
                <Button variant="secondary" size="sm" onClick={() => handleClearFilter("search")} className="h-7 text-xs">
                  Tìm: &quot;{searchQuery}&quot; ×
                </Button>
              )}
              {dayTypeFilter && (
                <Button variant="secondary" size="sm" onClick={() => handleClearFilter("dayType")} className="h-7 text-xs">
                  {dayTypeFilter === "weekday" ? "Ngày thường" : "Cuối tuần"} ×
                </Button>
              )}
              {sortColumn && (
                <Button variant="secondary" size="sm" onClick={() => handleClearFilter("sort")} className="h-7 text-xs">
                  Sắp xếp: {showTimePaginateConfig.sortableColumns.find((c: { value: string }) => c.value === sortColumn)?.label} {orderColumn === "ASC" ? "↑" : "↓"} ×
                </Button>
              )}
              {(startDate || endDate) && (
                <Button variant="secondary" size="sm" onClick={() => handleClearFilter("date")} className="h-7 text-xs">
                  Ngày: {startDate || "..."} — {endDate || "..."} ×
                </Button>
              )}
            </div>
          )}
        </div>

        {/* ShowTimes List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700 space-y-3">
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : showTimes && showTimes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {showTimes.map((showTime) => {
                const start = formatDateTime(showTime.start_time)
                const end = showTime.end_time ? formatDateTime(showTime.end_time) : null

                return (
                  <Link
                    key={showTime.id}
                    href={`/show-times/${showTime.id}`}
                    className="group"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 h-full flex flex-col">
                      {/* Movie Thumbnail */}
                      <div className="relative h-44 bg-gray-100 dark:bg-gray-700">
                        {showTime.movies?.thumbnail ? (
                          <Image
                            src={showTime.movies.thumbnail}
                            alt={showTime.movies.title || ""}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Film className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                          </div>
                        )}
                        {/* Day Type Badge */}
                        <div className="absolute top-3 right-3">
                          {getDayTypeBadge(showTime.day_type)}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2 line-clamp-1 group-hover:text-orange-500 transition-colors">
                          {showTime.movies?.title || "N/A"}
                        </h3>

                        {showTime.movies?.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                            {showTime.movies.description}
                          </p>
                        )}

                        <div className="mt-auto space-y-2">
                          {/* Time */}
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4 text-orange-500" />
                            <span className="font-semibold text-gray-900 dark:text-gray-100">{start.time}</span>
                            {end && <span className="text-gray-400">— {end.time}</span>}
                          </div>

                          {/* Date */}
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4 text-orange-500" />
                            <span>{start.date}</span>
                          </div>

                          {/* Room */}
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4 text-orange-500" />
                            <span>{showTime.rooms?.name || "N/A"}</span>
                          </div>

                          {/* Duration */}
                          {showTime.movies?.duration && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Film className="w-4 h-4 text-orange-500" />
                              <span>{formatDuration(showTime.movies.duration)}</span>
                            </div>
                          )}
                        </div>

                        {/* CTA */}
                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex items-center justify-center gap-2 text-orange-500 font-semibold text-sm group-hover:text-orange-600 transition-colors">
                            <Ticket className="w-4 h-4" />
                            Đặt vé ngay
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between mt-12">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Hiển thị {(meta.currentPage - 1) * meta.itemsPerPage + 1} -{" "}
                  {Math.min(meta.currentPage * meta.itemsPerPage, meta.totalItems)}{" "}
                  của {meta.totalItems} suất chiếu
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
            <Film className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Không tìm thấy suất chiếu nào
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
