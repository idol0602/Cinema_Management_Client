export type ActionMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface ActionType {
  id?: string;
  name: string;
  path: string;
  method: ActionMethod;
  created_at?: string;
  is_active?: boolean;
}

export interface CreateActionType {
  name: string;
  path: string;
  method: ActionMethod;
  created_at?: string;
  is_active?: boolean;
}

export interface UpdateActionType {
  name?: string;
  path?: string;
  method?: ActionMethod;
  created_at?: string;
  is_active?: boolean;
}
