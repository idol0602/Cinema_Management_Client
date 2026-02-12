import { z } from "zod";

export const createOrderSchema = z.object({
  discount_id: z.string().nullable().optional(),
  user_id: z.string().min(1, "ID người dùng là bắt buộc"),
  movie_id: z.string().min(1, "ID phim là bắt buộc"),
  trans_id: z.string().nullable().optional(),
  service_vat: z.number().default(0).optional(),
  payment_status: z
    .enum(["PENDING", "COMPLETED", "FAILED", "CANCELED", "REFUND_PENDING", "REFUNDED"])
    .default("PENDING")
    .optional()
    .describe("Trạng thái thanh toán: PENDING, COMPLETED, FAILED, CANCELED, REFUND_PENDING, REFUNDED"),
  payment_method: z.string().optional(),
  total_price: z.number(),
  created_at: z.string().default(new Date().toISOString()).optional(),
  requested_at: z.string().default(new Date().toISOString()).optional(),
});

export const updateOrderSchema = createOrderSchema.partial();
