import { z } from "zod";

export const createMovieSchema = z.object({
  title: z.string().min(1, "Tiêu đề phim là bắt buộc"),
  director: z.string().min(1, "Đạo diễn là bắt buộc"),
  country: z.string().min(1, "Quốc gia là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  release_date: z
    .string()
    .default(new Date(Date.now()).toISOString())
    .optional(),
  duration: z.number().int().gt(45, "Thời lượng phải lớn hơn 45 phút").default(120).optional(),
  rating: z.number().min(0, "Đánh giá không thể âm").max(10, "Đánh giá không thể vượt quá 10").default(0).optional(),
  image: z.string().optional(),
  thumbnail: z.string().optional(),
  trailer: z.string().optional(),
  movie_type_id: z.string().min(1, "Loại phim là bắt buộc"),
  is_active: z.boolean().default(true).optional(),
  created_at: z.string().default(new Date().toISOString()).optional(),
});

export const updateMovieSchema = createMovieSchema.partial();
