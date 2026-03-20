'use client';

import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock3, Gift, Info, MapPin, Tag, Ticket } from 'lucide-react';
import type { EventType } from '@/types/event.type';
import type { EventTypeType } from '@/types/eventType.type';
import { useEventTypes } from '@/hooks/useEventTypes';

interface EventDetailDialogProps {
  event: EventType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventDetailDialog({ event, open, onOpenChange }: EventDetailDialogProps) {
  const { data: eventTypes } = useEventTypes();

  if (!event) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getEventTypeName = (typeId?: string) => {
    if (!typeId) return 'N/A';
    const eventType = eventTypes?.find((t: EventTypeType) => t.id === typeId);
    return eventType?.name || 'N/A';
  };

  const isOngoing = () => {
    const now = new Date();
    const start = event.start_date ? new Date(event.start_date) : null;
    const end = event.end_date ? new Date(event.end_date) : null;
    if (start && end) return now >= start && now <= end;
    if (start) return now >= start;
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-3xl overflow-y-auto border-orange-100 p-0 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="sr-only">Chi Tiết Sự Kiện</DialogTitle>
          <DialogDescription className="sr-only">Thông tin chi tiết về sự kiện</DialogDescription>
        </DialogHeader>

        <div>
          <div className="relative h-52 w-full overflow-hidden sm:h-64">
            {event.image ? (
              <Image
                src={event.image}
                alt={event.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 95vw, 900px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-orange-100 to-amber-100 dark:from-gray-800 dark:to-gray-700">
                <Ticket className="h-12 w-12 text-orange-500" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4">
              <p className="line-clamp-2 text-xl font-bold text-white sm:text-2xl">{event.name}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {isOngoing() && (
                  <Badge className="border-0 bg-green-500 text-white">Đang diễn ra</Badge>
                )}
                {event.only_at_counter && (
                  <Badge className="border-0 bg-blue-500 text-white">
                    <MapPin className="mr-1 h-3 w-3" />
                    Chỉ tại quầy
                  </Badge>
                )}
                {event.is_in_combo && (
                  <Badge className="border-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <Gift className="mr-1 h-3 w-3" />
                    Có trong combo
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-6">
            <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-4 dark:border-orange-900/20 dark:bg-orange-950/10">
              <div className="mb-2 flex items-center gap-2">
                <Info className="h-4 w-4 text-orange-600" />
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  Mô tả sự kiện
                </p>
              </div>
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {event.description || 'Thông tin chi tiết sự kiện đang được cập nhật.'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
                  <Tag className="h-4 w-4 text-orange-500" />
                  Loại sự kiện
                </div>
                <Badge
                  variant="outline"
                  className="border-orange-300 text-orange-700 dark:border-orange-700 dark:text-orange-300"
                >
                  {getEventTypeName(event.event_type_id)}
                </Badge>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  Kênh áp dụng
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {event.only_at_counter ? 'Chỉ áp dụng tại quầy' : 'Áp dụng online và tại quầy'}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  Bắt đầu
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {formatDate(event.start_date)}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
                  <Clock3 className="h-4 w-4 text-orange-500" />
                  Kết thúc
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {formatDate(event.end_date)}
                </p>
              </div>
            </div>

            <Separator />

            <div className="text-xs text-gray-500 dark:text-gray-400">
              Tạo lúc: <span className="font-medium">{formatDate(event.created_at)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
