"use client";

import PostCard from "@/components/PostCard";
import PostSkeleton from "@/components/PostSkeleton";
import ErrorState from "@/components/ErrorState";
import { useSavedPosts } from "@/hooks/useApi";
import { Bookmark, Loader2 } from "lucide-react";

export default function SavedPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
    isFetching,
  } = useSavedPosts();

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
          <Bookmark className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-50">
          Saved Posts
        </h1>
      </div>

      <div className="space-y-4">
        {status === "pending" ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : status === "error" ? (
          <ErrorState 
            title="Failed to load saved posts" 
            onRetry={() => refetch()} 
            isRetrying={isFetching} 
          />
        ) : data.pages[0].posts.length > 0 ? (
          <>
            {data.pages.map((page, i) => (
              <div key={i} className="space-y-4">
                {page.posts.map((post: any) => (
                  <div key={post.id} className="post-card-enter">
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            ))}
            
            {/* Load more */}
            {hasNextPage && (
              <div className="mt-8 flex justify-center">
                <button 
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="rounded-full border border-gray-200 bg-white px-8 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-orange-300 hover:text-orange-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-orange-500/50 dark:hover:text-orange-400 disabled:opacity-50"
                >
                  {isFetchingNextPage ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : "Load More Saved Posts"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-200/80 bg-white py-20 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 text-6xl">🔖</div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-zinc-50">
              No saved posts yet
            </h2>
            <p className="max-w-xs text-sm text-gray-500 dark:text-zinc-400">
              Posts you save will appear here for you to easily find later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
