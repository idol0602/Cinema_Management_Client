import { z } from "zod";

export const createTicketPriceSchema = z.object({
  format_id: z.string().min(1, "Định dạng phòng là bắt buộc"), // Reference to formats table
  seat_type_id: z.string().min(1, "Loại ghế là bắt buộc"), // Reference to seat_types table
  day_type: z.enum(["WEEKDAY", "WEEKEND"], { message: "Loại ngày phải là WEEKDAY hoặc WEEKEND" }),
  price: z.number().gt(0, "Giá phải lớn hơn 0"),
  is_active: z.boolean().default(true).optional(),
  created_at: z.string().default(new Date().toISOString()).optional(),
});

export const updateTicketPriceSchema = createTicketPriceSchema.partial();
