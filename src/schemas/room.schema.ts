import { z } from "zod";

export const createRoomSchema = z.object({
  name: z.string().min(1, "Tên phòng là bắt buộc"),
  format_id: z.string().min(1, "Định dạng phòng là bắt buộc"), // Reference to formats table
  location: z.string().optional(),
  is_active: z.boolean().default(true).optional(),
  created_at: z.string().default(new Date().toISOString()).optional(),
});

export const updateRoomSchema = createRoomSchema.partial();
