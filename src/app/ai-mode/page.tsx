import { movieService } from '@/services/movie.service';
import { showTimeService } from '@/services/showTime.service';
import { ticketPriceService } from '@/services/ticketPrice.service';
import { formatService } from '@/services/format.service';
import { seatTypeService } from '@/services/seatType.service';
import { eventService } from '@/services/event.service';
import { comboService } from '@/services/combo.service';
import { menuItemService } from '@/services/menuItem.service';
import { movieTypeService } from '@/services/movieType.service';
import { AiModePageClient } from '@/components/ai-mode/AiModePageClient';
import type { MovieType } from '@/types/movie.type';
import type { MovieTypeType } from '@/types/movieType.type';
import type { ShowTimeType } from '@/types/showTime.type';
import type { TicketPriceType } from '@/types/ticketPrice.type';
import type { EventType } from '@/types/event.type';
import type { ComboType } from '@/types/combo.type';
import type { MenuItemType } from '@/types/menuItem.type';
import type { FormatType } from '@/types/format.type';
import type { SeatTypeDetailType } from '@/types/seatTypeDetail.type';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Đặt Vé',
  description:
    'Trợ lý AI thông minh giúp bạn đặt vé xem phim, chọn suất chiếu, ghế ngồi và combo đồ ăn tại Meta Cinema',
};

export default async function AiModePage() {
  // Get current time to filter out past showtimes
  const now = new Date();

  const showTimeFilter = {
    is_active: true,
    start_time: {
      $gte: now.toISOString(),
    },
  };

  const [
    nowShowingResponse,
    comingSoonResponse,
    movieTypesResponse,
    showTimeResponse,
    ticketPriceResponse,
    formatResponse,
    seatTypeResponse,
    eventResponse,
    comboResponse,
    menuItemResponse,
  ] = await Promise.all([
    movieService.findNowShowing({ page: 1, limit: 10 }),
    movieService.findComingSoon({ page: 1, limit: 10 }),
    movieTypeService.findAll(),
    showTimeService.findAndPaginate({
      page: 1,
      limit: 50,
      sortBy: 'start_time:ASC',
      filter: showTimeFilter,
    }),
    ticketPriceService.findAndPaginate({
      page: 1,
      limit: 10,
      filter: { is_active: 'true' },
    }),
    formatService.findAll(),
    seatTypeService.findAll(),
    eventService.findAndPaginate({
      page: 1,
      limit: 10,
      filter: { is_active: 'true' },
    }),
    comboService.findAndPaginate({
      page: 1,
      limit: 10,
      filter: { is_active: 'true' },
    }),
    menuItemService.findAndPaginate({
      page: 1,
      limit: 10,
      filter: { is_active: 'true' },
    }),
  ]);

  const initialNowShowing = Array.isArray(nowShowingResponse.data)
    ? (nowShowingResponse.data as MovieType[])
    : [];
  const initialComingSoon = Array.isArray(comingSoonResponse.data)
    ? (comingSoonResponse.data as MovieType[])
    : [];
  const initialMovieTypes = Array.isArray(movieTypesResponse.data)
    ? (movieTypesResponse.data as MovieTypeType[])
    : [];
  const initialShowTimes = Array.isArray(showTimeResponse.data)
    ? (showTimeResponse.data as ShowTimeType[])
    : [];
  const initialTicketPrices = Array.isArray(ticketPriceResponse.data)
    ? (ticketPriceResponse.data as TicketPriceType[])
    : [];
  const formats = Array.isArray(formatResponse.data) ? (formatResponse.data as FormatType[]) : [];
  const seatTypes = Array.isArray(seatTypeResponse.data)
    ? (seatTypeResponse.data as SeatTypeDetailType[])
    : [];
  const initialEvents = Array.isArray(eventResponse.data)
    ? (eventResponse.data as EventType[])
    : [];
  const initialCombos = Array.isArray(comboResponse.data)
    ? (comboResponse.data as ComboType[])
    : [];
  const initialMenuItems = Array.isArray(menuItemResponse.data)
    ? (menuItemResponse.data as MenuItemType[])
    : [];

  // Extract pagination metadata
  const metaEvents = eventResponse.meta;
  const metaCombos = comboResponse.meta;
  const metaMenuItems = menuItemResponse.meta;

  return (
    <AiModePageClient
      initialNowShowing={initialNowShowing}
      initialComingSoon={initialComingSoon}
      initialMovieTypes={initialMovieTypes}
      initialShowTimes={initialShowTimes}
      initialTicketPrices={initialTicketPrices}
      initialEvents={initialEvents}
      initialCombos={initialCombos}
      initialMenuItems={initialMenuItems}
      formats={formats}
      seatTypes={seatTypes}
      metaEvents={metaEvents}
      metaCombos={metaCombos}
      metaMenuItems={metaMenuItems}
    />
  );
}
