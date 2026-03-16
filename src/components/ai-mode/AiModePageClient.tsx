'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { StepProgressBar } from './StepProgressBar';
import { ChatPanel } from './ChatPanel';
import { MovieList } from '@/components/home/MovieList';
import { ShowTimeList } from '@/components/show-times/ShowTimeList';
import { TicketPriceList } from '@/components/ticketPrices/TicketPriceList';
import { EventList } from '@/components/events/EventList';
import { ComboList } from '@/components/combos/ComboList';
import { MenuItemList } from '@/components/menuItems/MenuItemList';
import { SeatMapView } from './SeatMapView';
import { PaymentMethodView } from './PaymentMethodView';
import { AiLoadingOverlay } from './AiLoadingOverlay';
import { useAiBookingStore } from '@/store/useAiBookingStore';
import type { MovieType } from '@/types/movie.type';
import type { MovieTypeType } from '@/types/movieType.type';
import type { ShowTimeType } from '@/types/showTime.type';
import type { TicketPriceType } from '@/types/ticketPrice.type';
import type { EventType } from '@/types/event.type';
import type { ComboType } from '@/types/combo.type';
import type { MenuItemType } from '@/types/menuItem.type';
import type { FormatType } from '@/types/format.type';
import type { SeatTypeDetailType } from '@/types/seatTypeDetail.type';
import type { PaginationMeta } from '@/types/pagination.type';

interface AiModePageClientProps {
  initialNowShowing: MovieType[];
  initialComingSoon: MovieType[];
  initialMovieTypes: MovieTypeType[];
  initialShowTimes: ShowTimeType[];
  initialTicketPrices: TicketPriceType[];
  initialEvents: EventType[];
  initialCombos: ComboType[];
  initialMenuItems: MenuItemType[];
  formats: FormatType[];
  seatTypes: SeatTypeDetailType[];
}

export function AiModePageClient({
  initialNowShowing,
  initialComingSoon,
  initialMovieTypes,
  initialShowTimes,
  initialTicketPrices,
  initialEvents,
  initialCombos,
  initialMenuItems,
  formats,
  seatTypes,
}: AiModePageClientProps) {
  const [chatPanelWidth, setChatPanelWidth] = useState(380);
  const isDraggingRef = useRef(false);

  const { currentStep, movieId, showTimeId, activeAction, chatData, chatMeta, isAiLoading } =
    useAiBookingStore();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const nextWidth = window.innerWidth - event.clientX;
      const clamped = Math.min(620, Math.max(320, nextWidth));
      setChatPanelWidth(clamped);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleStartDrag = () => {
    isDraggingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  // When chatData is set for an action, disable API fetching so components display AI data
  const hasAiData = !!(activeAction && activeAction !== 'other');
  const aiItems = Array.isArray(chatData) ? chatData : [];
  const aiMeta = (chatMeta ?? undefined) as PaginationMeta | undefined;
  const hasAiMovieData = useMemo(() => {
    if (aiItems.length === 0) return false;
    const firstItem = aiItems[0] as any;
    return !!firstItem?.title;
  }, [aiItems]);
  const hasAiNowShowingData = useMemo(() => {
    return hasAiData && activeAction === 'now-showing' && hasAiMovieData;
  }, [hasAiData, activeAction, hasAiMovieData]);
  const hasAiComingSoonData = useMemo(() => {
    return hasAiData && activeAction === 'comming-soon' && hasAiMovieData;
  }, [hasAiData, activeAction, hasAiMovieData]);
  const hasAiShowTimeData = useMemo(() => {
    if (!(hasAiData && activeAction === 'showtime') || aiItems.length === 0) return false;
    const firstItem = aiItems[0] as any;
    return !!firstItem?.start_time;
  }, [hasAiData, activeAction, aiItems]);
  // Resolve what content to render based on action & step
  const contentView = useMemo(() => {
    // If action is explicitly set (and not "other"/null), use it
    if (activeAction && activeAction !== 'other') {
      return activeAction;
    }
    // Otherwise derive from current step
    const stepViewMap: Record<number, string> = {
      0: 'now-showing',
      1: 'showtime',
      2: 'showtime-seat',
      3: 'addon',
      4: 'payment',
    };
    return stepViewMap[currentStep] || 'now-showing';
  }, [activeAction, currentStep]);

  const renderContent = () => {
    switch (contentView) {
      case 'now-showing':
        return (
          <MovieList
            key={hasAiData && activeAction === 'now-showing' ? 'ai' : 'default'}
            initialNowShowing={hasAiNowShowingData ? aiItems : initialNowShowing}
            initialComingSoon={initialComingSoon}
            initialMovieTypes={initialMovieTypes}
            initialNowShowingMeta={hasAiNowShowingData ? aiMeta : undefined}
            disableFetch={hasAiNowShowingData}
          />
        );
      case 'comming-soon':
        return (
          <MovieList
            key={hasAiData && activeAction === 'comming-soon' ? 'ai' : 'default'}
            initialNowShowing={initialNowShowing}
            initialComingSoon={hasAiComingSoonData ? aiItems : initialComingSoon}
            initialMovieTypes={initialMovieTypes}
            initialComingSoonMeta={hasAiComingSoonData ? aiMeta : undefined}
            disableFetch={hasAiComingSoonData}
          />
        );
      case 'showtime':
        return (
          <ShowTimeList
            key={hasAiData && activeAction === 'showtime' ? 'ai' : 'default'}
            initialShowTimes={hasAiShowTimeData ? aiItems : initialShowTimes}
            initialMeta={hasAiShowTimeData ? aiMeta : undefined}
            movieId={movieId || undefined}
            disableFetch={hasAiShowTimeData}
          />
        );
      case 'showtime-seat':
        return (
          <SeatMapView
            showTimeId={showTimeId}
            initialSeats={
              hasAiData && activeAction === 'showtime-seat' ? (aiItems as any) : undefined
            }
          />
        );
      case 'ticket-prices':
        return (
          <TicketPriceList
            key={hasAiData && activeAction === 'ticket-prices' ? 'ai' : 'default'}
            initialTicketPrices={
              hasAiData && activeAction === 'ticket-prices' ? aiItems : initialTicketPrices
            }
            initialMeta={hasAiData && activeAction === 'ticket-prices' ? aiMeta : undefined}
            formats={formats}
            seatTypes={seatTypes}
            disableFetch={hasAiData && activeAction === 'ticket-prices'}
          />
        );
      case 'event':
        return (
          <EventList
            key={hasAiData && activeAction === 'event' ? 'ai' : 'default'}
            initialEvents={hasAiData && activeAction === 'event' ? aiItems : initialEvents}
            initialMeta={hasAiData && activeAction === 'event' ? aiMeta : undefined}
            disableFetch={hasAiData && activeAction === 'event'}
          />
        );
      case 'combo':
        return (
          <ComboList
            key={hasAiData && activeAction === 'combo' ? 'ai' : 'default'}
            initialCombos={hasAiData && activeAction === 'combo' ? aiItems : initialCombos}
            initialMeta={hasAiData && activeAction === 'combo' ? aiMeta : undefined}
            disableFetch={hasAiData && activeAction === 'combo'}
          />
        );
      case 'menuItem':
        return (
          <MenuItemList
            key={hasAiData && activeAction === 'menuItem' ? 'ai' : 'default'}
            initialMenuItems={hasAiData && activeAction === 'menuItem' ? aiItems : initialMenuItems}
            initialMeta={hasAiData && activeAction === 'menuItem' ? aiMeta : undefined}
            disableFetch={hasAiData && activeAction === 'menuItem'}
          />
        );
      // SELECT_ADDON step: show all 3 vertically
      case 'addon':
        return (
          <div className="space-y-6">
            <ComboList initialCombos={initialCombos} />
            <MenuItemList initialMenuItems={initialMenuItems} />
            <EventList initialEvents={initialEvents} />
          </div>
        );
      // Payment step
      case 'payment':
        return (
          <PaymentMethodView initialMenuItems={initialMenuItems} initialCombos={initialCombos} />
        );
      default:
        return (
          <MovieList
            initialNowShowing={initialNowShowing}
            initialComingSoon={initialComingSoon}
            initialMovieTypes={initialMovieTypes}
          />
        );
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col overflow-hidden lg:flex-row">
      {/* Left — Content Area (3/4) */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Step Progress Bar */}
        <div className="shrink-0 p-4 pb-0">
          <StepProgressBar currentStep={currentStep} />
        </div>

        {/* Content Area */}
        <div className="relative flex-1 overflow-hidden">
          {isAiLoading && <AiLoadingOverlay />}
          <div className="h-full overflow-y-auto p-4">{renderContent()}</div>
        </div>
      </div>

      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize chat panel"
        onMouseDown={handleStartDrag}
        className="hidden w-2 shrink-0 cursor-col-resize bg-transparent transition-colors hover:bg-orange-200/70 dark:hover:bg-orange-800/60 lg:block"
      />

      {/* Right — Chat Panel */}
      <div
        className="w-full shrink-0 p-4 pt-0 lg:overflow-auto lg:pl-0"
        style={{ width: `${chatPanelWidth}px` }}
      >
        <ChatPanel initialMenuItems={initialMenuItems} initialCombos={initialCombos} />
      </div>
    </div>
  );
}
