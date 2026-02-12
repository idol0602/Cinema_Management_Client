import { z } from "zod";

export const chatWithAgentSchema = z.object({
  question: z.string().min(1, "Câu hỏi là bắt buộc"),
  session_id: z.string().min(1, "ID phiên là bắt buộc"),
});
