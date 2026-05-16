import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse, PaginationMeta, Post, Comment, Community } from "@/lib/types";

// ------------------------------------
// FEED & POSTS
// ------------------------------------

export function useFeed(type: "home" | "popular" | "all" = "home", sort: "latest" | "top" | "trending" = "latest") {
  return useInfiniteQuery({
    queryKey: ["feed", type, sort],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<any, ApiResponse<Post[]>>(`/feed/${type}`, {
        params: { page: pageParam, limit: 10, sort },
      });
      return {
        posts: response.data,
        pagination: response.pagination as PaginationMeta,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined,
  });
}

export function useCommunityPosts(communityName: string, sort: "latest" | "top" | "trending" = "latest") {
  return useInfiniteQuery({
    queryKey: ["posts", "community", communityName, sort],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<any, ApiResponse<Post[]>>("/posts", {
        params: { communityName, page: pageParam, limit: 10, sort },
      });
      return {
        posts: response.data,
        pagination: response.pagination as PaginationMeta,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined,
    enabled: !!communityName,
  });
}

export function usePostDetail(postId: string) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const response = await api.get<any, ApiResponse<Post>>(`/posts/${postId}`);
      return response.data;
    },
    enabled: !!postId,
  });
}

// ------------------------------------
// COMMENTS
// ------------------------------------

export function usePostComments(postId: string, sort: "best" | "new" | "top" = "best") {
  return useInfiniteQuery({
    queryKey: ["comments", postId, sort],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<any, ApiResponse<Comment[]>>(`/comments/post/${postId}`, {
        params: { page: pageParam, limit: 20, sort },
      });
      return {
        comments: response.data,
        pagination: response.pagination as PaginationMeta,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined,
    enabled: !!postId,
  });
}

// ------------------------------------
// COMMUNITIES
// ------------------------------------

export function useCommunity(name: string) {
  return useQuery({
    queryKey: ["community", name],
    queryFn: async () => {
      const response = await api.get<any, ApiResponse<Community>>(`/communities/${name}`);
      return response.data;
    },
    enabled: !!name,
  });
}

export function useTrendingCommunities() {
  return useQuery({
    queryKey: ["communities", "trending"],
    queryFn: async () => {
      const response = await api.get<any, ApiResponse<Community[]>>("/communities/trending", { params: { limit: 5 } });
      return response.data;
    },
  });
}

export function useCommunitiesList(search?: string) {
  return useQuery({
    queryKey: ["communities", "list", search],
    queryFn: async () => {
      const response = await api.get<any, ApiResponse<Community[]>>("/communities", { 
        params: { search, limit: 20 } 
      });
      return response.data;
    },
  });
}

export function useSearch(q: string, type: "all" | "posts" | "communities" | "users" = "all") {
  return useQuery({
    queryKey: ["search", q, type],
    queryFn: async () => {
      const response = await api.get<any, ApiResponse<any>>("/search", { params: { q, type } });
      return response.data;
    },
    enabled: q.length > 1,
  });
}

// ------------------------------------
// VOTING
// ------------------------------------

export function useVoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      targetId,
      targetType,
      type,
    }: {
      targetId: string;
      targetType: "POST" | "COMMENT";
      type: "UPVOTE" | "DOWNVOTE";
    }) => {
      const response = await api.post<any, ApiResponse<any>>("/votes", { targetId, targetType, type });
      return response.data;
    },
    onSettled: (_, __, variables) => {
      // Invalidate relevant queries based on what was voted on
      if (variables.targetType === "POST") {
        queryClient.invalidateQueries({ queryKey: ["post", variables.targetId] });
        queryClient.invalidateQueries({ queryKey: ["feed"] });
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["comments"] });
      }
    },
  });
}

export function useCreatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postData: {
      title: string;
      content?: string;
      imageUrl?: string;
      linkUrl?: string;
      type: "TEXT" | "IMAGE" | "LINK";
      communityId: string;
    }) => {
      const response = await api.post<any, ApiResponse<Post>>("/posts", postData);
      return response.data;
    },
    onSuccess: (newPost) => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "community", newPost.community.name] });
    },
  });
}

export function useSavedPosts() {
  return useInfiniteQuery({
    queryKey: ["posts", "saved"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<any, ApiResponse<Post[]>>("/posts/saved", {
        params: { page: pageParam, limit: 10 },
      });
      return {
        posts: response.data,
        pagination: response.pagination as PaginationMeta,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined,
  });
}

export function useToggleSaveMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await api.post<any, ApiResponse<{ saved: boolean }>>(`/posts/${postId}/save`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", "saved"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}
