import { z } from "zod";

export const createTicketSchema = z.object({
  ticket_price_id: z.string().min(1, "ID giá vé là bắt buộc"),
  order_id: z.string().min(1, "ID đơn hàng là bắt buộc"),
  showtime_seat_id: z.string().min(1, "ID ghế suất chiếu là bắt buộc"),
  checked_in: z.boolean().default(false).optional,
  qr_code: z.string().optional(),
});

export const updateTicketSchema = createTicketSchema.partial();
