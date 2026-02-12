import { z } from "zod";

export const createMenuItemInTicketSchema = z.object({
  order_id: z.string().min(1, "ID đơn hàng là bắt buộc"),
  item_id: z.string().min(1, "ID mặt hàng là bắt buộc"), // Reference to menu_items table
  quantity: z.number().int().min(1, "Số lượng phải ít nhất 1"),
  unit_price: z.number().gt(0, "Giá phải lớn hơn 0"),
  total_price: z.number().gt(0, "Tổng giá phải lớn hơn 0"),
});

export const updateMenuItemInTicketSchema =
  createMenuItemInTicketSchema.partial();
