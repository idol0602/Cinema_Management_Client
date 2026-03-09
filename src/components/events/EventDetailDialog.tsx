"use client"

import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Info, Calendar, ImageIcon, Tag, Store } from "lucide-react"
import type { EventType } from "@/types/event.type"
import type { EventTypeType } from "@/types/eventType.type"
import { useEventTypes } from "@/hooks/useEventTypes"

interface EventDetailDialogProps {
  event: EventType | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EventDetailDialog({ event, open, onOpenChange }: EventDetailDialogProps) {
  const { data: eventTypes } = useEventTypes()

  if (!event) return null

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A"
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getEventTypeName = (typeId?: string) => {
    if (!typeId) return "N/A"
    const eventType = eventTypes?.find((t: EventTypeType) => t.id === typeId)
    return eventType?.name || "N/A"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi Tiết Sự Kiện</DialogTitle>
          <DialogDescription>Thông tin chi tiết về sự kiện</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Event Name */}
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-orange-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Tên Sự Kiện</p>
              <Badge variant="secondary" className="mt-1 text-base px-3 py-1">
                {event.name}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="flex items-start gap-3">
            <div className="h-5 w-5 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Mô Tả</p>
              <p className="text-base mt-1">{event.description || "N/A"}</p>
            </div>
          </div>

          <Separator />

          {/* Image */}
          {event.image && (
            <>
              <div className="flex items-start gap-3">
                <ImageIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Hình Ảnh</p>
                  <div className="relative mt-2 rounded-lg overflow-hidden max-h-48">
                    <Image
                      src={event.image}
                      alt={event.name}
                      width={400}
                      height={200}
                      className="rounded-lg object-cover"
                    />
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Event Type */}
          <div className="flex items-start gap-3">
            <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Loại Sự Kiện</p>
              <Badge variant="outline" className="mt-1">
                {getEventTypeName(event.event_type_id)}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Sales Channel */}
          <div className="flex items-start gap-3">
            <Store className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Kênh Bán</p>
              <Badge
                variant={event.only_at_counter ? "secondary" : "outline"}
                className="mt-1"
              >
                {event.only_at_counter ? "Chỉ tại Quầy" : "Online & Quầy"}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Start Date */}
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-orange-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Ngày Bắt Đầu</p>
              <p className="text-base font-semibold mt-1">
                {formatDate(event.start_date)}
              </p>
            </div>
          </div>

          <Separator />

          {/* End Date */}
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-orange-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Ngày Kết Thúc</p>
              <p className="text-base font-semibold mt-1">
                {formatDate(event.end_date)}
              </p>
            </div>
          </div>

          <Separator />

          {/* Created Date */}
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Ngày Tạo</p>
              <p className="text-base font-semibold mt-1">
                {formatDate(event.created_at)}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
