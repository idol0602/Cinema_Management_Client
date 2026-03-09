"use client"

import { useState, useMemo } from "react"
import clsx from "clsx"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Sparkles, Film } from "lucide-react"
import { showTimeService } from "@/services/showTime.service"
import type { ShowTimeDetailType, SeatDetail } from "@/types/showTime.type"
import { getSeatTypeColor, seatStatusColors } from "@/config/seatTypeColors"

interface SeatMapViewProps {
  showTimeId?: string | null
}

export function SeatMapView({ showTimeId }: SeatMapViewProps) {
  const [showTimeDetail, setShowTimeDetail] = useState<ShowTimeDetailType | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedSeats, setSelectedSeats] = useState<SeatDetail[]>([])

  // Load showtime details when showTimeId changes
  useState(() => {
    if (!showTimeId) return
    setLoading(true)
    showTimeService
      .getShowTimeDetails(showTimeId)
      .then((response) => {
        if (response.success && response.data) {
          setShowTimeDetail(response.data as ShowTimeDetailType)
        }
      })
      .finally(() => setLoading(false))
  })

  const getSeatColorClass = (seat: SeatDetail, isSelected: boolean) => {
    const status = seat.show_time_seat?.status_seat
    const seatType = seat.seat_type?.type || seat.seat_type?.name || "STANDARD"
    const typeColors = getSeatTypeColor(seatType)

    if (!seat.is_active || status === "FIXING") {
      return seatStatusColors.FIXING.class
    }
    if (isSelected) {
      return seatStatusColors.SELECTED
        ? seatStatusColors.SELECTED.class
        : "bg-orange-500 text-white ring-2 ring-orange-500 ring-offset-1 scale-110 cursor-pointer"
    }
    switch (status) {
      case "BOOKED":
        return seatStatusColors.BOOKED.class
      case "HOLDING":
        return `${typeColors.bg} ${seatStatusColors.HOLDING.class} ${typeColors.border}`
      default:
        return `${typeColors.bg} ${typeColors.border} border-2 ${seatStatusColors.AVAILABLE.class}`
    }
  }

  const uniqueSeatTypes = useMemo(() => {
    if (!showTimeDetail?.room?.seats) return []
    const types = new Set<string>()
    showTimeDetail.room.seats.forEach((s) =>
      types.add(s.seat_type?.type || s.seat_type?.name || "STANDARD")
    )
    return Array.from(types).map((t) => ({
      type: t,
      ...getSeatTypeColor(t),
    }))
  }, [showTimeDetail])

  const groupedSeats = useMemo(() => {
    if (!showTimeDetail?.room?.seats) return {} as Record<string, SeatDetail[]>
    const groups: Record<string, SeatDetail[]> = {}
    showTimeDetail.room.seats.forEach((seat) => {
      const row = seat.seat_number.charAt(0)
      if (!groups[row]) groups[row] = []
      groups[row].push(seat)
    })
    Object.keys(groups).forEach((row) => {
      groups[row].sort(
        (a, b) =>
          (parseInt(a.seat_number.slice(1)) || 0) -
          (parseInt(b.seat_number.slice(1)) || 0)
      )
    })
    return groups
  }, [showTimeDetail])

  const sortedRows = useMemo(
    () => Object.keys(groupedSeats).sort(),
    [groupedSeats]
  )

  const isSeatSelected = (seat: SeatDetail) =>
    selectedSeats.some((s) => s.id === seat.id)

  const canSelectSeat = (seat: SeatDetail) => {
    if (!seat.is_active) return false
    const status = seat.show_time_seat?.status_seat
    return !status || status === "AVAILABLE"
  }

  const toggleSeat = (seat: SeatDetail) => {
    if (!canSelectSeat(seat)) return
    if (isSeatSelected(seat)) {
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id))
    } else {
      setSelectedSeats((prev) => [...prev, seat])
    }
  }

  if (!showTimeId) {
    return (
      <div className="text-center py-16">
        <Film className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Chưa chọn suất chiếu
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Vui lòng chọn suất chiếu trước để xem sơ đồ ghế
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    )
  }

  if (!showTimeDetail) {
    return (
      <div className="text-center py-16">
        <Film className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Không tìm thấy suất chiếu
        </h3>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Screen Indicator */}
      <div className="text-center">
        <div className="mx-auto mb-1 h-2 w-3/4 rounded-full bg-gradient-to-r from-transparent via-orange-400 to-transparent" />
        <span className="text-xs uppercase tracking-widest text-gray-400">
          Màn hình
        </span>
      </div>

      {/* Seat Map */}
      <Card className="overflow-auto border-0 shadow-lg">
        <CardContent className="p-6">
          <ScrollArea className="max-h-[400px]">
            <div className="flex flex-col items-center gap-1.5 py-2">
              {sortedRows.map((row) => (
                <div
                  key={row}
                  className="flex items-center justify-center gap-1.5"
                >
                  <span className="w-6 text-center text-sm font-semibold text-gray-500">
                    {row}
                  </span>
                  <div className="flex gap-1">
                    {groupedSeats[row].map((seat) => {
                      const selected = isSeatSelected(seat)
                      return (
                        <button
                          key={seat.id}
                          onClick={() => toggleSeat(seat)}
                          disabled={!canSelectSeat(seat)}
                          className={clsx(
                            "flex h-9 w-9 items-center justify-center rounded-md text-xs font-semibold transition-all duration-200",
                            getSeatColorClass(seat, selected)
                          )}
                          title={`${seat.seat_number} — ${seat.seat_type?.name || "STANDARD"}`}
                        >
                          {seat.seat_number.slice(1)}
                        </button>
                      )
                    })}
                  </div>
                  <span className="w-6 text-center text-sm font-semibold text-gray-500">
                    {row}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Legend */}
          <div className="mt-6 space-y-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            <div>
              <p className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <Sparkles className="h-3 w-3" />
                Loại ghế
              </p>
              <div className="flex flex-wrap gap-3">
                {uniqueSeatTypes.map((st) => (
                  <div
                    key={st.type}
                    className="flex items-center gap-2 rounded-md bg-gray-100 px-2 py-1 dark:bg-gray-800"
                  >
                    <div
                      className={`h-5 w-5 ${st.legendBg} rounded-md border-2 shadow-sm`}
                    />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {st.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Trạng thái
              </p>
              <div className="flex flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="h-5 w-5 rounded-sm border-2 border-gray-400 bg-gray-100" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Còn trống
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-5 w-5 rounded-sm bg-orange-500 ring-2 ring-orange-500 ring-offset-1" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Đang chọn
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-5 w-5 rounded-sm border-2 border-dashed border-gray-400 bg-gray-200" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Đang giữ
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-5 w-5 rounded-sm border-2 border-gray-700 bg-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Đã đặt
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-5 w-5 rounded-sm border-2 border-gray-400 bg-red-600 opacity-60" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Bảo trì
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Seats Summary */}
          {selectedSeats.length > 0 && (
            <div className="mt-4 rounded-lg bg-orange-50 dark:bg-orange-950/30 p-3 border border-orange-200 dark:border-orange-800">
              <p className="text-sm font-semibold text-orange-700 dark:text-orange-300 mb-2">
                Ghế đã chọn ({selectedSeats.length}):
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedSeats.map((s) => (
                  <Badge
                    key={s.id}
                    variant="secondary"
                    className="bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300"
                  >
                    {s.seat_number}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
