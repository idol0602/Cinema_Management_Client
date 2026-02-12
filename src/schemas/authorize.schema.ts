import { z } from "zod";

export const createAuthorizeSchema = z.object({
  role_id: z.string().min(1, "ID vai trò là bắt buộc"),
  action_id: z.string().min(1, "ID hành động là bắt buộc"),
});

export const updateAuthorizeSchema = createAuthorizeSchema.partial();
