'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Calendar, CheckCircle, Gift, Ticket, UtensilsCrossed } from 'lucide-react';
import type { AiBookingStateDetails } from '@/types/aiBookingStateDetails.type';

interface BookingConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingDetails: AiBookingStateDetails | null;
  onConfirm: () => void | Promise<void>;
  showConfirmButton?: boolean;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
};

const formatShowDateTime = (dateTime?: string) => {
  if (!dateTime) return 'Chưa có thông tin';
  const date = new Date(dateTime);
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export default function BookingConfirmationDialog({
  open,
  onOpenChange,
  bookingDetails,
  onConfirm,
  showConfirmButton = true,
}: BookingConfirmationDialogProps) {
  const movie = bookingDetails?.movie;
  const showTime = bookingDetails?.show_time;
  const seats = bookingDetails?.show_time_seats || [];
  const combos = bookingDetails?.combos || [];
  const menuItems = bookingDetails?.menu_items || [];
  const event = bookingDetails?.event;
  const discount = bookingDetails?.discount;
  const breakdown = bookingDetails?.breakdown;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Xác nhận thông tin đặt vé
          </DialogTitle>
          <DialogDescription> Kiểm tra lại thông tin trước khi thanh toán </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <img
              src={movie?.thumbnail || '/placeholder.png'}
              alt={movie?.title || ''}
              className="h-24 w-16 rounded-md object-cover shadow"
            />
            <div>
              <p className="text-lg font-bold">{movie?.title || 'Chưa chọn phim'}</p>
              <p className="text-sm text-gray-500">
                {showTime?.room?.name || 'Chưa có phòng chiếu'}
              </p>
              <p className="mt-1 text-xs font-medium text-orange-600 dark:text-orange-400">
                Bắt đầu: {formatShowDateTime(showTime?.start_time)}
              </p>
              <div className="mt-1 flex gap-2">
                <Badge>{showTime?.room?.format?.name || 'Chưa chọn'}</Badge>
                <Badge variant="outline">
                  {showTime?.day_type === 'WEEKEND' ? 'Cuối tuần' : 'Ngày thường'}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Ticket className="h-4 w-4" />
              Ghế đã chọn ({seats.length}):
            </p>
            <div className="max-h-32 space-y-1 overflow-y-auto">
              {seats.map((seat) => {
                const seatType =
                  seat.seat?.seat_type?.name || seat.seat?.seat_type?.type || 'Standard';
                return (
                  <div
                    key={seat.id}
                    className="flex items-center justify-between rounded bg-gray-50 px-2 py-1 text-sm dark:bg-gray-800"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {seat.seat?.seat_number || 'N/A'}
                      </Badge>
                      <span className="text-xs text-gray-500">{seatType}</span>
                    </div>
                    <span className="text-xs font-medium">
                      {formatPrice(seat.ticket_price?.price || 0)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {combos.length > 0 && (
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <UtensilsCrossed className="h-4 w-4" />
                Combo ({combos.length}):
              </p>
              <div className="space-y-2">
                {combos.map((combo) => (
                  <div key={combo.id} className="rounded bg-gray-50 px-2 py-1 dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{combo.name}</span>
                      <span className="text-sm font-medium">
                        {formatPrice(combo.total_price || 0)}
                      </span>
                    </div>
                    {!!combo.combo_items?.length && (
                      <p className="mt-1 text-xs text-gray-500">
                        Bao gom:{' '}
                        {combo.combo_items
                          .map(
                            (item) => `${item.menu_item?.name || 'Unknown'} x${item.quantity || 1}`
                          )
                          .join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {menuItems.length > 0 && (
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Gift className="h-4 w-4" />
                Món lẻ ({menuItems.length}):
              </p>
              <div className="space-y-1">
                {menuItems.map((menuItem) => (
                  <div
                    key={`${menuItem.item_id}-${menuItem.quantity}`}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {menuItem.item?.name || 'Unknown'} x{menuItem.quantity}
                    </span>
                    <span className="font-medium">{formatPrice(menuItem.total_price)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {event && (
            <div className="flex items-center justify-between rounded-lg bg-orange-50 p-2 dark:bg-orange-950/30">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-600" />
                <span className="text-sm">Sự kiện: {event.name}</span>
              </div>
              {discount?.is_active && (
                <Badge className="bg-green-500">-{discount.discount_percent || 0}%</Badge>
              )}
            </div>
          )}

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tạm tính:</span>
              <span>{formatPrice(breakdown?.subtotal || 0)}</span>
            </div>
            {(breakdown?.discount_amount || 0) > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Giảm giá ({breakdown?.discount_percent || 0}%):</span>
                <span>-{formatPrice(breakdown?.discount_amount || 0)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-orange-600">
              <span>Phí dịch vụ ({breakdown?.service_vat_percent || 0}%):</span>
              <span>{formatPrice(breakdown?.service_vat || 0)}</span>
            </div>
            <div className="flex items-center justify-between border-t pt-2">
              <span className="text-lg font-bold">Tổng tiền:</span>
              <span className="text-2xl font-bold text-orange-600">
                {formatPrice(breakdown?.total || 0)}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          {showConfirmButton && (
            <Button
              onClick={onConfirm}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Xác nhận thanh toán
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
