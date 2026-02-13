import { eventService } from "@/services/event.service"
import { EventList } from "@/components/events/EventList"
import type { EventType } from "@/types/event.type"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sự Kiện",
  description: "Cập nhật những sự kiện và khuyến mãi mới nhất tại Meta Cinema",
}

export default async function EventsPage() {
  const response = await eventService.findAndPaginate({
    page: 1,
    limit: 10,
    filter: { is_active: "true" },
  })

  const initialEvents = Array.isArray(response.data) ? (response.data as EventType[]) : []

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8">
      <EventList initialEvents={initialEvents} />
    </main>
  )
}
