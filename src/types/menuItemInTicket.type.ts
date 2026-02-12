export interface MenuItemInTicketType {
  id?: string;
  order_id: string;
  item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface CreateMenuItemInTicketType {
  order_id: string;
  item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface UpdateMenuItemInTicketType {
  order_id?: string;
  item_id?: string;
  quantity?: number;
  unit_price?: number;
  total_price?: number;
}