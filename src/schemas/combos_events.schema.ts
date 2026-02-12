import { z } from "zod";

export const createComboEventSchema = z.object({
  combo_id: z.string().min(1, "ID combo là bắt buộc"),
  event_id: z.string().min(1, "ID sự kiện là bắt buộc"),
});

export const updateComboEventSchema = createComboEventSchema.partial();
