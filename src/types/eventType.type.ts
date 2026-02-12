export interface EventTypeType {
  id?: string;
  name: string;
  created_at?: string;
  is_active?: boolean;
}

export interface CreateEventTypeType {
  name: string;
  created_at?: string;
  is_active?: boolean;
}

export interface UpdateEventTypeType {
  name?: string;
  created_at?: string;
  is_active?: boolean;
}
