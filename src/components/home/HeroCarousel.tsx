"use client"

import { useSlides } from "@/hooks/useSlides"
import type { SlideType } from "@/types/slide.type"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface HeroCarouselProps {
  initialSlides?: SlideType[]
}

export function HeroCarousel({ initialSlides = [] }: HeroCarouselProps) {
  const { data: slides, isLoading } = useSlides({
    initialData: initialSlides,
  })
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!slides || slides.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides])

  const goToPrevious = () => {
    if (!slides) return
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  const goToNext = () => {
    if (!slides) return
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }

  if (isLoading) {
    return (
      <div className="relative w-full h-[600px] bg-gradient-to-br from-gray-900 to-gray-800">
        <Skeleton className="w-full h-full" />
      </div>
    )
  }

  if (!slides || slides.length === 0) {
    return (
      <div className="relative w-full h-[600px] bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
        <p className="text-white text-xl">Không có slides để hiển thị</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[600px] overflow-hidden group">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentIndex
              ? "opacity-100 translate-x-0"
              : index < currentIndex
              ? "opacity-0 -translate-x-full"
              : "opacity-0 translate-x-full"
          }`}
        >
          {/* Background Image */}
          <div className="relative w-full h-full">
            <Image
              src={slide.image}
              alt={slide.title || "Slide"}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
            <div className="container mx-auto">
              <div className="max-w-2xl space-y-4">
                {slide.title && (
                  <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl animate-fade-in">
                    {slide.title}
                  </h1>
                )}
                {slide.content && (
                  <p className="text-lg md:text-xl text-gray-200 drop-shadow-lg line-clamp-3">
                    {slide.content}
                  </p>
                )}
                {slide.trailer && (
                  <Button
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-6 text-lg shadow-2xl shadow-orange-500/50 transition-all duration-300 hover:scale-105"
                    onClick={() => window.open(slide.trailer, "_blank")}
                  >
                    <Play className="mr-2 h-5 w-5 fill-white" />
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
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-8 h-2 bg-gradient-to-r from-orange-500 to-orange-600"
                : "w-2 h-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
