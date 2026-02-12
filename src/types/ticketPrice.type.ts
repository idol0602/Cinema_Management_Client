export type DayType = "WEEKDAY" | "WEEKEND";

export interface TicketPriceType {
  id?: string;
  format_id: string; // Reference to formats table
  seat_type_id: string; // Reference to seat_types table
  day_type: DayType;
  price: number;
  is_active?: boolean;
  created_at?: string;
}

export interface CreateTicketPriceType {
  format_id: string; // Reference to formats table
  seat_type_id: string; // Reference to seat_types table
  day_type: DayType;
  price: number;
  is_active?: boolean;
  created_at?: string;
}

export interface UpdateTicketPriceType {
  format_id?: string; // Reference to formats table
  seat_type_id?: string; // Reference to seat_types table
  day_type?: DayType;
  price?: number;
  is_active?: boolean;
  created_at?: string;
}