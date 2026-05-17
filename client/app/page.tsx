"use client";

import Link from "next/link";
import PostCard from "@/components/PostCard";
import PostSkeleton from "@/components/PostSkeleton";
import ErrorState from "@/components/ErrorState";
import { Flame, Clock, TrendingUp, Sparkles, Loader2 } from "lucide-react";
import { useFeed } from "@/hooks/useApi";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

const sortOptions = [
  { label: "Best", value: "top", icon: Sparkles },
  { label: "Hot", value: "trending", icon: Flame },
  { label: "New", value: "latest", icon: Clock },
];

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const [sort, setSort] = useState<"latest" | "top" | "trending">("latest");
  const feedType = isLoaded && isSignedIn ? "home" : "all"; // Show 'all' feed if not signed in
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
    isFetching,
  } = useFeed(feedType, sort);

  return (
    <div className="px-4 py-4">
      {/* Create post prompt */}
      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-gray-200/80 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-200 to-gray-300 text-sm font-bold text-gray-500 dark:from-zinc-700 dark:to-zinc-600 dark:text-zinc-300">
          U
        </div>
        <Link href="/submit" className="flex-1">
          <div className="cursor-pointer rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-400 transition-colors hover:border-gray-300 hover:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-500 dark:hover:border-zinc-600">
            Create a post
          </div>
        </Link>
      </div>

      {/* Sort bar */}
      <div className="mb-4 flex items-center gap-1 rounded-2xl border border-gray-200/80 bg-white px-2 py-2 dark:border-zinc-800 dark:bg-zinc-900">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSort(option.value as any)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              sort === option.value
                ? "bg-gray-100 text-gray-900 dark:bg-zinc-800 dark:text-zinc-100"
                : "text-gray-500 hover:bg-gray-50 dark:text-zinc-400 dark:hover:bg-zinc-800/60"
            }`}
          >
            <option.icon className="h-4 w-4" />
            {option.label}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-3">
        {status === "pending" ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : status === "error" ? (
          <ErrorState 
            title="Failed to load feed" 
            onRetry={() => refetch()} 
            isRetrying={isFetching} 
          />
        ) : (
          data.pages.map((page, i) => (
            <div key={i} className="space-y-3">
              {page.posts.map((post: any) => (
                <div key={post.id} className="post-card-enter">
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          ))
        )}
      </div>


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
    </div>
  );
}
