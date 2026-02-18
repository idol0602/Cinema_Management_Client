import { z } from "zod";

export const createMovieSchema = z.object({
  title: z.string({ message: "Tên phim là bắt buộc" }).min(1, "Tên phim không được để trống"),
  director: z.string({ message: "Đạo diễn là bắt buộc" }).min(1, "Đạo diễn không được để trống"),
  country: z.string({ message: "Quốc gia là bắt buộc" }).min(1, "Quốc gia không được để trống"),
  description: z.string({ message: "Mô tả là bắt buộc" }).min(1, "Mô tả không được để trống"),
  release_date: z
    .string()
    .default(new Date(Date.now()).toISOString())
    .optional(),
  duration: z.coerce
    .number({ message: "Thời lượng phim là bắt buộc" })
    .int("Thời lượng phải là số nguyên")
    .gt(45, "Thời lượng phải lớn hơn 45 phút")
    .default(120)
    .optional(),
  rating: z.coerce
    .number({ message: "Đánh giá phim là bắt buộc" })
    .min(0, "Đánh giá tối thiểu là 0")
    .max(10, "Đánh giá tối đa là 10")
    .default(0)
    .optional(),
  image: z.string().optional(),
  thumbnail: z.string().optional(),
  trailer: z.string().optional(),
  is_active: z.boolean().default(true).optional(),
  created_at: z.string().default(new Date().toISOString()).optional(),
});

export const updateMovieSchema = createMovieSchema.partial();

export const createMovieWithTypesSchema = z.object({
  movie: createMovieSchema,
  movieTypes: z.array(z.string(), { message: "Vui lòng chọn ít nhất 1 thể loại" }).min(1, "Phải chọn ít nhất 1 thể loại").default([]),
});

export const updateMovieWithTypesSchema = z.object({
  movie: updateMovieSchema,
  movieTypes: z.array(z.string()).default([]),
});
