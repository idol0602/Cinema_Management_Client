'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ArrowRight, Calendar, Eye, Gift, MapPin } from 'lucide-react';
import { EventDetailDialog } from '@/components/events/EventDetailDialog';
import type { EventType } from '@/types/event.type';

interface HomeEventCarouselProps {
  events: EventType[];
}

export function HomeEventCarousel({ events }: HomeEventCarouselProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  if (!events || events.length === 0) {
    return null;
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 sm:text-xl">
          Sự kiện nổi bật
        </h3>
      </div>

      <Carousel
        opts={{
          align: 'start',
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-3">
          {events.map((event) => (
            <CarouselItem
              key={event.id}
              className="basis-[82%] pl-3 sm:basis-[52%] lg:basis-[36%] xl:basis-[30%]"
            >
              <div className="group h-full overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="relative aspect-[16/9] bg-gray-100 dark:bg-gray-700">
                  {event.image ? (
                    <Image
                      src={event.image}
                      alt={event.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 30vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <Calendar className="h-10 w-10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-3 top-3 h-8 w-8 rounded-full bg-black/45 text-white hover:bg-black/65"
                    onClick={() => {
                      setSelectedEvent(event);
                      setOpenDetail(true);
                    }}
                    aria-label="Xem chi tiết sự kiện"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                    {event.is_in_combo && (
                      <Badge className="border-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                        <Gift className="mr-1 h-3 w-3" />
                        Combo
                      </Badge>
                    )}
                    {event.only_at_counter && (
                      <Badge className="border-0 bg-blue-500 text-white">
                        <MapPin className="mr-1 h-3 w-3" />
                        Tại quầy
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <p className="line-clamp-1 text-base font-semibold text-gray-900 dark:text-gray-100">
                    {event.name}
                  </p>
                  <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm text-gray-600 dark:text-gray-400">
                    {event.description || 'Thông tin chi tiết sự kiện đang được cập nhật.'}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3.5 w-3.5 text-orange-500" />
                    <span>
                      {formatDate(event.start_date)} - {formatDate(event.end_date)}
                    </span>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 top-[42%] hidden h-9 w-9 border-orange-200 bg-white/90 text-orange-600 hover:bg-orange-50 dark:border-gray-700 dark:bg-gray-800 dark:text-orange-400 sm:flex" />
        <CarouselNext className="right-2 top-[42%] hidden h-9 w-9 border-orange-200 bg-white/90 text-orange-600 hover:bg-orange-50 dark:border-gray-700 dark:bg-gray-800 dark:text-orange-400 sm:flex" />
      </Carousel>

      <div className="mt-5 flex justify-center">
        <Link href="/events">
          <Button
            variant="outline"
            className="border-orange-300 text-orange-700 hover:bg-orange-50 hover:text-orange-800 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-950/20"
          >
            Xem thêm sự kiện
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <EventDetailDialog event={selectedEvent} open={openDetail} onOpenChange={setOpenDetail} />
    </div>
  );
}
