export interface FormatType {
  id?: string;
  name: string;
  created_at?: string;
  is_active?: boolean;
}

export interface CreateFormatType {
  name: string;
  created_at?: string;
  is_active?: boolean;
}

export interface UpdateFormatType {
  name?: string;
  created_at?: string;
  is_active?: boolean;
}
