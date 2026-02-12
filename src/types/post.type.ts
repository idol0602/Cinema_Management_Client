export interface PostType {
  id?: string;
  title: string;
  content: string;
  image?: string;
  user_id: string;
  is_active?: boolean;
  created_at?: string;
}

export interface CreatePostType {
  title: string;
  content: string;
  image?: string;
  user_id: string;
  is_active?: boolean;
  created_at?: string;
}

export interface UpdatePostType {
  title?: string;
  content?: string;
  image?: string;
  user_id?: string;
  created_at?: string;
  is_active?: boolean;
}