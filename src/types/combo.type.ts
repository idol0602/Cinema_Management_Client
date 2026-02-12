export interface ComboType {
  id?: string;
  name: string;
  description?: string;
  total_price: number;
  image?: string;
  is_event_combo?: boolean;
  is_active?: boolean;
  created_at?: string;
}

export interface CreateComboType {
  name: string;
  description?: string;
  total_price: number;
  image?: string;
  is_event_combo?: boolean;
  is_active?: boolean;
  created_at?: string;
}

export interface UpdateComboType {
  name?: string;
  description?: string;
  total_price?: number;
  image?: string;
  is_event_combo?: boolean;
  is_active?: boolean;
  created_at?: string;
}