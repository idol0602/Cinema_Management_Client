export interface SlideType {
  id?: string;
  image: string;
  trailer?: string;
  title?: string;
  content?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface CreateSlideType {
  image: string;
  trailer?: string;
  title?: string;
  content?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface UpdateSlideType {
  image?: string;
  trailer?: string;
  title?: string;
  content?: string;
  is_active?: boolean;
  created_at?: string;
}