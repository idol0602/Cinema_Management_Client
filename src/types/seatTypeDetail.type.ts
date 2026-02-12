export interface SeatTypeDetailType {
  id?: string;
  name: string;
  created_at?: string;
  is_active?: boolean;
}

export interface CreateSeatTypeDetailType {
  name: string;
  created_at?: string;
  is_active?: boolean;
}

export interface UpdateSeatTypeDetailType {
  name?: string;
  created_at?: string;
  is_active?: boolean;
}
