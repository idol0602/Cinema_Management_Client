export interface RoleType {
  id?: string;
  name: string;
  created_at?: string;
  is_active?: boolean;
}

export interface CreateRoleType {
  name: string;
  created_at?: string;
  is_active?: boolean;
}

export interface UpdateRoleType {
  name?: string;
  created_at?: string;
  is_active?: boolean;
}
