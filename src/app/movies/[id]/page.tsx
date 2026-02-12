import { movieService } from "@/services/movie.service"
import { MovieDetailHero } from "@/components/movies/MovieDetailHero"
import { CommentSection } from "@/components/movies/CommentSection"
import { notFound } from "next/navigation"

interface MovieDetailPageProps {
  params: {
    id: string
  }
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { data: movie, error } = await movieService.getById(params.id)

  if (error || !movie) {
    notFound()
  }

  console.log(movie)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MovieDetailHero movie={movie} />
      <CommentSection movieId={params.id} />
    </div>
  )
}
