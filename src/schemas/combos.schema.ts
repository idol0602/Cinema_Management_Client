import { z } from "zod";

export const createComboSchema = z.object({
  name: z.string().min(1, "Tên combo là bắt buộc"),
  description: z.string().optional(),
  total_price: z.number().gt(0, "Giá phải lớn hơn 0"),
  image: z.string().optional(),
  is_event_combo: z.boolean().default(false).optional(),
  is_active: z.boolean().default(true).optional(),
  created_at: z.string().default(new Date().toISOString()).optional(),
});

export const updateComboSchema = createComboSchema.partial();
