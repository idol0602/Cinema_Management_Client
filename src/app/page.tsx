import { HeroCarousel } from "@/components/home/HeroCarousel"
import { MovieList } from "@/components/home/MovieList"
import { slideService } from "@/services/slide.service"
import { movieService } from "@/services/movie.service"
import { movieTypeService } from "@/services/movieType.service"
import type { SlideType } from "@/types/slide.type"
import type { MovieType } from "@/types/movie.type"
import type { MovieTypeType } from "@/types/movieType.type"

export default async function HomePage() {
  // Server-side data fetching using existing services
  const [slidesResponse, nowShowingResponse, comingSoonResponse, movieTypesResponse] = await Promise.all([
    slideService.getAll(),
    movieService.findNowShowing({
      page: 1,
      limit: 10,
    }),
    movieService.findComingSoon({
      page: 1,
      limit: 10,
    }),
    movieTypeService.findAll()
  ])

  // Extract data with type safety
  const initialSlides = (Array.isArray(slidesResponse.data) ? slidesResponse.data as SlideType[] : [])
    .filter((slide: SlideType) => slide.is_active)
  const initialNowShowing = Array.isArray(nowShowingResponse.data) ? nowShowingResponse.data as MovieType[] : []
  const initialComingSoon = Array.isArray(comingSoonResponse.data) ? comingSoonResponse.data as MovieType[] : []
  const initialMovieTypes = Array.isArray(movieTypesResponse.data) ? movieTypesResponse.data as MovieTypeType[] : []

  return (
    <main className="min-h-screen">
      <HeroCarousel initialSlides={initialSlides} />
      <MovieList 
        initialNowShowing={initialNowShowing}
        initialComingSoon={initialComingSoon}
        initialMovieTypes={initialMovieTypes}
      />
    </main>
  )
}
