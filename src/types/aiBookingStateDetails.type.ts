export interface AiBookingStateSeatDetail {
  id: string;
  seat?: {
    id: string;
    seat_number: string;
    seat_type?: {
      id: string;
      name?: string;
      type?: string;
    };
  };
  ticket_price?: {
    id?: string;
    price: number;
  };
}

export interface AiBookingStateComboDetail {
  id: string;
  name: string;
  description?: string;
  total_price: number;
  combo_items?: Array<{
    id: string;
    quantity: number;
    unit_price?: number;
    menu_item?: {
      id: string;
      name: string;
    };
  }>;
}

export interface AiBookingStateMenuItemDetail {
  item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  item?: {
    id: string;
    name: string;
    description?: string;
    item_type?: string;
    image?: string;
  };
}

export interface AiBookingStateDetails {
  user_id?: string;
  payment_method?: string;
  movie?: {
    id: string;
    title: string;
    thumbnail?: string;
    duration?: number;
  } | null;
  show_time?: {
    id: string;
    day_type?: string;
    start_time?: string;
    end_time?: string;
    room?: {
      id: string;
      name: string;
      format?: {
        id: string;
        name: string;
      };
    };
  } | null;
  show_time_seats: AiBookingStateSeatDetail[];
  combos: AiBookingStateComboDetail[];
  menu_items: AiBookingStateMenuItemDetail[];
  event?: {
    id: string;
    name: string;
  } | null;
  discount?: {
    id: string;
    discount_percent: number;
    is_active?: boolean;
  } | null;
  breakdown: {
    ticket_total: number;
    combo_total: number;
    menu_total: number;
    subtotal: number;
    discount_percent: number;
    discount_amount: number;
    service_vat_percent: number;
    service_vat: number;
    total: number;
  };
}
