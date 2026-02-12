import { z } from "zod";

export const createComboItemSchema = z.object({
  combo_id: z.string().min(1, "ID combo là bắt buộc"),
  menu_item_id: z.string().min(1, "ID mặt hàng là bắt buộc"),
  quantity: z.number().int().min(1, "Số lượng phải ít nhất 1"),
  unit_price: z.number().gt(0, "Giá phải lớn hơn 0"),
  is_active: z.boolean().default(true).optional(),
});

export const updateComboItemSchema = createComboItemSchema.partial();
