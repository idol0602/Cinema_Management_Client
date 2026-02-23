"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { MovieType } from "@/types/movie.type"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Star, Calendar, Ticket } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface MovieCardProps {
  movie: MovieType,
  badgeTitle : string
}

export function MovieCard({ movie, badgeTitle }: MovieCardProps) {
  const router = useRouter()

  const handleBooking = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/show-times?movieId=${movie.id}`)
  }

  return (
    <Link href={`/movies/${movie.id}`}>
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white dark:bg-gray-800">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={movie.thumbnail || movie.image || "/images/placeholder-movie.jpg"}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Status Badge */}
          {movie.is_active && (
            <Badge className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
              {badgeTitle}
            </Badge>
          )}

          {/* Rating */}
          {movie.rating && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-white text-sm font-semibold">{movie.rating.toFixed(1)}</span>
            </div>
          )}

          {/* Booking Button - Shows on Hover */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              onClick={handleBooking}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg"
            >
              <Ticket className="w-4 h-4 mr-2" />
              Đặt vé
            </Button>
          </div>
        </div>

        <CardContent className="p-4 space-y-2">
          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            {movie.title}
          </h3>

          {/* Genres */}
          <div className="flex flex-wrap gap-1 min-h-[22px]">
            {(movie as any).movie_movie_types && (movie as any).movie_movie_types.length > 0 ? (
              <>
                {(movie as any).movie_movie_types.slice(0, 2).map((mmt: any) => (
                  <Badge
                    key={mmt.id || mmt.movie_type_id}
                    variant="outline"
                    className="text-xs px-1.5 py-0 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300"
                  >
                    {mmt.movie_types?.type || mmt.movie_type_id}
                  </Badge>
                ))}
                {(movie as any).movie_movie_types.length > 2 && (
                  <Badge
                    variant="outline"
                    className="text-xs px-1.5 py-0 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
                  >
                    +{(movie as any).movie_movie_types.length - 2}
                  </Badge>
                )}
              </>
            ) : null}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            {movie.duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{movie.duration} phút</span>
              </div>
            )}
            {movie.release_date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(movie.release_date), "dd/MM/yyyy", { locale: vi })}</span>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {movie.description}
          </p>

          <div className="pt-2">
            <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 w-0 group-hover:w-full transition-all duration-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
