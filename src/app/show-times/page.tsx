import { showTimeService } from "@/services/showTime.service"
import { ShowTimeList } from "@/components/show-times/ShowTimeList"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Lịch Chiếu - META CINEMA",
  description: "Xem lịch chiếu phim, tìm suất chiếu phù hợp và đặt vé trực tuyến tại META CINEMA.",
}

interface ShowTimesPageProps {
  searchParams: Promise<{ movieId?: string }>
}

export default async function ShowTimesPage({ searchParams }: ShowTimesPageProps) {
  const params = await searchParams
  const movieId = params.movieId

  // Server-side fetch for initial data (SEO-friendly)
  const filter: Record<string, any> = { is_active: true }
  if (movieId) {
    filter.movie_id = movieId
  }

  const response = await showTimeService.findAndPaginate({
    page: 1,
    limit: 10,
    sortBy: "created_at:DESC",
    filter,
  })

  const initialShowTimes = response.data || []

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8">
      <ShowTimeList initialShowTimes={initialShowTimes} movieId={movieId} />
    </main>
  )
}
