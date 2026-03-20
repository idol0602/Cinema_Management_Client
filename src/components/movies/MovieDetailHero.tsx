'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { MovieType } from '@/types/movie.type';
import { Star, Clock, Calendar, Play, Ticket, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { TrailerDialog } from '@/components/commons/TrailerDialog';

interface MovieDetailHeroProps {
  movie: MovieType;
}

export function MovieDetailHero({ movie }: MovieDetailHeroProps) {
  const router = useRouter();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const handleBooking = () => {
    router.push(`/show-times?movieId=${movie.id}`);
  };

  return (
    <div className="relative">
      {/* Background Image with Overlay */}
      <div className="relative h-[500px] md:h-[600px]">
        <Image
          src={movie.image || movie.thumbnail || '/images/placeholder-movie.jpg'}
          alt={movie.title || 'Movie Image'}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-black/60 to-black/40 dark:from-gray-900" />

        {/* Back Button */}
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="absolute left-4 top-4 bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto -mt-32 px-4">
        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          {/* Poster */}
          <div className="mx-auto md:mx-0">
            <div className="relative aspect-[2/3] w-[300px] overflow-hidden rounded-xl border-4 border-white shadow-2xl dark:border-gray-800">
              <Image
                src={movie.thumbnail || movie.image || '/images/placeholder-movie.jpg'}
                alt={movie.title || 'Movie Image'}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6 rounded-xl bg-white p-8 shadow-xl dark:bg-gray-800">
            <div>
              <div className="mb-4 flex items-start justify-between gap-4">
                <h1 className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                  {movie.title}
                </h1>
                {movie.is_active && (
                  <Badge className="border-0 bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-1 text-white">
                    Đang chiếu
                  </Badge>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                {movie.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-semibold">{movie.rating.toFixed(1)}</span>
                  </div>
                )}
                {movie.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-5 w-5" />
                    <span>{movie.duration} phút</span>
                  </div>
                )}
                {movie.release_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-5 w-5" />
                    <span>
                      {format(new Date(movie.release_date), 'dd/MM/yyyy', { locale: vi })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Director */}
            {movie.director && (
              <div>
                <h3 className="mb-1 text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Đạo diễn
                </h3>
                <p className="text-lg font-medium">{movie.director}</p>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">Mô tả</h3>
              <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                {movie.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                onClick={handleBooking}
                size="lg"
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 font-semibold text-white shadow-lg hover:from-orange-600 hover:to-orange-700 md:flex-none"
              >
                <Ticket className="mr-2 h-5 w-5" />
                Đặt vé ngay
              </Button>
              {movie.trailer && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsTrailerOpen(true)}
                  className="flex-1 md:flex-none"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Xem Trailer
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <TrailerDialog
        open={isTrailerOpen}
        onOpenChange={setIsTrailerOpen}
        trailerUrl={movie.trailer}
        title={movie.title ? `Trailer - ${movie.title}` : 'Trailer'}
      />
    </div>
  );
}
