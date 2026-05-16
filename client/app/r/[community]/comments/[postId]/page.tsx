"use client";

import { useState, use } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  ArrowLeft,
  Send,
  Loader2,
} from "lucide-react";
import VoteButtons from "@/components/VoteButtons";
import CommentCard from "@/components/CommentCard";
import { formatNumber, formatTimeAgo } from "@/lib/formatters";
import { usePostDetail, usePostComments } from "@/hooks/useApi";
import { useAuth, useUser, useClerk } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface PostDetailPageProps {
  params: Promise<{ community: string; postId: string }>;
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const { community, postId } = use(params);
  const { isLoaded, isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const [commentText, setCommentText] = useState("");
  const [sortBy, setSortBy] = useState<"best" | "new" | "top">("best");

  const { data: post, isLoading: isLoadingPost } = usePostDetail(postId);
  const {
    data: commentsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingComments,
  } = usePostComments(postId, sortBy);

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await api.post("/comments", { postId, content });
      return response.data;
    },
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  if (isLoadingPost) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="mb-2 text-6xl">🔍</p>
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-zinc-50">
          Post not found
        </h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          This post may have been removed or deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      {/* Back button */}
      <Link
        href={`/r/${community}`}
        className="mb-4 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to r/{community}
      </Link>

      {/* Post */}
      <article className="animate-fade-in rounded-2xl border border-gray-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex gap-0">
          {/* Vote sidebar */}
          <div className="hidden shrink-0 flex-col items-center rounded-l-2xl bg-gray-50/50 px-3 py-4 sm:flex dark:bg-zinc-800/30">
            <VoteButtons 
              targetId={post.id} 
              targetType="POST" 
              voteScore={post.voteScore} 
              userVote={post.votes?.[0]?.type} 
            />
          </div>

          {/* Content */}
          <div className="flex-1 p-4 sm:p-6">
            {/* Meta */}
            <div className="mb-3 flex items-center gap-2 text-xs">
              <Link
                href={`/r/${post.community.name}`}
                className="flex items-center gap-1.5 font-semibold text-gray-900 hover:text-orange-500 dark:text-zinc-100"
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
                Posted by u/{post.author.username}
              </span>
              <span className="text-gray-400 dark:text-zinc-600">•</span>
              <span className="text-gray-400 dark:text-zinc-500">
                {formatTimeAgo(post.createdAt)}
              </span>
            </div>

            {/* Title */}
            <h1 className="mb-4 text-xl font-bold leading-snug text-gray-900 sm:text-2xl dark:text-zinc-50">
              {post.title}
            </h1>

            {/* Full content */}
            {post.content && (
              <p className="mb-4 text-sm leading-relaxed text-gray-700 sm:text-base dark:text-zinc-300">
                {post.content}
              </p>
            )}

            {/* Image */}
            {post.imageUrl && (
              <div className="mb-4 overflow-hidden rounded-xl">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full object-cover"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-1 border-t border-gray-100 pt-3 dark:border-zinc-800">
              <div className="sm:hidden">
                <VoteButtons
                  targetId={post.id} 
                  targetType="POST" 
                  voteScore={post.voteScore} 
                  userVote={post.votes?.[0]?.type} 
                  direction="horizontal"
                />
              </div>
              <button className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
                <MessageCircle className="h-4 w-4" />
                {formatNumber(post._count.comments)} Comments
              </button>
              <button className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
                <Share2 className="h-4 w-4" />
                Share
              </button>
              <button className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
                <Bookmark className="h-4 w-4" />
                Save
              </button>
              <button className="ml-auto rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Comment Input */}
      {isLoaded && isSignedIn ? (
        <div className="mt-4 animate-fade-in rounded-2xl border border-gray-200/80 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="mb-3 text-sm font-medium text-gray-700 dark:text-zinc-300">
            Comment as{" "}
            <span className="text-orange-500">u/{user?.username}</span>
          </p>
          <textarea
            placeholder="What are your thoughts?"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-orange-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-orange-500 dark:focus:bg-zinc-900"
            id="comment-input"
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={() => commentMutation.mutate(commentText)}
              disabled={!commentText.trim() || commentMutation.isPending}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {commentMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {commentMutation.isPending ? "Posting..." : "Comment"}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-gray-200/80 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">Log in or sign up to leave a comment</p>
          <button 
            onClick={() => openSignIn()}
            className="rounded-full bg-orange-500 px-4 py-1.5 text-xs font-semibold text-white transition-all hover:bg-orange-600"
          >
            Log In
          </button>
        </div>
      )}

      {/* Comments sort */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">
          Sort by:
        </span>
        {(["best", "new", "top"] as const).map((sort) => (
          <button
            key={sort}
            onClick={() => setSortBy(sort)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-all ${
              sortBy === sort
                ? "bg-gray-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            {sort}
          </button>
        ))}
      </div>

      {/* Comments list */}
      <div className="mt-4 space-y-0 rounded-2xl border border-gray-200/80 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900">
        {isLoadingComments ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : commentsData?.pages[0].comments.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500 dark:text-zinc-400">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          <>
            {commentsData?.pages.map((page, i) => (
              <div key={i}>
                {page.comments.map((comment: any) => (
                  <div
                    key={comment.id}
                    className="border-b border-gray-100 last:border-0 dark:border-zinc-800"
                  >
                    <CommentCard comment={comment} />
                  </div>
                ))}
              </div>
            ))}
            
            {hasNextPage && (
              <div className="py-4 text-center">
                <button 
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="text-sm font-medium text-orange-500 hover:underline"
                >
                  {isFetchingNextPage ? "Loading more comments..." : "Load more comments"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Sticky mobile comment input */}
      <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 p-3 backdrop-blur-xl lg:hidden dark:border-zinc-800 dark:bg-zinc-950/95">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add a comment..."
            onClick={() => !isSignedIn && openSignIn()}
            className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          />
          <button 
            onClick={() => !isSignedIn ? openSignIn() : commentMutation.mutate(commentText)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
