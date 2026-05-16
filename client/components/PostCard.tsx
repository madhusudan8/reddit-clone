"use client";

import Link from "next/link";
import { MessageCircle, Share2, Bookmark, MoreHorizontal, Loader2 } from "lucide-react";
import VoteButtons from "./VoteButtons";
import { formatNumber, formatTimeAgo } from "@/lib/formatters";
import { Post } from "@/lib/types";
import { useToggleSaveMutation } from "@/hooks/useApi";
import { useAuth, useClerk } from "@clerk/nextjs";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const saveMutation = useToggleSaveMutation();
  const isSaved = post.savedBy && post.savedBy.length > 0;

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    
    saveMutation.mutate(post.id);
  };

  return (
    <article
      className="group cursor-pointer rounded-2xl border border-gray-200/80 bg-white transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:shadow-zinc-950/50"
      id={`post-${post.id}`}
    >
      <div className="flex gap-0">
        {/* Vote sidebar - desktop */}
        <div className="hidden shrink-0 flex-col items-center rounded-l-2xl bg-gray-50/50 px-2 py-3 sm:flex dark:bg-zinc-800/30">
          <VoteButtons 
            targetId={post.id} 
            targetType="POST" 
            voteScore={post.voteScore} 
            userVote={post.votes?.[0]?.type} 
          />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 p-3 sm:p-4">
          {/* Community & Author info */}
          <div className="mb-2 flex items-center gap-2 text-xs">
            <Link
              href={`/r/${post.community.name}`}
              className="flex cursor-pointer items-center gap-1.5 font-semibold text-gray-900 transition-colors hover:text-orange-500 dark:text-zinc-100 dark:hover:text-orange-400"
            >
              {post.community.avatarUrl ? (
                <img src={post.community.avatarUrl} alt={post.community.name} className="h-5 w-5 rounded-full object-cover" />
              ) : (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-[10px] dark:bg-zinc-800">
                  {post.community.name.substring(0, 1).toUpperCase()}
                </span>
              )}
              r/{post.community.name}
            </Link>
            <span className="text-gray-400 dark:text-zinc-600">•</span>
            <span className="text-gray-500 dark:text-zinc-400">
              Posted by{" "}
              <Link
                href={`/u/${post.author.username}`}
                className="cursor-pointer transition-colors hover:text-orange-500 dark:hover:text-orange-400"
              >
                u/{post.author.username}
              </Link>
            </span>
            <span className="text-gray-400 dark:text-zinc-600">•</span>
            <span className="text-gray-400 dark:text-zinc-500">
              {formatTimeAgo(post.createdAt)}
            </span>
          </div>

          {/* Title */}
          <Link href={`/r/${post.community.name}/comments/${post.id}`}>
            <h2 className="mb-2 cursor-pointer text-lg font-semibold leading-snug text-gray-900 transition-colors group-hover:text-orange-600 dark:text-zinc-50 dark:group-hover:text-orange-400">
              {post.title}
            </h2>
          </Link>

          {/* Content preview */}
          {post.content && (
            <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-zinc-400">
              {post.content}
            </p>
          )}

          {/* Image */}
          {post.imageUrl && (
            <Link href={`/r/${post.community.name}/comments/${post.id}`}>
              <div className="mb-3 overflow-hidden rounded-xl">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] sm:h-80"
                />
              </div>
            </Link>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            {/* Mobile vote buttons */}
            <div className="sm:hidden">
              <VoteButtons
                targetId={post.id} 
                targetType="POST" 
                voteScore={post.voteScore} 
                userVote={post.votes?.[0]?.type}
                direction="horizontal"
              />
            </div>

            <Link
              href={`/r/${post.community.name}/comments/${post.id}`}
              className="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{formatNumber(post._count.comments)}</span>
            </Link>

            <button className="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button 
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                isSaved 
                  ? "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400" 
                  : "text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              {saveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
              )}
              <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
            </button>

            <button className="ml-auto cursor-pointer rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
