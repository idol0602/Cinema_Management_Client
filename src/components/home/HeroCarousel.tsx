'use client';

import { useSlides } from '@/hooks/useSlides';
import type { SlideType } from '@/types/slide.type';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TrailerDialog } from '@/components/commons/TrailerDialog';

interface HeroCarouselProps {
  initialSlides?: SlideType[];
}

export function HeroCarousel({ initialSlides = [] }: HeroCarouselProps) {
  const { data: slides, isLoading } = useSlides({
    initialData: initialSlides,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  useEffect(() => {
    if (!slides || slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides]);

  const goToPrevious = () => {
    if (!slides) return;
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    if (!slides) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  if (isLoading) {
    return (
      <div className="relative h-[420px] w-full bg-gradient-to-br from-gray-900 to-gray-800 sm:h-[520px] lg:h-[640px]">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (!slides || slides.length === 0) {
    return (
      <div className="relative flex h-[420px] w-full items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 sm:h-[520px] lg:h-[640px]">
        <p className="px-6 text-center text-lg text-white sm:text-xl">
          Không có slides để hiển thị
        </p>
      </div>
    );
  }

  return (
    <div className="group relative h-[420px] w-full overflow-hidden sm:h-[520px] lg:h-[640px]">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentIndex
              ? 'translate-x-0 opacity-100'
              : index < currentIndex
                ? '-translate-x-full opacity-0'
                : 'translate-x-full opacity-0'
          }`}
        >
          {/* Background Image */}
          <div className="relative h-full w-full">
            <Image
              src={slide.image}
              alt={slide.title || 'Slide'}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-12 lg:p-16">
            <div className="container mx-auto">
              <div className="max-w-2xl space-y-3 sm:space-y-4">
                {slide.title && (
                  <h1 className="text-2xl font-bold text-white drop-shadow-2xl sm:text-4xl md:text-5xl lg:text-6xl">
                    {slide.title}
                  </h1>
                )}
                {slide.content && (
                  <p className="line-clamp-3 text-sm text-gray-200 drop-shadow-lg sm:text-base md:text-lg lg:text-xl">
                    {slide.content}
                  </p>
                )}
                {slide.trailer && (
                  <Button
                    className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-2xl shadow-orange-500/50 transition-all duration-300 hover:scale-105 hover:from-orange-600 hover:to-orange-700 sm:px-6 sm:py-3 sm:text-base md:px-8 md:py-6 md:text-lg"
                    onClick={() => setIsTrailerOpen(true)}
                  >
                    <Play className="mr-2 h-4 w-4 fill-white sm:h-5 sm:w-5" />
                    Xem Trailer
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/30 sm:left-4 sm:h-12 sm:w-12 md:opacity-0 md:group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/30 sm:right-4 sm:h-12 sm:w-12 md:opacity-0 md:group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-8">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'h-2 w-7 bg-gradient-to-r from-orange-500 to-orange-600 sm:w-8'
                : 'h-2 w-2 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <TrailerDialog
        open={isTrailerOpen}
        onOpenChange={setIsTrailerOpen}
        trailerUrl={slides[currentIndex]?.trailer}
        title={slides[currentIndex]?.title ? `Trailer - ${slides[currentIndex]?.title}` : 'Trailer'}
      />
    </div>
  );
}
