export interface ComboType {
  id?: string;
  name: string;
  description?: string;
  total_price: number;
  image?: string;
  is_event_combo?: boolean;
  is_active?: boolean;
  created_at?: string;
}

export interface CreateComboType {
  name: string;
  description?: string;
  total_price: number;
  image?: string;
  is_event_combo?: boolean;
  is_active?: boolean;
  created_at?: string;
}

export interface UpdateComboType {
  name?: string;
  description?: string;
  total_price?: number;
  image?: string;
  is_event_combo?: boolean;
  is_active?: boolean;
  created_at?: string;
}

// --- Detail types for comboService.getDetails() response ---
import type { MenuItemType } from "./menuItem.type";
import type { MovieType } from "./movie.type";
import type { EventType } from "./event.type";
import type { DiscountType } from "./discount.type";

export interface ComboItemDetailType {
  id: string;
  combo_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  is_active: boolean;
  menu_item: MenuItemType;
}

export interface ComboMovieDetailType {
  id: string;
  combo_id: string;
  movie_id: string;
  movie: MovieType;
}

export interface ComboEventDetailType {
  id: string;
  combo_id: string;
  event_id: string;
  event: EventType & {
    discount?: DiscountType;
  };
}

export interface ComboDetailType extends ComboType {
  combo_items: ComboItemDetailType[];
  combo_movies: ComboMovieDetailType[];
  combos_events: ComboEventDetailType[];
}