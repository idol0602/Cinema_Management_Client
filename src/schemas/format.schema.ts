import { z } from "zod";

export const createFormatSchema = z.object({
  name: z.string().min(2, "Tên định dạng phải có ít nhất 2 ký tự"),
  is_active: z.boolean().default(true).optional(),
  created_at: z.string().default(new Date().toISOString()).optional(),
});

export const updateFormatSchema = createFormatSchema.partial();
