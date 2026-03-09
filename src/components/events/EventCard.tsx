"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { EventType } from "@/types/event.type"
import { Calendar, MapPin, Eye } from "lucide-react"

interface EventCardProps {
  event: EventType
  onViewDetail?: (event: EventType) => void
}

export function EventCard({ event, onViewDetail }: EventCardProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Check if event is currently active based on dates
  const isOngoing = () => {
    const now = new Date()
    const start = event.start_date ? new Date(event.start_date) : null
    const end = event.end_date ? new Date(event.end_date) : null
    if (start && end) return now >= start && now <= end
    if (start) return now >= start
    return false
  }

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-700">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600" />
          </div>
        )}

        {/* View Detail Button */}
        {onViewDetail && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 hover:bg-black/60 transition-all duration-300 z-10"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetail(event)
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}

        {/* Status badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {isOngoing() && (
            <Badge className="bg-green-500 text-white border-0 shadow-lg text-[11px]">
              🔥 Đang diễn ra
            </Badge>
          )}
          {event.only_at_counter && (
            <Badge className="bg-blue-500 text-white border-0 shadow-lg text-[11px]">
              <MapPin className="w-3 h-3 mr-1" />
              Chỉ tại quầy
            </Badge>
          )}
          {event.is_in_combo && (
            <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg text-[11px]">
              🎁 Có trong combo
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-2 mb-1">
          {event.name}
        </h3>

        {event.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">
            {event.description}
          </p>
        )}

        {/* Date Range */}
        {(event.start_date || event.end_date) && (
          <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
            <Calendar className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {formatDate(event.start_date)}
              {event.end_date && ` - ${formatDate(event.end_date)}`}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
