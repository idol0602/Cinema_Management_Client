import { movieService } from "@/services/movie.service"
import {commentService} from "@/services/comment.service"
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
  const response = await commentService.findAndPaginate({
      page: 1,
      limit: 10,
      sortBy: "created_at:DESC",
      filter: { movie_id: params.id, is_active: "true" }
    })

    const initialComments = response.data || []

  if (error || !movie) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MovieDetailHero movie={movie} />
      <CommentSection movieId={params.id} initialComments={initialComments} />
    </div>
  )
}
