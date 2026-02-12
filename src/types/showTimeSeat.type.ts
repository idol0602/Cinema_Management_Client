export type SeatStatus = "AVAILABLE" | "HOLDING" | "BOOKED" | "FIXING";

export interface ShowTimeSeatType {
  id?: string;
  show_time_id: string;
  seat_id: string;
  status_seat?: SeatStatus;
}

export interface CreateShowTimeSeatType {
  show_time_id: string;
  seat_id: string;
  status_seat?: SeatStatus;
}

export interface UpdateShowTimeSeatType {
  show_time_id?: string;
  seat_id?: string;
  status_seat?: SeatStatus;
}