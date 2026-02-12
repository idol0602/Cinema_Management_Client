import { z } from "zod";

export const createCommentSchema = z.object({
  movie_id: z.string().min(1, "ID phim là bắt buộc"),
  user_id: z.string().min(1, "ID người dùng là bắt buộc"),
  content: z.string().min(1, "Nội dung là bắt buộc"),
  created_at: z.string().default(new Date(Date.now()).toISOString()).optional(),
  is_active: z.boolean().default(true).optional(),
});

export const updateCommentSchema = createCommentSchema.partial();
