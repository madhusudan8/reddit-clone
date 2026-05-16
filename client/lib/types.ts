export interface User {
  id: string;
  clerkId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

export interface Community {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  isPrivate: boolean;
  createdAt: string;
  _count?: {
    memberships: number;
    posts: number;
  };
}

export interface Post {
  id: string;
  title: string;
  content: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  type: "TEXT" | "IMAGE" | "LINK";
  voteScore: number;
  createdAt: string;
  author: User;
  community: Community;
  _count: {
    comments: number;
    votes: number;
  };
  votes?: { type: "UPVOTE" | "DOWNVOTE" }[];
  savedBy?: { userId: string }[];
}

export interface Comment {
  id: string;
  content: string;
  voteScore: number;
  createdAt: string;
  author: User;
  replies: Comment[];
  _count: {
    replies: number;
    votes: number;
  };
  votes?: { type: "UPVOTE" | "DOWNVOTE" }[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: PaginationMeta;
}
