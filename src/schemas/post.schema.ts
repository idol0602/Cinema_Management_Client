import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc"),
  content: z.string().min(1, "Nội dung là bắt buộc"),
  image: z.string().optional(),
  user_id: z.string().min(1, "ID người dùng là bắt buộc"),
  created_at: z.string().default(new Date(Date.now()).toISOString()).optional(),
  is_active: z.boolean().default(true).optional(),
});

export const updatePostSchema = createPostSchema.partial();
