export interface DiscountType {
  id?: string;
  event_id?: string;
  name?: string;
  description?: string;
  discount_percent?: number;
  valid_from?: string;
  valid_to?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface CreateDiscountType {
  event_id?: string;
  name?: string;
  description?: string;
  discount_percent?: number;
  valid_from?: string;
  valid_to?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface UpdateDiscountType {
  event_id?: string;
  name?: string;
  description?: string;
  discount_percent?: number;
  valid_from?: string;
  valid_to?: string;
  is_active?: boolean;
  created_at?: string;
}