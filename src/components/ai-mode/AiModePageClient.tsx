"use client"

import { useState } from "react"
import { StepProgressBar } from "./StepProgressBar"
import { ChatPanel } from "./ChatPanel"
import { ContentSwitcher, type ContentViewType } from "./ContentSwitcher"
import { MovieList } from "@/components/home/MovieList"
import { ShowTimeList } from "@/components/show-times/ShowTimeList"
import { TicketPriceList } from "@/components/ticketPrices/TicketPriceList"
import { EventList } from "@/components/events/EventList"
import { ComboList } from "@/components/combos/ComboList"
import { MenuItemList } from "@/components/menuItems/MenuItemList"
import { SeatMapView } from "./SeatMapView"
import { useAiBookingStore } from "@/store/useAiBookingStore"
import type { MovieType } from "@/types/movie.type"
import type { MovieTypeType } from "@/types/movieType.type"
import type { ShowTimeType } from "@/types/showTime.type"
import type { TicketPriceType } from "@/types/ticketPrice.type"
import type { EventType } from "@/types/event.type"
import type { ComboType } from "@/types/combo.type"
import type { MenuItemType } from "@/types/menuItem.type"
import type { FormatType } from "@/types/format.type"
import type { SeatTypeDetailType } from "@/types/seatTypeDetail.type"

interface AiModePageClientProps {
  initialNowShowing: MovieType[]
  initialComingSoon: MovieType[]
  initialMovieTypes: MovieTypeType[]
  initialShowTimes: ShowTimeType[]
  initialTicketPrices: TicketPriceType[]
  initialEvents: EventType[]
  initialCombos: ComboType[]
  initialMenuItems: MenuItemType[]
  formats: FormatType[]
  seatTypes: SeatTypeDetailType[]
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
  const [activeView, setActiveView] = useState<ContentViewType>("movies")
  const { currentStep, setCurrentStep, showTimeId } = useAiBookingStore()

  const handleStepClick = (step: number) => {
    setCurrentStep(step)
    // Map step to content view
    const stepViewMap: Record<number, ContentViewType> = {
      0: "movies",
      1: "showTimes",
      2: "seats",
      3: "combos",
      4: "ticketPrices",
    }
    if (stepViewMap[step]) {
      setActiveView(stepViewMap[step])
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Left — Content Area (3/4) */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Step Progress Bar */}
        <div className="p-4 pb-0 shrink-0">
          <StepProgressBar
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />
        </div>

        {/* Content Switcher */}
        <div className="px-4 pt-3 shrink-0">
          <ContentSwitcher
            activeView={activeView}
            onViewChange={setActiveView}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeView === "movies" && (
            <MovieList
              initialNowShowing={initialNowShowing}
              initialComingSoon={initialComingSoon}
              initialMovieTypes={initialMovieTypes}
            />
          )}
          {activeView === "showTimes" && (
            <ShowTimeList initialShowTimes={initialShowTimes} />
          )}
          {activeView === "seats" && (
            <SeatMapView showTimeId={showTimeId} />
          )}
          {activeView === "ticketPrices" && (
            <TicketPriceList
              initialTicketPrices={initialTicketPrices}
              formats={formats}
              seatTypes={seatTypes}
            />
          )}
          {activeView === "events" && (
            <EventList initialEvents={initialEvents} />
          )}
          {activeView === "combos" && (
            <ComboList initialCombos={initialCombos} />
          )}
          {activeView === "menuItems" && (
            <MenuItemList initialMenuItems={initialMenuItems} />
          )}
        </div>
      </div>

      {/* Right — Chat Panel (1/4) */}
      <div className="w-[380px] shrink-0 p-4 pl-0">
        <ChatPanel />
      </div>
    </div>
  )
}
