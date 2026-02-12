export interface RoomType {
  id?: string;
  name: string;
  format_id: string; // Reference to formats table
  location?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface CreateRoomType {
  name: string;
  format_id: string; // Reference to formats table
  location?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface UpdateRoomType {
  name?: string;
  format_id?: string; // Reference to formats table
  location?: string;
  is_active?: boolean;
  created_at?: string;
}
