
export interface EventType {
  id?: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  image?: string;
  is_in_combo?: boolean;
  event_type_id?: string; // Reference to event_types table
  only_at_counter?: boolean;
  is_active?: boolean;
  created_at?: string;
}

export interface CreateEventType {
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  image?: string;
  is_in_combo?: boolean;
  event_type_id?: string; // Reference to event_types table
  only_at_counter?: boolean;
  is_active?: boolean;
  created_at?: string;
}

export interface UpdateEventType {
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  image?: string;
  is_in_combo?: boolean;
  event_type_id?: string; // Reference to event_types table
  only_at_counter?: boolean;
  is_active?: boolean;
  created_at?: string;
}