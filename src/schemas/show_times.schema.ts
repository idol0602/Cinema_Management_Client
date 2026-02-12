import { z } from "zod";
// NEED TO REVIEW
export const createShowTimeSchema = z.object({
  movie_id: z.string().min(1, "ID phim là bắt buộc"),
  room_id: z.string().min(1, "ID phòng là bắt buộc"),
  start_time: z.string().min(1, "Giờ bắt đầu là bắt buộc"),
  end_time: z.string().optional(),
  day_type: z.enum(["WEEKDAY", "WEEKEND"], { message: "Loại ngày phải là WEEKDAY hoặc WEEKEND" }).default("WEEKDAY"),
  is_active: z.boolean().default(true).optional(),
  created_at: z.string().default(new Date().toISOString()).optional(),
});

export const updateShowTimeSchema = createShowTimeSchema.partial();
export const bulkCreateShowTimeSchema = createShowTimeSchema.array();
