export interface TicketType {
  id?: string;
  ticket_price_id: string;
  order_id: string;
  showtime_seat_id: string;
  checked_in?: boolean;
  qr_code?: string;
}

export interface CreateTicketType {
  ticket_price_id: string;
  order_id: string;
  showtime_seat_id: string;
  checked_in?: boolean;
  qr_code?: string;
}

export interface UpdateTicketType {
  ticket_price_id?: string;
  order_id?: string;
  showtime_seat_id?: string;
  checked_in?: boolean;
  qr_code?: string;
}