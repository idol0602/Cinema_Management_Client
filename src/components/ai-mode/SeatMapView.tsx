'use client';

import { useState, useMemo, useEffect } from 'react';
import clsx from 'clsx';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Film } from 'lucide-react';
import { showTimeService } from '@/services/showTime.service';
import type { ShowTimeDetailType } from '@/types/showTime.type';
import { getSeatTypeColor, seatStatusColors } from '@/config/seatTypeColors';

// Shape from AI chat response data
interface AiSeatData {
  id: string;
  show_time_id: string;
  seat_id: string;
  status_seat: string;
  seats: {
    id: string;
    type: string;
    room_id: string;
    seat_types: {
      id: string;
      name: string;
    };
    seat_number: string;
  };
}

interface SeatMapViewProps {
  showTimeId?: string | null;
  initialSeats?: AiSeatData[];
}

// Transform AI flat seat data into the grouped format
function transformAiSeats(aiSeats: AiSeatData[]) {
  return (aiSeats || [])
    .map((s: any) => {
      const seatSource = s?.seats || s?.seat || null;
      const seatTypeSource = seatSource?.seat_types || seatSource?.seat_type || null;
      const seatId = seatSource?.id || s?.seat_id || s?.id;
      const seatNumber = seatSource?.seat_number || s?.seat_number;

      if (!seatId || !seatNumber) return null;

      return {
        id: seatId,
        seat_number: seatNumber,
        is_active: s?.is_active ?? true,
        seat_type: {
          id: seatTypeSource?.id || seatSource?.type || '',
          type: seatTypeSource?.name || seatTypeSource?.type || 'STANDARD',
          name: seatTypeSource?.name || seatTypeSource?.type || 'STANDARD',
        },
        show_time_seat: {
          id: s?.id,
          status_seat: s?.status_seat || s?.show_time_seat?.status_seat || 'AVAILABLE',
        },
      };
    })
    .filter(Boolean);
}

export function SeatMapView({ showTimeId, initialSeats }: SeatMapViewProps) {
  const [showTimeDetail, setShowTimeDetail] = useState<ShowTimeDetailType | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);

  const normalizedInitialSeats = useMemo(
    () => transformAiSeats((initialSeats || []) as any),
    [initialSeats]
  );

  // Determine seat source: initialSeats from AI or from API
  const seats = useMemo(() => {
    if (normalizedInitialSeats.length > 0) {
      return normalizedInitialSeats;
    }
    if (showTimeDetail?.room?.seats) {
      return showTimeDetail.room.seats;
    }
    return [];
  }, [normalizedInitialSeats, showTimeDetail]);

  // Load showtime details when showTimeId changes (only if no initialSeats)
  useEffect(() => {
    if (normalizedInitialSeats.length > 0) return;
    if (!showTimeId) return;
    setLoading(true);
    showTimeService
      .getShowTimeDetails(showTimeId)
      .then((response) => {
        if (response.success && response.data) {
          setShowTimeDetail(response.data as ShowTimeDetailType);
        }
      })
      .finally(() => setLoading(false));
  }, [showTimeId, normalizedInitialSeats]);

  const getSeatColorClass = (seat: any, isSelected: boolean) => {
    const status = seat.show_time_seat?.status_seat;
    const seatType = seat.seat_type?.type || seat.seat_type?.name || 'STANDARD';
    const typeColors = getSeatTypeColor(seatType);

    if (!seat.is_active || status === 'FIXING') {
      return seatStatusColors.FIXING.class;
    }
    if (isSelected) {
      return seatStatusColors.SELECTED
        ? seatStatusColors.SELECTED.class
        : 'bg-orange-500 text-white ring-2 ring-orange-500 ring-offset-1 scale-110 cursor-pointer';
    }
    switch (status) {
      case 'BOOKED':
        return seatStatusColors.BOOKED.class;
      case 'HOLDING':
        return `${typeColors.bg} ${seatStatusColors.HOLDING.class} ${typeColors.border}`;
      default:
        return `${typeColors.bg} ${typeColors.border} border-2 ${seatStatusColors.AVAILABLE.class}`;
    }
  };

  const uniqueSeatTypes = useMemo(() => {
    if (!seats.length) return [];
    const types = new Set<string>();
    seats.forEach((s: any) => types.add(s.seat_type?.type || s.seat_type?.name || 'STANDARD'));
    return Array.from(types).map((t) => ({
      type: t,
      ...getSeatTypeColor(t),
    }));
  }, [seats]);

  const groupedSeats = useMemo(() => {
    if (!seats.length) return {} as Record<string, any[]>;
    const groups: Record<string, any[]> = {};
    seats.forEach((seat: any) => {
      const row = seat.seat_number.charAt(0);
      if (!groups[row]) groups[row] = [];
      groups[row].push(seat);
    });
    Object.keys(groups).forEach((row) => {
      groups[row].sort(
        (a: any, b: any) =>
          (parseInt(a.seat_number.slice(1)) || 0) - (parseInt(b.seat_number.slice(1)) || 0)
      );
    });
    return groups;
  }, [seats]);

  const sortedRows = useMemo(() => Object.keys(groupedSeats).sort(), [groupedSeats]);

  const isSeatSelected = (seat: any) => selectedSeats.some((s) => s.id === seat.id);

  const canSelectSeat = (seat: any) => {
    if (!seat.is_active) return false;
    const status = seat.show_time_seat?.status_seat;
    return !status || status === 'AVAILABLE';
  };

  const toggleSeat = (seat: any) => {
    if (!canSelectSeat(seat)) return;
    if (isSeatSelected(seat)) {
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
    } else {
      setSelectedSeats((prev) => [...prev, seat]);
    }
  };

  // No showTimeId and no initialSeats
  if (!showTimeId && normalizedInitialSeats.length === 0) {
    return (
      <div className="py-16 text-center">
        <Film className="mx-auto mb-4 h-16 w-16 text-gray-400" />
        <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300">
          Chưa chọn suất chiếu
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Vui lòng chọn suất chiếu trước để xem sơ đồ ghế
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (seats.length === 0) {
    return (
      <div className="py-16 text-center">
        <Film className="mx-auto mb-4 h-16 w-16 text-gray-400" />
        <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300">
          Không tìm thấy ghế
        </h3>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Screen Indicator */}
      <div className="text-center">
        <div className="mx-auto mb-1 h-2 w-3/4 rounded-full bg-gradient-to-r from-transparent via-orange-400 to-transparent" />
        <span className="text-xs uppercase tracking-widest text-gray-400">Màn hình</span>
      </div>

      {/* Seat Map */}
      <Card className="overflow-auto border-0 shadow-lg">
        <CardContent className="p-6">
          <ScrollArea className="max-h-[400px]">
            <div className="flex flex-col items-center gap-1.5 py-2">
              {sortedRows.map((row) => (
                <div key={row} className="flex items-center justify-center gap-1.5">
                  <span className="w-6 text-center text-sm font-semibold text-gray-500">{row}</span>
                  <div className="flex gap-1">
                    {groupedSeats[row].map((seat: any) => {
                      const selected = isSeatSelected(seat);
                      return (
                        <button
                          key={seat.id}
                          onClick={() => toggleSeat(seat)}
                          disabled={!canSelectSeat(seat)}
                          className={clsx(
                            'flex h-9 w-9 items-center justify-center rounded-md text-xs font-semibold transition-all duration-200',
                            getSeatColorClass(seat, selected)
                          )}
                          title={`${seat.seat_number} — ${seat.seat_type?.name || 'STANDARD'} — ${seat.show_time_seat?.status_seat || 'AVAILABLE'}`}
                        >
                          {seat.seat_number.slice(1)}
                        </button>
                      );
                    })}
                  </div>
                  <span className="w-6 text-center text-sm font-semibold text-gray-500">{row}</span>
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
                    <div className={`h-5 w-5 ${st.legendBg} rounded-md border-2 shadow-sm`} />
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
                  <span className="text-gray-600 dark:text-gray-400">Còn trống</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-5 w-5 rounded-sm bg-orange-500 ring-2 ring-orange-500 ring-offset-1" />
                  <span className="text-gray-600 dark:text-gray-400">Đang chọn</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-5 w-5 rounded-sm border-2 border-dashed border-gray-400 bg-gray-200" />
                  <span className="text-gray-600 dark:text-gray-400">Đang giữ</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-5 w-5 rounded-sm border-2 border-gray-700 bg-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">Đã đặt</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-5 w-5 rounded-sm border-2 border-gray-400 bg-red-600 opacity-60" />
                  <span className="text-gray-600 dark:text-gray-400">Bảo trì</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Seats Summary */}
          {selectedSeats.length > 0 && (
            <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-800 dark:bg-orange-950/30">
              <p className="mb-2 text-sm font-semibold text-orange-700 dark:text-orange-300">
                Ghế đã chọn ({selectedSeats.length}):
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedSeats.map((s: any) => (
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
  );
}
