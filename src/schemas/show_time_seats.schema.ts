import { z } from "zod";

export const seatTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const seatSchema = z.object({
  id: z.string(),
  seat_number: z.string(),
  type: z.string(),
  room_id: z.string(),
  seat_types: seatTypeSchema.nullable().optional(),
});

export const createShowTimeSeatSchema = z.object({
  show_time_id: z.string().min(1, "ID suất chiếu là bắt buộc"),
  seat_id: z.string().min(1, "ID ghế là bắt buộc"),
  status_seat: z
    .enum(["AVAILABLE", "HOLDING", "BOOKED", "FIXING"], { message: "Trạng thái ghế phải là AVAILABLE, HOLDING, BOOKED hoặc FIXING" })
    .default("AVAILABLE")
    .optional(),
});

export const updateShowTimeSeatSchema = createShowTimeSeatSchema.partial();

export const showTimeSeatResponseSchema = z.object({
  id: z.string(),
  show_time_id: z.string(),
  seat_id: z.string(),
  status_seat: z.enum(["AVAILABLE", "HOLDING", "BOOKED", "FIXING"]),
  seats: seatSchema.nullable().optional(),
});

export type SeatType = z.infer<typeof seatTypeSchema>;
export type Seat = z.infer<typeof seatSchema>;
export type ShowTimeSeat = z.infer<typeof showTimeSeatResponseSchema>;
export type CreateShowTimeSeat = z.infer<typeof createShowTimeSeatSchema>;
export type UpdateShowTimeSeat = z.infer<typeof updateShowTimeSeatSchema>;
