import prisma from "../../config/database";
import { VoteType, VoteTargetType } from "@prisma/client";

export const voteRepository = {
  async findExistingVote(userId: string, targetId: string, targetType: VoteTargetType) {
    if (targetType === "POST") {
      return prisma.vote.findUnique({
        where: {
          userId_postId_targetType: {
            userId,
            postId: targetId,
            targetType,
          },
        },
      });
    } else {
      return prisma.vote.findUnique({
        where: {
          userId_commentId_targetType: {
            userId,
            commentId: targetId,
            targetType,
          },
        },
      });
    }
  },

  async createVote(data: {
    userId: string;
    type: VoteType;
    targetType: VoteTargetType;
    targetId: string;
  }) {
    return prisma.vote.create({
      data: {
        userId: data.userId,
        type: data.type,
        targetType: data.targetType,
        postId: data.targetType === "POST" ? data.targetId : undefined,
        commentId: data.targetType === "COMMENT" ? data.targetId : undefined,
      },
    });
  },

  async updateVote(voteId: string, type: VoteType) {
    return prisma.vote.update({
      where: { id: voteId },
      data: { type },
    });
  },

  async deleteVote(voteId: string) {
    return prisma.vote.delete({
      where: { id: voteId },
    });
  },

  async deleteVoteByTarget(userId: string, targetId: string, targetType: VoteTargetType) {
    if (targetType === "POST") {
      return prisma.vote.delete({
        where: {
          userId_postId_targetType: {
            userId,
            postId: targetId,
            targetType,
          },
        },
      });
    } else {
      return prisma.vote.delete({
        where: {
          userId_commentId_targetType: {
            userId,
            commentId: targetId,
            targetType,
          },
        },
      });
    }
  },
};
