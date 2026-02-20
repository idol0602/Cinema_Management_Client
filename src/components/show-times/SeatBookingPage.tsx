'use client';
import clsx from 'clsx';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Clock,
  MapPin,
  Film,
  ArrowLeft,
  Calendar,
  Monitor,
  UtensilsCrossed,
  Gift,
  Ticket,
  Timer,
  XCircle,
  Lock,
  CheckCircle,
  Plus,
  Minus,
  Eye,
  CreditCard,
  Percent,
  ShoppingCart,
  Tag,
  Sparkles,
} from 'lucide-react';

import { useAuthStore } from '@/store/useAuthStore';
import {
  useBookingStore,
  useCalculatedTotals,
  useFilteredCombos,
  useFilteredMenuItems,
  useFilteredEvents,
} from '@/store/useBookingStore';
import type { SeatDetail } from '@/types/showTime.type';
import { getSeatTypeColor, seatStatusColors } from '@/config/seatTypeColors';

interface SeatBookingPageProps {
  showTimeId: string;
}

export default function SeatBookingPage({ showTimeId }: SeatBookingPageProps) {
  const router = useRouter();
  const { user } = useAuthStore();

  // Store state
  const {
    showTimeDetail,
    loading,
    loadingCombos,
    loadingMenuItems,
    loadingEvents,
    selectedSeats,
    selectedCombos,
    selectedMenuItems,
    selectedEvent,
    isHolding,
    holdCountdown,
    holdLoading,
    orderCreating,
    comboSearch,
    menuItemSearch,
    eventSearch,
    confirmDialogOpen,
    selectedComboDetails,
    loadShowTimeDetail,
    loadUserHeldSeats,
    loadComboDetails,
    toggleSeatSelection,
    canSelectSeat,
    isSeatSelected,
    handleHoldSeats,
    handleCancelHold,
    handleComboToggle,
    setComboSearch,
    handleMenuItemQuantityChange,
    setMenuItemSearch,
    handleEventSelect,
    setEventSearch,
    setConfirmDialogOpen,
    getPrice,
    handlePayment,
    resetBooking,
    refreshShowTimeDetail,
    stopCountdown,
  } = useBookingStore();

  const totals = useCalculatedTotals();
  const filteredCombos = useFilteredCombos();
  const filteredMenuItems = useFilteredMenuItems();
  const filteredEvents = useFilteredEvents();

  // Local dialog states
  const [comboDetailDialogOpen, setComboDetailDialogOpen] = useState(false);
  const [selectedComboDetail, setSelectedComboDetail] = useState<any>(null);

  // Load showtime details
  useEffect(() => {
    if (!showTimeId) return;
    loadShowTimeDetail(showTimeId);
    return () => {
      stopCountdown();
    };
  }, [showTimeId]);

  // Load user's held seats
  useEffect(() => {
    if (showTimeDetail) {
      loadUserHeldSeats();
    }
  }, [showTimeDetail?.id]);

  // Format helpers
  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      time: d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Load combo details for dialog
  const loadComboDetailsForDialog = async (id: string) => {
    const details = await loadComboDetails(id);
    if (details) {
      setSelectedComboDetail(details);
      setComboDetailDialogOpen(true);
    } else {
      toast.error('Có lỗi xảy ra');
    }
  };

  // Seat color class (matching dashboard approach)
  const getSeatColorClass = (seat: SeatDetail, isSelected: boolean) => {
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

  // Get unique seat types in this room for the legend
  const uniqueSeatTypes = useMemo(() => {
    if (!showTimeDetail?.room?.seats) return [];
    const types = new Set<string>();
    showTimeDetail.room.seats.forEach((s) =>
      types.add(s.seat_type?.type || s.seat_type?.name || 'STANDARD')
    );
    return Array.from(types).map((t) => ({
      type: t,
      ...getSeatTypeColor(t),
    }));
  }, [showTimeDetail]);

  // Group seats into rows
  const groupedSeats = useMemo(() => {
    if (!showTimeDetail?.room?.seats) return {} as Record<string, SeatDetail[]>;
    const groups: Record<string, SeatDetail[]> = {};
    showTimeDetail.room.seats.forEach((seat) => {
      const row = seat.seat_number.charAt(0);
      if (!groups[row]) groups[row] = [];
      groups[row].push(seat);
    });
    Object.keys(groups).forEach((row) => {
      groups[row].sort(
        (a, b) => (parseInt(a.seat_number.slice(1)) || 0) - (parseInt(b.seat_number.slice(1)) || 0)
      );
    });
    return groups;
  }, [showTimeDetail]);

  const sortedRows = useMemo(() => Object.keys(groupedSeats).sort(), [groupedSeats]);

  // Handle payment
  const onPayment = async () => {
    if (!user?.id) {
      toast.error('Vui lòng đăng nhập để thanh toán');
      return;
    }
    const result = await handlePayment(user.id);
    if (result) {
      // Payment success — reset and refresh
      resetBooking();
      refreshShowTimeDetail(showTimeId);
    }
  };

  const onBack = async () => {
    if (isHolding) await handleCancelHold();
    router.push('/show-times');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-6 h-10 w-48" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-60 w-full rounded-xl" />
            <Skeleton className="h-60 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!showTimeDetail) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Film className="mx-auto mb-4 h-16 w-16 text-gray-400" />
        <h2 className="mb-2 text-2xl font-bold text-gray-700 dark:text-gray-300">
          Không tìm thấy suất chiếu
        </h2>
        <p className="mb-6 text-gray-500">Suất chiếu này không tồn tại hoặc đã hết hạn</p>
        <Button onClick={() => router.push('/show-times')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại lịch chiếu
        </Button>
      </div>
    );
  }

  const movie = showTimeDetail.movie;
  const room = showTimeDetail.room;
  const start = formatDateTime(showTimeDetail.start_time);
  const end = showTimeDetail.end_time ? formatDateTime(showTimeDetail.end_time) : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            disabled={holdLoading}
            className="hover:bg-orange-50 dark:hover:bg-orange-950"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại lịch chiếu
          </Button>

          <div className="flex items-center gap-4">
            {orderCreating && (
              <Badge variant="outline" className="border-green-300 bg-green-50 text-green-700">
                <ShoppingCart className="mr-1 h-3 w-3" />
                Đơn #{orderCreating?.id?.slice(-8)}
              </Badge>
            )}
            {isHolding && holdCountdown > 0 && (
              <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 shadow-sm dark:from-amber-950/30 dark:to-orange-950/30">
                <Timer className="h-5 w-5 animate-pulse text-amber-600" />
                <div>
                  <p className="text-xs font-medium text-amber-600">Thời gian giữ ghế</p>
                  <p
                    className={`font-mono text-xl font-bold ${holdCountdown <= 60 ? 'animate-pulse text-red-500' : 'text-amber-600'}`}
                  >
                    {formatCountdown(holdCountdown)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Seat Map + Extras */}
          <div className="space-y-6 lg:col-span-2">
            {/* Showtime Info Card */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  {movie?.thumbnail && (
                    <div className="h-28 w-20 shrink-0 overflow-hidden rounded-lg shadow-md">
                      <img
                        src={movie.thumbnail}
                        alt={movie.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {movie?.title || 'N/A'}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        <span className="font-medium">{room?.name || 'N/A'}</span>
                      </div>
                      {room?.format && (
                        <Badge variant="outline" className="text-xs">
                          <Monitor className="mr-1 h-3 w-3" />
                          {room.format.name}
                        </Badge>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-orange-500" />
                        <span>{start.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="font-semibold">{start.time}</span>
                        {end && (
                          <>
                            <span className="text-gray-400">—</span>
                            <span className="font-semibold">{end.time}</span>
                          </>
                        )}
                      </div>
                      <Badge
                        className={`text-xs ${showTimeDetail.day_type === 'WEEKEND' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'}`}
                      >
                        {showTimeDetail.day_type === 'WEEKEND' ? 'Cuối tuần' : 'Ngày thường'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                        <span className="w-6 text-center text-sm font-semibold text-gray-500">
                          {row}
                        </span>
                        <div className="flex gap-1">
                          {groupedSeats[row].map((seat) => {
                            const selected = isSeatSelected(seat);
                            return (
                              <button
                                key={seat.id}
                                onClick={() => toggleSeatSelection(seat)}
                                disabled={!canSelectSeat(seat)}
                                className={clsx(
                                  'flex h-9 w-9 items-center justify-center rounded-md text-xs font-semibold transition-all duration-200',
                                  getSeatColorClass(seat, selected)
                                )}
                                title={`${seat.seat_number} — ${seat.seat_type?.name || 'STANDARD'} — ${formatPrice(getPrice(room?.format?.id as string, seat.seat_type?.id as string, showTimeDetail.day_type))}`}
                              >
                                {seat.seat_number.slice(1)}
                              </button>
                            );
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
              </CardContent>
            </Card>

            {/* Combos, Menu Items, Events */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Combos */}
              <Card className="border-0 shadow-md">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-3 dark:from-orange-950/30 dark:to-amber-950/30">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <UtensilsCrossed className="h-4 w-4 text-orange-500" />
                    Combo
                    {selectedCombos.length > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {selectedCombos.length}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 px-3 pb-3">
                  <Input
                    placeholder="Tìm combo..."
                    value={comboSearch}
                    onChange={(e) => setComboSearch(e.target.value)}
                    className="h-9"
                  />
                  <ScrollArea className="h-52">
                    {loadingCombos ? (
                      <div className="space-y-2">
                        <Skeleton className="h-16" />
                        <Skeleton className="h-16" />
                      </div>
                    ) : filteredCombos.length === 0 ? (
                      <p className="py-8 text-center text-sm text-gray-500">Không có combo</p>
                    ) : (
                      <div className="space-y-2 pr-2">
                        {filteredCombos.map((combo) => {
                          const isSelected = selectedCombos.some((c) => c.id === combo.id);
                          return (
                            <div
                              key={combo.id}
                              className={clsx(
                                'flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-all',
                                isSelected
                                  ? 'border-2 border-orange-400 bg-orange-50 shadow-sm dark:bg-orange-950/30'
                                  : 'border-2 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
                              )}
                              onClick={() => handleComboToggle(combo, movie?.id, movie?.title)}
                            >
                              <Checkbox checked={isSelected} className="h-4 w-4" />
                              {combo.image && (
                                <img
                                  src={combo.image}
                                  alt={combo.name}
                                  className="h-12 w-12 rounded-md object-cover"
                                />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{combo.name}</p>
                                <p className="text-sm font-bold text-orange-600">
                                  {formatPrice(combo.total_price)}
                                </p>
                                {combo.is_event_combo && (
                                  <Badge
                                    variant="outline"
                                    className="border-purple-300 bg-purple-50 text-xs text-purple-700"
                                  >
                                    Event
                                  </Badge>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  loadComboDetailsForDialog(combo.id!);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Menu Items */}
              <Card className="border-0 shadow-md">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 dark:from-green-950/30 dark:to-emerald-950/30">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Gift className="h-4 w-4 text-green-500" />
                    Đồ ăn & nước uống
                    {selectedMenuItems.length > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {selectedMenuItems.reduce((sum, m) => sum + m.quantity, 0)}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 px-3 pb-3">
                  <Input
                    placeholder="Tìm món..."
                    value={menuItemSearch}
                    onChange={(e) => setMenuItemSearch(e.target.value)}
                    className="h-9"
                  />
                  <ScrollArea className="h-52">
                    {loadingMenuItems ? (
                      <div className="space-y-2">
                        <Skeleton className="h-16" />
                        <Skeleton className="h-16" />
                      </div>
                    ) : filteredMenuItems.length === 0 ? (
                      <p className="py-8 text-center text-sm text-gray-500">Không có món</p>
                    ) : (
                      <div className="space-y-2 pr-2">
                        {filteredMenuItems.map((item) => {
                          const selected = selectedMenuItems.find((m) => m.item.id === item.id);
                          return (
                            <div
                              key={item.id}
                              className={clsx(
                                'rounded-lg p-2 transition-all',
                                selected
                                  ? 'border-2 border-green-400 bg-green-50 shadow-sm dark:bg-green-950/30'
                                  : 'border-2 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
                              )}
                            >
                              <div className="flex items-center gap-2">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-12 w-12 shrink-0 rounded-md object-cover"
                                  />
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium">{item.name}</p>
                                  <p className="text-sm font-bold text-green-600">
                                    {formatPrice(item.price)}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-2 flex items-center justify-end gap-2 border-t pt-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleMenuItemQuantityChange(item, -1)}
                                  disabled={!selected}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-10 rounded bg-gray-100 px-2 py-1 text-center text-sm font-bold dark:bg-gray-800">
                                  {selected?.quantity || 0}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleMenuItemQuantityChange(item, 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Events */}
              <Card className="border-0 shadow-md">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 dark:from-purple-950/30 dark:to-pink-950/30">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    Sự kiện
                    {selectedEvent && (
                      <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Đã chọn
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 px-3 pb-3">
                  <Input
                    placeholder="Tìm sự kiện..."
                    value={eventSearch}
                    onChange={(e) => setEventSearch(e.target.value)}
                    className="h-9"
                  />
                  <ScrollArea className="h-52">
                    {loadingEvents ? (
                      <div className="space-y-2">
                        <Skeleton className="h-16" />
                        <Skeleton className="h-16" />
                      </div>
                    ) : filteredEvents.length === 0 ? (
                      <p className="py-8 text-center text-sm text-gray-500">Không có sự kiện</p>
                    ) : (
                      <div className="space-y-2 pr-2">
                        {filteredEvents.map((event) => {
                          const isSelected = selectedEvent?.id === event.id;
                          return (
                            <div
                              key={event.id}
                              className={clsx(
                                'flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-all',
                                isSelected
                                  ? 'border-2 border-purple-400 bg-purple-50 shadow-sm dark:bg-purple-950/30'
                                  : 'border-2 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
                              )}
                              onClick={() => handleEventSelect(event)}
                            >
                              {event.image && (
                                <img
                                  src={event.image}
                                  alt={event.name}
                                  className="h-12 w-12 rounded-md object-cover"
                                />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{event.name}</p>
                                {event.discount && event.discount.is_active && (
                                  <Badge className="mt-1 bg-gradient-to-r from-red-500 to-pink-500 text-xs text-white">
                                    <Percent className="mr-1 h-3 w-3" />
                                    Giảm {event.discount.discount_percent}%
                                  </Badge>
                                )}
                              </div>
                              {isSelected && (
                                <CheckCircle className="h-5 w-5 shrink-0 text-purple-500" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="sticky top-4 border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 pb-3 dark:from-orange-950/30 dark:to-amber-950/30">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-orange-500" />
                    Tóm tắt đặt vé
                  </span>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    {selectedSeats.length} ghế
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {/* Selected Seats */}
                {selectedSeats.length > 0 && (
                  <div className="space-y-2">
                    <p className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                      <Ticket className="h-3 w-3" />
                      Ghế đã chọn:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {selectedSeats.map((s) => (
                        <Badge key={s.id} variant="outline" className="text-xs font-medium">
                          {s.seat_number}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-right text-sm font-semibold">
                      {formatPrice(totals.seatTotal)}
                    </p>
                  </div>
                )}

                {/* Selected Combos */}
                {selectedCombos.length > 0 && (
                  <div className="space-y-2">
                    <p className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                      <UtensilsCrossed className="h-3 w-3" />
                      Combo:
                    </p>
                    {selectedCombos.map((c) => (
                      <div key={c.id} className="flex justify-between text-sm">
                        <span className="truncate text-gray-600 dark:text-gray-400">{c.name}</span>
                        <span className="font-medium">{formatPrice(c.total_price)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Selected Menu Items */}
                {selectedMenuItems.length > 0 && (
                  <div className="space-y-2">
                    <p className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                      <Gift className="h-3 w-3" />
                      Món lẻ:
                    </p>
                    {selectedMenuItems.map((m) => (
                      <div key={m.item.id} className="flex justify-between text-sm">
                        <span className="truncate text-gray-600 dark:text-gray-400">
                          {m.item.name} x{m.quantity}
                        </span>
                        <span className="font-medium">
                          {formatPrice(m.item.price * m.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Selected Event */}
                {selectedEvent && (
                  <div className="space-y-1 rounded-lg bg-purple-50 p-2 dark:bg-purple-950/30">
                    <p className="flex items-center gap-1 text-xs font-semibold text-purple-700 dark:text-purple-300">
                      <Calendar className="h-3 w-3" />
                      Sự kiện áp dụng:
                    </p>
                    <p className="text-sm font-medium">{selectedEvent.name}</p>
                    {selectedEvent.discount && selectedEvent.discount.is_active && (
                      <div className="flex items-center gap-1 text-green-600">
                        <Tag className="h-3 w-3" />
                        <span className="text-xs font-bold">
                          Giảm {selectedEvent.discount.discount_percent}%
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <Separator />

                {/* Total Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tạm tính:</span>
                    <span>{formatPrice(totals.subtotal)}</span>
                  </div>

                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span className="flex items-center gap-1">
                        <Percent className="h-3 w-3" />
                        Giảm giá ({totals.discountPercent}%):
                      </span>
                      <span>-{formatPrice(totals.discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm text-amber-600">
                    <span>Phí dịch vụ ({totals.serviceVatPercent}%):</span>
                    <span>+{formatPrice(totals.serviceVat)}</span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-bold">Tổng cộng:</span>
                    <span className="text-2xl font-bold text-orange-600">
                      {formatPrice(totals.total)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  {!isHolding ? (
                    <Button
                      className="h-11 w-full bg-orange-500 text-base hover:bg-orange-600"
                      onClick={() => user?.id && handleHoldSeats(user.id)}
                      disabled={selectedSeats.length === 0 || holdLoading || !user?.id}
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      {holdLoading ? 'Đang xử lý...' : 'Giữ ghế (10 phút)'}
                    </Button>
                  ) : (
                    <>
                      <Button
                        className="h-11 w-full bg-gradient-to-r from-green-500 to-emerald-500 text-base hover:from-green-600 hover:to-emerald-600"
                        onClick={() => setConfirmDialogOpen(true)}
                        disabled={holdLoading}
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Thanh toán
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleCancelHold}
                        disabled={holdLoading}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        {holdLoading ? 'Đang hủy...' : 'Hủy giữ ghế'}
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Movie Info Card */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="h-48 overflow-hidden">
                <img
                  src={movie?.image || movie?.thumbnail || '/placeholder.png'}
                  alt={movie?.title}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardContent className="space-y-3 p-4">
                <h2 className="line-clamp-2 text-base font-bold leading-tight">{movie?.title}</h2>
                <Separator />
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Film className="h-4 w-4 text-orange-500" />
                    <span>{movie?.duration} phút</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    <span>{room?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="font-semibold">{start.time}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Xác nhận đặt vé
            </DialogTitle>
            <DialogDescription>Kiểm tra lại thông tin trước khi thanh toán</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              <img
                src={movie?.thumbnail || '/placeholder.png'}
                alt={movie?.title}
                className="h-24 w-16 rounded-md object-cover shadow"
              />
              <div>
                <p className="text-lg font-bold">{movie?.title}</p>
                <p className="text-sm text-gray-500">
                  {room?.name} • {start.time}
                </p>
                <div className="mt-1 flex gap-2">
                  <Badge>{room?.format?.name || '2D'}</Badge>
                  <Badge variant="outline">
                    {showTimeDetail.day_type === 'WEEKEND' ? 'Cuối tuần' : 'Ngày thường'}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Seat Details */}
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Ticket className="h-4 w-4" />
                Ghế đã chọn ({selectedSeats.length}):
              </p>
              <div className="max-h-32 space-y-1 overflow-y-auto">
                {selectedSeats.map((seat) => {
                  const seatType = seat.seat_type?.name || seat.seat_type?.type || 'Standard';
                  const price = getPrice(
                    room?.format?.id as string,
                    seat.seat_type?.id as string,
                    showTimeDetail.day_type as string
                  );
                  return (
                    <div
                      key={seat.id}
                      className="flex items-center justify-between rounded bg-gray-50 px-2 py-1 text-sm dark:bg-gray-800"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {seat.seat_number}
                        </Badge>
                        <span className="text-xs text-gray-500">{seatType}</span>
                      </div>
                      <span className="text-xs font-medium">{formatPrice(price)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Combos */}
            {selectedCombos.length > 0 && (
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <UtensilsCrossed className="h-4 w-4" />
                  Combo ({selectedCombos.length}):
                </p>
                <div className="space-y-2">
                  {selectedCombos.map((combo) => {
                    const details = selectedComboDetails.get(combo.id!);
                    return (
                      <div key={combo.id} className="rounded bg-gray-50 px-2 py-1 dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{combo.name}</span>
                          <span className="text-sm font-medium">
                            {formatPrice(combo.total_price || 0)}
                          </span>
                        </div>
                        {details?.combo_items && details.combo_items.length > 0 && (
                          <p className="mt-1 text-xs text-gray-500">
                            Bao gồm:{' '}
                            {details.combo_items
                              .map(
                                (item: any) =>
                                  `${item.menu_item?.name || 'Unknown'} x${item.quantity || 1}`
                              )
                              .join(', ')}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Menu Items */}
            {selectedMenuItems.length > 0 && (
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Gift className="h-4 w-4" />
                  Món lẻ ({selectedMenuItems.length}):
                </p>
                <div className="space-y-1">
                  {selectedMenuItems.map((m) => (
                    <div key={m.item.id} className="flex justify-between text-sm">
                      <span>
                        {m.item.name} x{m.quantity}
                      </span>
                      <span className="font-medium">{formatPrice(m.item.price * m.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Event */}
            {selectedEvent && (
              <div className="flex items-center justify-between rounded-lg bg-purple-50 p-2 dark:bg-purple-950/30">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Sự kiện: {selectedEvent.name}</span>
                </div>
                {selectedEvent.discount && selectedEvent.discount.is_active && (
                  <Badge className="bg-green-500">
                    -{selectedEvent.discount.discount_percent}%
                  </Badge>
                )}
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tạm tính:</span>
                <span>{formatPrice(totals.subtotal)}</span>
              </div>
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Giảm giá ({totals.discountPercent}%):</span>
                  <span>-{formatPrice(totals.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-orange-600">
                <span>Phí dịch vụ ({totals.serviceVatPercent}%):</span>
                <span>{formatPrice(totals.serviceVat)}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="text-lg font-bold">Tổng tiền:</span>
                <span className="text-2xl font-bold text-orange-600">
                  {formatPrice(totals.total)}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={onPayment}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Xác nhận thanh toán
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Combo Detail Dialog */}
      <Dialog open={comboDetailDialogOpen} onOpenChange={setComboDetailDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết Combo</DialogTitle>
          </DialogHeader>
          {selectedComboDetail && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                {selectedComboDetail.image && (
                  <img
                    src={selectedComboDetail.image}
                    alt={selectedComboDetail.name}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h3 className="text-lg font-bold">{selectedComboDetail.name}</h3>
                  <p className="text-sm text-gray-500">{selectedComboDetail.description}</p>
                  <p className="mt-1 text-lg font-bold text-orange-600">
                    {formatPrice(selectedComboDetail.total_price)}
                  </p>
                </div>
              </div>
              {selectedComboDetail.combo_items?.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-semibold">Bao gồm:</p>
                  <div className="space-y-1">
                    {selectedComboDetail.combo_items.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex justify-between rounded bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800"
                      >
                        <span>{item.menu_item?.name || 'Unknown'}</span>
                        <span>x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
