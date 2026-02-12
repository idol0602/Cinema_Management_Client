export type MenuItemTypeEnum = "FOOD" | "DRINK" | "GIFT";

export interface MenuItemType {
  id?: string;
  name: string;
  description?: string;
  price: number;
  item_type: MenuItemTypeEnum; // Reference to item_types table (FOOD, DRINK, GIFT)
  image?: string;
  num_instock?: number;
  is_active?: boolean;
  created_at?: string;
}

export interface CreateMenuItemType {
  name: string;
  description?: string;
  price: number;
  item_type: MenuItemTypeEnum; // Reference to item_types table (FOOD, DRINK, GIFT)
  image?: string;
  num_instock?: number;
  is_active?: boolean;
  created_at?: string;
}

export interface UpdateMenuItemType {
  name?: string;
  description?: string;
  price?: number;
  item_type?: MenuItemTypeEnum; // Reference to item_types table (FOOD, DRINK, GIFT)
  image?: string;
  num_instock?: number;
  is_active?: boolean;
  created_at?: string;
}