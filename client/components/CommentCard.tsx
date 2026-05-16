"use client";

import { Comment } from "@/lib/types";
import VoteButtons from "./VoteButtons";
import { formatTimeAgo } from "@/lib/formatters";

interface CommentCardProps {
  comment: Comment;
  depth?: number;
}

export default function CommentCard({ comment, depth = 0 }: CommentCardProps) {
  const maxDepth = 4;

  return (
    <div className={`${depth > 0 ? "ml-4 border-l-2 border-gray-100 pl-4 dark:border-zinc-800" : ""}`}>
      <div className="py-3">
        {/* Author info */}
        <div className="mb-2 flex items-center gap-2">
          {comment.author.avatarUrl ? (
            <img src={comment.author.avatarUrl} alt={comment.author.username} className="h-6 w-6 rounded-full object-cover" />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-orange-300 to-red-400 text-[10px] font-bold text-white">
              {comment.author.username.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-xs font-semibold text-gray-900 dark:text-zinc-100">
            u/{comment.author.username}
          </span>
          <span className="text-xs text-gray-400 dark:text-zinc-500">
            • {formatTimeAgo(comment.createdAt)}
          </span>
        </div>

        {/* Content */}
        <p className="mb-2 text-sm leading-relaxed text-gray-700 dark:text-zinc-300">
          {comment.content}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <VoteButtons
            targetId={comment.id}
            targetType="COMMENT"
            voteScore={comment.voteScore}
            userVote={comment.votes?.[0]?.type}
            direction="horizontal"
          />
          <button className="rounded-full px-2.5 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
            Reply
          </button>
          <button className="rounded-full px-2.5 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
            Share
          </button>
        </div>
      </div>

      {/* Nested replies */}
      {comment.replies &&
        comment.replies.length > 0 &&
        depth < maxDepth &&
        comment.replies.map((reply) => (
          <CommentCard key={reply.id} comment={reply} depth={depth + 1} />
        ))}

      {/* Show collapsed indicator for deep threads */}
      {comment.replies && comment.replies.length > 0 && depth >= maxDepth && (
        <button className="mb-2 mt-1 text-xs font-medium text-orange-500 hover:underline">
          Continue this thread →
        </button>
      )}
    </div>
  );
}
