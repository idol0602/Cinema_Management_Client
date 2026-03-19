import { showTimeService } from '@/services/showTime.service';
import { ShowTimeList } from '@/components/show-times/ShowTimeList';
import type { PaginationMeta } from '@/types/pagination.type';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lịch Chiếu - META CINEMA',
  description: 'Xem lịch chiếu phim, tìm suất chiếu phù hợp và đặt vé trực tuyến tại META CINEMA.',
};

interface ShowTimesPageProps {
  searchParams: Promise<{ movieId?: string }>;
}

export default async function ShowTimesPage({ searchParams }: ShowTimesPageProps) {
  const params = await searchParams;
  const movieId = params.movieId;

  // Get current time to filter out past showtimes
  const now = new Date();

  // Server-side fetch for initial data (SEO-friendly)
  const filter: Record<string, any> = {
    is_active: true,
    start_time: {
      $gte: now.toISOString(), // Only future showtimes
    },
  };
  if (movieId) {
    filter.movie_id = movieId;
  }

  const response = await showTimeService.findAndPaginate({
    page: 1,
    limit: 50,
    sortBy: 'start_time:ASC',
    filter,
  });

  const initialShowTimes = response.data || [];
  const metaShowTimes: PaginationMeta = response.meta || {
    totalItems: 0,
    itemsPerPage: 0,
    totalPages: 0,
    currentPage: 0,
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-8 dark:bg-gray-900">
      <ShowTimeList
        initialShowTimes={initialShowTimes}
        metaShowTimes={metaShowTimes}
        movieId={movieId}
      />
    </main>
  );
}
