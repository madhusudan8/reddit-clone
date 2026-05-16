"use client";

import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import { formatNumber } from "@/lib/formatters";
import { useVoteMutation } from "@/hooks/useApi";
import { useAuth, useClerk } from "@clerk/nextjs";

interface VoteButtonsProps {
  targetId: string;
  targetType: "POST" | "COMMENT";
  voteScore: number;
  userVote?: "UPVOTE" | "DOWNVOTE" | null;
  direction?: "vertical" | "horizontal";
}

export default function VoteButtons({
  targetId,
  targetType,
  voteScore,
  userVote,
  direction = "vertical",
}: VoteButtonsProps) {
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const voteMutation = useVoteMutation();

  const handleVote = (type: "UPVOTE" | "DOWNVOTE") => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    voteMutation.mutate({ targetId, targetType, type });
  };

  const isVertical = direction === "vertical";

  // Optimistic UI calculation (if mutation is pending)
  const isPending = voteMutation.isPending && voteMutation.variables?.targetId === targetId;
  const pendingType = isPending ? voteMutation.variables.type : userVote;
  
  // Calculate optimistic score
  let displayScore = voteScore;
  if (isPending && pendingType !== userVote) {
    if (pendingType === "UPVOTE") displayScore += userVote === "DOWNVOTE" ? 2 : 1;
    else if (pendingType === "DOWNVOTE") displayScore -= userVote === "UPVOTE" ? 2 : 1;
  } else if (isPending && pendingType === userVote) {
    // Removing vote
    displayScore += userVote === "UPVOTE" ? -1 : 1;
  }

  const currentVote = isPending ? (pendingType === userVote ? null : pendingType) : userVote;

  return (
    <div
      className={`flex items-center gap-0.5 ${
        isVertical ? "flex-col" : "flex-row"
      }`}
    >
      <button
        onClick={(e) => { e.preventDefault(); handleVote("UPVOTE"); }}
        disabled={isPending}
        className={`cursor-pointer rounded-md p-1 transition-all duration-200 ${
          currentVote === "UPVOTE"
            ? "text-orange-500 bg-orange-50 dark:bg-orange-950/40"
            : "text-gray-400 hover:bg-gray-100 hover:text-orange-500 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-orange-400"
        }`}
        aria-label="Upvote"
      >
        <ArrowBigUp
          className={`h-6 w-6 ${currentVote === "UPVOTE" ? "fill-current" : ""}`}
        />
      </button>
      <span
        className={`text-xs font-bold tabular-nums ${
          currentVote === "UPVOTE"
            ? "text-orange-500"
            : currentVote === "DOWNVOTE"
            ? "text-blue-500"
            : "text-gray-700 dark:text-zinc-300"
        }`}
      >
        {formatNumber(displayScore)}
      </span>
      <button
        onClick={(e) => { e.preventDefault(); handleVote("DOWNVOTE"); }}
        disabled={isPending}
        className={`cursor-pointer rounded-md p-1 transition-all duration-200 ${
          currentVote === "DOWNVOTE"
            ? "text-blue-500 bg-blue-50 dark:bg-blue-950/40"
            : "text-gray-400 hover:bg-gray-100 hover:text-blue-500 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-blue-400"
        }`}
        aria-label="Downvote"
      >
        <ArrowBigDown
          className={`h-6 w-6 ${currentVote === "DOWNVOTE" ? "fill-current" : ""}`}
        />
      </button>
    </div>
  );
}
