export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELED" | "REFUND_PENDING" | "REFUNDED";

export interface OrderType {
  id?: string;
  discount_id?: string; // Reference to discounts table
  user_id: string; // Reference to users table
  movie_id: string; // Reference to movies table
  service_vat?: number;
  payment_status?: PaymentStatus;
  payment_method?: string;
  trans_id?: string;
  total_price: number;
  created_at?: string;
  requested_at?: string;
  // Joined table data
  movies?: {
    id: string;
    title: string;
    thumbnail: string;
    duration: number;
  };
  users?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export interface CreateOrderType {
  discount_id?: string | null; // Reference to discounts table
  user_id: string; // Reference to users table
  movie_id: string; // Reference to movies table
  service_vat?: number;
  payment_status?: PaymentStatus;
  payment_method?: string;
  trans_id?: string | null;
  total_price: number;
  created_at?: string;
  requested_at?: string;
}

export interface UpdateOrderType {
  discount_id?: string; // Reference to discounts table
  user_id?: string; // Reference to users table
  movie_id?: string; // Reference to movies table
  service_vat?: number;
  payment_status?: PaymentStatus;
  payment_method?: string;
  trans_id?: string;
  total_price?: number;
  created_at?: string;
  requested_at?: string;
}

export interface OrderDetails {
  order: {
    id: string;
    user_id: string;
    movie_id: string;
    discount_id: string | null;
    service_vat: number;
    payment_status: string;
    payment_method: string;
    trans_id: string | null;
    total_price: number;
    created_at: string;
    requested_at: string | null;
  };
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  movie: {
    id: string;
    title: string;
    director: string;
    country: string;
    description: string;
    release_date: string;
    duration: number;
    rating: number;
    trailer: string;
    image: string;
    thumbnail: string;
    movie_type: {
      id: string;
      type: string;
    };
  };
  tickets: Array<{
    id: string;
    checked_in: boolean;
    qr_code: string;
    ticket_price: {
      id: string;
      price: number;
      day_type: string;
    };
    showtime_seat: {
      id: string;
      status_seat: string;
      seat: {
        id: string;
        seat_number: string;
        seat_type: {
          id: string;
          name: string;
        };
      };
    };
    showtime: {
      id: string;
      start_time: string;
      end_time: string;
      day_type: string;
      room: {
        id: string;
        name: string;
        location: string;
        format: {
          id: string;
          name: string;
        };
      };
    };
  }>;
  menu_items: Array<{
    id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    item: {
      id: string;
      name: string;
      description: string;
      price: number;
      item_type: string;
      image: string;
    };
  }>;
  combos: Array<{
    id: string;
    combo: {
      id: string;
      name: string;
      description: string;
      total_price: number;
      items: Array<{
        id: string;
        quantity: number;
        unit_price: number;
        menu_item: {
          id: string;
          name: string;
          description: string;
          price: number;
          item_type: string;
          image: string;
        };
      }>;
    };
  }>;
  discount: {
    id: string;
    name: string;
    description: string;
    discount_percent: number;
    valid_from: string;
    valid_to: string;
  } | null;
  event: {
    id: string;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    image: string;
    only_at_counter: boolean;
    event_type: {
      id: string;
      name: string;
    };
  } | null;
}