import { z } from "zod";

export const createShowTimeSeatSchema = z.object({
  show_time_id: z.string().min(1, "ID suất chiếu là bắt buộc"),
  seat_id: z.string().min(1, "ID ghế là bắt buộc"),
  status_seat: z
    .enum(["AVAILABLE", "HOLDING", "BOOKED", "FIXING"], { message: "Trạng thái ghế phải là AVAILABLE, HOLDING, BOOKED hoặc FIXING" })
    .default("AVAILABLE")
    .optional(),
});

export const updateShowTimeSeatSchema = createShowTimeSeatSchema.partial();
