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
  const [slidesResponse, moviesResponse, movieTypesResponse] = await Promise.all([
    slideService.getAll(),
    movieService.findAndPaginate({
      page: 1,
      limit: 10,
      filter: { is_active: "true" }
    }),
    movieTypeService.findAll()
  ])

  // Extract data with type safety
  const initialSlides = (Array.isArray(slidesResponse.data) ? slidesResponse.data as SlideType[] : [])
    .filter((slide: SlideType) => slide.is_active)
  const initialMovies = Array.isArray(moviesResponse.data) ? moviesResponse.data as MovieType[] : []
  const initialMovieTypes = Array.isArray(movieTypesResponse.data) ? movieTypesResponse.data as MovieTypeType[] : []

  return (
    <main className="min-h-screen">
      <HeroCarousel initialSlides={initialSlides} />
      <MovieList 
        initialMovies={initialMovies} 
        initialMovieTypes={initialMovieTypes}
      />
    </main>
  )
}
