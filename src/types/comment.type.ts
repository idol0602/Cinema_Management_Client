export interface CommentType {
  id?: string;
  movie_id: string;
  user_id: string;
  content: string;
  is_active?: boolean;
  created_at?: string;
}

export interface CreateCommentType {
  movie_id: string;
  user_id: string;
  content: string;
  is_active?: boolean;
  created_at?: string;
}

export interface UpdateCommentType {
  movie_id?: string;
  user_id?: string;
  content?: string;
  is_active?: boolean;
  created_at?: string;
}