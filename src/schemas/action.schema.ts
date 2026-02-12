import { z } from "zod";

export const createActionSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  path: z.string().min(1, "Đường dẫn là bắt buộc"),
  method: z.enum(["GET", "POST", "PUT", "DELETE"], { message: "Phương thức phải là GET, POST, PUT hoặc DELETE" }),
  is_active: z.boolean().default(true).optional(),
  created_at: z.string().default(new Date().toISOString()).optional(),
});

export const updateActionSchema = createActionSchema.partial();
