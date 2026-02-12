"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { MovieType } from "@/types/movie.type"
import { Star, Clock, Calendar, Play, Ticket, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { useRouter } from "next/navigation"

interface MovieDetailHeroProps {
  movie: MovieType
}

export function MovieDetailHero({ movie }: MovieDetailHeroProps) {
  const router = useRouter()

  const handleBooking = () => {
    // TODO: Implement booking logic
    console.log("Book ticket for movie:", movie.title)
  }

  return (
    <div className="relative">
      {/* Background Image with Overlay */}
      <div className="relative h-[500px] md:h-[600px]">
        <Image
          src={movie.image || movie.thumbnail || "/images/placeholder-movie.jpg"}
          alt={movie.title || "Movie Image"}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-900 via-black/60 to-black/40" />
        
        {/* Back Button */}
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          {/* Poster */}
          <div className="mx-auto md:mx-0">
            <div className="relative w-[300px] aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800">
              <Image
                src={movie.thumbnail || movie.image || "/images/placeholder-movie.jpg"}
                alt={movie.title || "Movie Image"}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl">
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  {movie.title}
                </h1>
                {movie.is_active && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 px-4 py-1">
                    Đang chiếu
                  </Badge>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                {movie.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-lg">{movie.rating.toFixed(1)}</span>
                  </div>
                )}
                {movie.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-5 h-5" />
                    <span>{movie.duration} phút</span>
                  </div>
                )}
                {movie.release_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-5 h-5" />
                    <span>{format(new Date(movie.release_date), "dd/MM/yyyy", { locale: vi })}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Director */}
            {movie.director && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Đạo diễn</h3>
                <p className="text-lg font-medium">{movie.director}</p>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Mô tả</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {movie.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                onClick={handleBooking}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg flex-1 md:flex-none"
              >
                <Ticket className="w-5 h-5 mr-2" />
                Đặt vé ngay
              </Button>
              {movie.trailer && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.open(movie.trailer, "_blank")}
                  className="flex-1 md:flex-none"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Xem Trailer
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
