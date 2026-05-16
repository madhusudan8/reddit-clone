"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Flame,
  Globe,
  Users,
  Bookmark,
  User,
  Settings,
  TrendingUp,
  Gamepad2,
  Tv,
  Music,
} from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";

const mainNavItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Popular", href: "/popular", icon: Flame },
  { label: "All", href: "/all", icon: Globe },
];

const personalItems = [
  { label: "Communities", href: "/communities", icon: Users },
  { label: "Saved Posts", href: "/saved", icon: Bookmark },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
];

const topicItems = [
  { label: "Gaming", href: "/r/gaming", icon: Gamepad2 },
  { label: "Movies & TV", href: "/r/movies", icon: Tv },
  { label: "Music", href: "/r/music", icon: Music },
  { label: "Trending", href: "/trending", icon: TrendingUp },
];

const recentCommunities = [
  { name: "r/programming", icon: "🖥️" },
  { name: "r/webdev", icon: "🌐" },
  { name: "r/photography", icon: "📷" },
  { name: "r/todayilearned", icon: "💡" },
];

export default function LeftSidebar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-gray-200 bg-white px-3 py-4 lg:block dark:border-zinc-800 dark:bg-zinc-950">
      {/* Main Navigation */}
      <div className="space-y-1">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400"
                  : "text-gray-700 hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-gray-100 dark:border-zinc-800" />

      {/* Personal */}
      <div>
        <h3 className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
          Personal
        </h3>
        <div className="space-y-1">
          {personalItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-gray-100 dark:border-zinc-800" />

      {/* Topics */}
      <div>
        <h3 className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
          Topics
        </h3>
        <div className="space-y-1">
          {topicItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-gray-100 dark:border-zinc-800" />

      {/* Recent Communities */}
      <div>
        <h3 className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
          Recent
        </h3>
        <div className="space-y-1">
          {recentCommunities.map((community) => (
            <Link
              key={community.name}
              href={`/${community.name}`}
              className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-700 transition-all duration-200 hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs dark:bg-zinc-800">
                {community.icon}
              </span>
              {community.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 p-4 dark:from-orange-950/20 dark:to-red-950/20">
        <p className="text-xs font-medium text-gray-700 dark:text-zinc-300">
          Create your own community
        </p>
        <p className="mt-1 text-[11px] text-gray-500 dark:text-zinc-400">
          Build and grow your community on Reddit
        </p>
        <button 
          onClick={() => {
            if (!isSignedIn) {
              openSignIn();
            } else {
              window.location.href = "/communities/create";
            }
          }}
          className="mt-3 w-full cursor-pointer rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1.5 text-xs font-medium text-white transition-all hover:brightness-110"
        >
          Create Community
        </button>
      </div>
    </aside>
  );
}
