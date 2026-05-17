"use client";

import PostCard from "@/components/PostCard";
import PostSkeleton from "@/components/PostSkeleton";
import ErrorState from "@/components/ErrorState";
import { useCommunity, useCommunityPosts } from "@/hooks/useApi";
import { formatNumber, formatTimeAgo } from "@/lib/formatters";
import { Calendar, Shield, Users, Loader2 } from "lucide-react";
import { use } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth, useClerk } from "@clerk/nextjs";

interface CommunityPageProps {
  params: Promise<{ community: string }>;
}

export default function CommunityPage({ params }: CommunityPageProps) {
  const { community } = use(params);
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const queryClient = useQueryClient();

  const { data: communityData, isLoading: isLoadingCommunity } = useCommunity(community);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
    isFetching,
  } = useCommunityPosts(community);


  const joinMutation = useMutation({
    mutationFn: async () => {
      // Optimistic assumption: if it doesn't fail, we joined
      await api.post(`/communities/${community}/join`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community", community] });
    },
  });

  if (isLoadingCommunity) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!communityData) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="mb-2 text-6xl">🔍</p>
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-zinc-50">
          Community not found
        </h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          r/{community} doesn&apos;t exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Banner */}
      <div className="relative h-32 w-full overflow-hidden sm:h-48">
        {communityData.bannerUrl ? (
          <img
            src={communityData.bannerUrl}
            alt={`r/${community} banner`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-orange-400 to-red-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Community Info */}
      <div className="border-b border-gray-200 bg-white px-4 pb-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-start gap-4 sm:items-end">
            {/* Avatar */}
            <div className="relative z-10 -mt-10 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-orange-100 to-red-100 text-2xl shadow-lg sm:-mt-12 sm:h-24 sm:w-24 sm:text-4xl dark:border-zinc-900 dark:from-orange-900/30 dark:to-red-900/30 overflow-hidden">
              {communityData.avatarUrl ? (
                <img src={communityData.avatarUrl} alt={community} className="h-full w-full object-cover" />
              ) : (
                community.substring(0, 1).toUpperCase()
              )}
            </div>
            <div className="flex-1 pt-2">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-zinc-50">
                    r/{communityData.name}
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">
                    {formatNumber(communityData._count?.memberships || 0)} members
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      if (!isSignedIn) {
                        openSignIn();
                        return;
                      }
                      joinMutation.mutate();
                    }}
                    disabled={joinMutation.isPending}
                    className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 disabled:opacity-50"
                  >
                    {joinMutation.isPending ? "Joining..." : "Join"}
                  </button>
                  <button className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                    <Shield className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {communityData.description && (
            <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-zinc-400">
              {communityData.description}
            </p>
          )}

          {/* Stats */}
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-zinc-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Created {formatTimeAgo(communityData.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {formatNumber(communityData._count?.memberships || 0)} members
            </span>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-3 px-4 py-4">
        {status === "pending" ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : status === "error" ? (
          <ErrorState 
            title="Failed to load posts" 
            onRetry={() => refetch()} 
            isRetrying={isFetching} 
          />
        ) : data.pages[0].posts.length > 0 ? (
          <>
            {data.pages.map((page, i) => (
              <div key={i} className="space-y-3">
                {page.posts.map((post: any) => (
                  <div key={post.id} className="post-card-enter">
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            ))}
            
            {/* Load more */}
            {hasNextPage && (
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="rounded-full border border-gray-200 bg-white px-8 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-orange-300 hover:text-orange-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-orange-500/50 dark:hover:text-orange-400 disabled:opacity-50"
                >
                  {isFetchingNextPage ? "Loading..." : "Load More Posts"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200/80 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-2 text-4xl">📭</p>
            <h2 className="mb-1 text-lg font-semibold text-gray-900 dark:text-zinc-50">
              No posts yet
            </h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Be the first to post in r/{community}!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
