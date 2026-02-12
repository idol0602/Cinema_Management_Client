import { z } from "zod";

export const createComboItemInTicketSchema = z.object({
  order_id: z.string().min(1, "ID đơn hàng là bắt buộc"),
  combo_id: z.string().min(1, "ID combo là bắt buộc"),
});

export const updateComboItemInTicketSchema =
  createComboItemInTicketSchema.partial();
