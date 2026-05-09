export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: PaginationMeta;
  errors?: ValidationError[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface AuthenticatedUser {
  id: string;
  clerkId: string;
  username: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  isAdmin: boolean;
}

export type SortOption = "latest" | "top" | "trending";
export type CommentSortOption = "best" | "new" | "top";
export type SearchType = "posts" | "communities" | "users" | "all";
