import { HeroCarousel } from '@/components/home/HeroCarousel';
import { MovieList } from '@/components/home/MovieList';
import { slideService } from '@/services/slide.service';
import { movieService } from '@/services/movie.service';
import { movieTypeService } from '@/services/movieType.service';
import { Sparkles, Film, Popcorn } from 'lucide-react';
import type { SlideType } from '@/types/slide.type';
import type { MovieType } from '@/types/movie.type';
import type { MovieTypeType } from '@/types/movieType.type';

export default async function HomePage() {
  // Server-side data fetching using existing services
  const [slidesResponse, nowShowingResponse, comingSoonResponse, movieTypesResponse] =
    await Promise.all([
      slideService.getAll(),
      movieService.findNowShowing({
        page: 1,
        limit: 10,
      }),
      movieService.findComingSoon({
        page: 1,
        limit: 10,
      }),
      movieTypeService.findAll(),
    ]);

  // Extract data with type safety
  const initialSlides = (
    Array.isArray(slidesResponse.data) ? (slidesResponse.data as SlideType[]) : []
  ).filter((slide: SlideType) => slide.is_active);
  const initialNowShowing = Array.isArray(nowShowingResponse.data)
    ? (nowShowingResponse.data as MovieType[])
    : [];
  const initialComingSoon = Array.isArray(comingSoonResponse.data)
    ? (comingSoonResponse.data as MovieType[])
    : [];
  const initialMovieTypes = Array.isArray(movieTypesResponse.data)
    ? (movieTypesResponse.data as MovieTypeType[])
    : [];

  const metaNowShowing = nowShowingResponse.meta;
  const metaComingSoon = comingSoonResponse.meta;

  return (
    <main className="min-h-screen">
      <HeroCarousel initialSlides={initialSlides} />

      <section className="bg-gradient-to-b from-white to-orange-50/50 py-10 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl border border-orange-100 bg-white p-8 shadow-xl shadow-orange-500/5 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
              <Sparkles className="h-4 w-4" />
              META CINEMA Signature
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 md:text-4xl">
              META CINEMA - Trải nghiệm tuyệt đối điện ảnh
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300">
              Tại META CINEMA, mỗi khung hình được chăm chút để mang lại cảm xúc chân thực nhất: màn
              chiếu sắc nét, âm thanh sống động đa chiều, không gian hiện đại và dịch vụ tận tâm. Dù
              là bom tấn hành động hay những thước phim giàu cảm xúc, chúng tôi luôn muốn bạn có một
              buổi xem phim thật trọn vẹn và đáng nhớ.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4 dark:border-orange-900/30 dark:bg-orange-950/20">
                <Film className="h-5 w-5 text-orange-600" />
                <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Lịch chiếu đa dạng
                </p>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  Dễ dàng chọn khung giờ phù hợp cho mọi kế hoạch.
                </p>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4 dark:border-amber-900/30 dark:bg-amber-950/20">
                <Popcorn className="h-5 w-5 text-amber-600" />
                <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Combo phong phú
                </p>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  Nâng tầm trải nghiệm với combo và món ăn hấp dẫn.
                </p>
              </div>
              <div className="rounded-2xl border border-orange-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <Sparkles className="h-5 w-5 text-orange-500" />
                <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Đặt vé nhanh chóng
                </p>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  Từ chọn phim đến thanh toán, mọi bước đều mượt mà.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MovieList
        initialNowShowing={initialNowShowing}
        metaNowShowing={metaNowShowing}
        initialComingSoon={initialComingSoon}
        metaComingSoon={metaComingSoon}
        initialMovieTypes={initialMovieTypes}
        mode="all"
        title="Phim Chiếu Rạp"
        description="Khám phá những bộ phim đang chiếu và sắp ra mắt tại META CINEMA"
      />
    </main>
  );
}
