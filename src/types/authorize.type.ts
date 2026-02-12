export interface AuthorizeType {
  id?: string;
  role_id: string; // Reference to roles table
  action_id: string; // Reference to actions table
}

export interface CreateAuthorizeType {
  role_id: string; // Reference to roles table
  action_id: string; // Reference to actions table
}

export interface UpdateAuthorizeType {
  role_id?: string; // Reference to roles table
  action_id?: string; // Reference to actions table
}
