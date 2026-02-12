import { z } from "zod";

export const createSeatSchema = z.object({
  room_id: z.string().min(1, "ID phòng là bắt buộc"),
  seat_number: z
    .string()
    .min(1, "Số ghế là bắt buộc")
    .regex(/^[A-Za-z][0-9]+$/, "Số ghế phải bắt đầu bằng chữ cái và kết thúc bằng số (ví dụ: A19)"),
  type: z.string().min(1, "Loại ghế là bắt buộc"), // Reference to seat_types table
  is_active: z.boolean().default(true).optional(),
  created_at: z.string().default(new Date().toISOString()).optional(),
});

export const updateSeatSchema = createSeatSchema.partial();
