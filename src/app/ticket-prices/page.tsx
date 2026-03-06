import { ticketPriceService } from "@/services/ticketPrice.service"
import { formatService } from "@/services/format.service"
import { seatTypeService } from "@/services/seatType.service"
import { TicketPriceList } from "@/components/ticketPrices/TicketPriceList"
import type { TicketPriceType } from "@/types/ticketPrice.type"
import type { FormatType } from "@/types/format.type"
import type { SeatTypeDetailType } from "@/types/seatTypeDetail.type"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Giá Vé",
  description: "Bảng giá vé xem phim tại Meta Cinema theo loại ghế, định dạng và ngày trong tuần",
}

export default async function TicketPricesPage() {
  const [ticketPriceResponse, formatResponse, seatTypeResponse] = await Promise.all([
    ticketPriceService.findAndPaginate({
      page: 1,
      limit: 10,
      filter: { is_active: "true" },
    }),
    formatService.findAll(),
    seatTypeService.findAll(),
  ])

  const initialTicketPrices = Array.isArray(ticketPriceResponse.data) ? (ticketPriceResponse.data as TicketPriceType[]) : []
  const formats = Array.isArray(formatResponse.data) ? (formatResponse.data as FormatType[]) : []
  const seatTypes = Array.isArray(seatTypeResponse.data) ? (seatTypeResponse.data as SeatTypeDetailType[]) : []

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Bảng Giá Vé
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Tham khảo giá vé xem phim theo loại ghế, định dạng phim và ngày trong tuần
          </p>
        </div>

        <TicketPriceList
          initialTicketPrices={initialTicketPrices}
          formats={formats}
          seatTypes={seatTypes}
        />
      </div>
    </main>
  )
}
