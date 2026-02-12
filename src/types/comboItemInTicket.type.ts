export interface ComboItemInTicketType {
  id?: string;
  order_id: string;
  combo_id: string;
}

export interface CreateComboItemInTicketType {
  order_id: string;
  combo_id: string;
}

export interface UpdateComboItemInTicketType {
  order_id?: string;
  combo_id?: string;
}