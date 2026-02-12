export interface SeatTypeType {
  id?: string;
  name: string;
  created_at?: string;
  is_active?: boolean;
}

export interface CreateSeatTypeType {
  name: string;
  created_at?: string;
  is_active?: boolean;
}

export interface UpdateSeatTypeType {
  name?: string;
  created_at?: string;
  is_active?: boolean;
}
