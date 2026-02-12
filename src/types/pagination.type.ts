// Query parameters for pagination
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string; // Format: "column:ASC" or "column:DESC"
  search?: string;
  searchBy?: string | string[],
  filter?: Record<string, any>;
}

// Meta information from backend response
export interface PaginationMeta {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  sortBy?: string[][];
  search?: string;
  searchBy?: string | string[];
  filter?: Record<string, any>;
}

// Links for navigation
export interface PaginationLinks {
  first?: string;
  previous?: string;
  current: string;
  next?: string;
  last?: string;
}

// Generic paginated response
export interface PaginatedResponse<T = unknown> {
  success: boolean;
  data: T[];
  meta?: PaginationMeta;
  links?: PaginationLinks;
  message?: string;
  error: string;
}

// Helper type for extracting data type
export type PaginatedData<T> = T extends PaginatedResponse<infer U> ? U : never;