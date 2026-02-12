import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(4, "Tên phải có ít nhất 4 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().optional(),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  role: z.string().min(1, "Vai trò là bắt buộc"),
  is_active: z.boolean().default(true).optional(),
  is_online: z.boolean().default(false).optional(),
  last_seen: z.string().default(new Date().toISOString()).optional(),
  created_at: z.string().default(new Date().toISOString()).optional(),
});

export const updateUserSchema = createUserSchema.partial();
