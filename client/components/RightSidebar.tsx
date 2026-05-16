"use client";

import CommunityCard from "./CommunityCard";
import CommunitySkeleton from "./CommunitySkeleton";
import { suggestedUsers } from "@/lib/mock-data"; 
import { useTrendingCommunities } from "@/hooks/useApi";
import { formatNumber } from "@/lib/formatters";

export default function RightSidebar() {
  const { data: trending, isLoading } = useTrendingCommunities();

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-80 shrink-0 overflow-y-auto px-4 py-4 xl:block">
      {/* Trending Communities */}
      <div className="rounded-2xl border border-gray-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-gray-100 px-4 py-3 dark:border-zinc-800">
          <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-100">
            🔥 Trending Communities
          </h3>
        </div>
        <div className="py-1">
          {isLoading ? (
            <div className="space-y-1">
              <CommunitySkeleton />
              <CommunitySkeleton />
              <CommunitySkeleton />
              <CommunitySkeleton />
              <CommunitySkeleton />
            </div>
          ) : trending && trending.length > 0 ? (
            trending.map((community: any, index: number) => (
              <CommunityCard
                key={community.name}
                name={community.name}
                icon={community.avatarUrl ? (
                  <img src={community.avatarUrl} alt={community.name} className="h-full w-full rounded-full object-cover" />
                ) : (
                  community.name.substring(0, 1).toUpperCase()
                )}
                members={formatNumber(community._count?.memberships || 0)}
                rank={index + 1}
              />
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">No trending communities yet.</div>
          )}
        </div>
        <div className="border-t border-gray-100 px-4 py-2.5 dark:border-zinc-800">
          <button className="w-full cursor-pointer rounded-full border border-orange-500 px-4 py-1.5 text-xs font-semibold text-orange-500 transition-all hover:bg-orange-50 dark:hover:bg-orange-950/20">
            View All
          </button>
        </div>
      </div>

      {/* Suggested Users */}
      <div className="mt-4 rounded-2xl border border-gray-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-gray-100 px-4 py-3 dark:border-zinc-800">
          <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-100">
            👥 Suggested Users
          </h3>
        </div>
        <div className="py-2">
          {suggestedUsers.map((user) => (
            <div
              key={user.name}
              className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800/60"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-red-100 text-sm dark:from-orange-900/30 dark:to-red-900/30">
                {user.avatar}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-zinc-100">
                  u/{user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  {user.karma} karma
                </p>
              </div>
              <button className="cursor-pointer rounded-full bg-gray-900 px-3 py-1 text-[11px] font-medium text-white transition-all hover:bg-gray-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 px-2 text-[11px] leading-5 text-gray-400 dark:text-zinc-600">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <a href="#" className="hover:underline">
            Help
          </a>
          <a href="#" className="hover:underline">
            About
          </a>
          <a href="#" className="hover:underline">
            Careers
          </a>
          <a href="#" className="hover:underline">
            Press
          </a>
          <a href="#" className="hover:underline">
            Blog
          </a>
          <a href="#" className="hover:underline">
            Terms
          </a>
          <a href="#" className="hover:underline">
            Privacy
          </a>
        </div>
        <p className="mt-2">Reddit Clone © 2026. All rights reserved.</p>
      </div>
    </aside>
  );
}
