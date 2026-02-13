import { z } from "zod";

export const createRateSchema = z.object({
  movie_id: z.string().min(1, "ID phim là bắt buộc"),
  user_id: z.string().min(1, "ID người dùng là bắt buộc"),
  stars: z.number().min(1, "Đánh giá phải ít nhất 1 sao").max(5, "Đánh giá không thể vượt quá 5 sao"),
  created_at: z.string().default(new Date(Date.now()).toISOString()).optional(),
});

export const updateRateSchema = createRateSchema.partial();
