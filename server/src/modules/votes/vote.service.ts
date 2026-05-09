import { VoteType, VoteTargetType } from "@prisma/client";
import { voteRepository } from "./vote.repository";
import { postRepository } from "../posts/post.repository";
import { commentRepository } from "../comments/comment.repository";
import { ApiError } from "../../utils/api-error";

export const voteService = {
  /**
   * Cast or toggle a vote.
   * - If no existing vote → create it
   * - If same vote type → remove it (toggle off)
   * - If different vote type → switch it
   */
  async castVote(userId: string, data: {
    type: string;
    targetType: string;
    targetId: string;
  }) {
    const voteType = data.type as VoteType;
    const targetType = data.targetType as VoteTargetType;

    // Verify target exists
    if (targetType === "POST") {
      const post = await postRepository.findById(data.targetId);
      if (!post) throw ApiError.notFound("Post not found");
    } else {
      const comment = await commentRepository.findById(data.targetId);
      if (!comment) throw ApiError.notFound("Comment not found");
    }

    // Check for existing vote
    const existing = await voteRepository.findExistingVote(userId, data.targetId, targetType);

    let result: { action: "created" | "removed" | "changed"; voteType: string };

    if (!existing) {
      // Create new vote
      await voteRepository.createVote({
        userId,
        type: voteType,
        targetType,
        targetId: data.targetId,
      });
      result = { action: "created", voteType: data.type };
    } else if (existing.type === voteType) {
      // Same vote → toggle off (remove)
      await voteRepository.deleteVote(existing.id);
      result = { action: "removed", voteType: data.type };
    } else {
      // Different vote → switch
      await voteRepository.updateVote(existing.id, voteType);
      result = { action: "changed", voteType: data.type };
    }

    // Update aggregate score
    if (targetType === "POST") {
      await postRepository.updateVoteScore(data.targetId);
    } else {
      await commentRepository.updateVoteScore(data.targetId);
    }

    return result;
  },

  async removeVote(userId: string, targetId: string, targetType: string) {
    const vt = targetType as VoteTargetType;
    const existing = await voteRepository.findExistingVote(userId, targetId, vt);
    if (!existing) {
      throw ApiError.notFound("Vote not found");
    }

    await voteRepository.deleteVote(existing.id);

    // Update aggregate score
    if (vt === "POST") {
      await postRepository.updateVoteScore(targetId);
    } else {
      await commentRepository.updateVoteScore(targetId);
    }

    return { action: "removed" };
  },
};
