import prisma from "../../config/database";
import { Prisma } from "@prisma/client";

const commentIncludes = {
  author: { select: { id: true, username: true, avatarUrl: true, displayName: true } },
  _count: { select: { replies: true, votes: true } },
} satisfies Prisma.CommentInclude;

export const commentRepository = {
  async create(data: {
    content: string;
    postId: string;
    authorId: string;
    parentId?: string;
  }) {
    return prisma.comment.create({
      data,
      include: commentIncludes,
    });
  },

  async findById(id: string) {
    return prisma.comment.findUnique({
      where: { id, isDeleted: false },
      include: commentIncludes,
    });
  },

  async getByPostId(
    postId: string,
    skip: number,
    take: number,
    sort: "best" | "new" | "top"
  ) {
    let orderBy: Prisma.CommentOrderByWithRelationInput;
    switch (sort) {
      case "top":
        orderBy = { voteScore: "desc" };
        break;
      case "new":
        orderBy = { createdAt: "desc" };
        break;
      default: // best
        orderBy = { voteScore: "desc" };
    }

    const where: Prisma.CommentWhereInput = {
      postId,
      parentId: null, // Only top-level comments
      isDeleted: false,
    };

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: {
          ...commentIncludes,
          replies: {
            where: { isDeleted: false },
            include: {
              ...commentIncludes,
              replies: {
                where: { isDeleted: false },
                include: {
                  ...commentIncludes,
                  replies: {
                    where: { isDeleted: false },
                    include: commentIncludes,
                    orderBy: { voteScore: "desc" },
                    take: 5,
                  },
                },
                orderBy: { voteScore: "desc" },
                take: 5,
              },
            },
            orderBy: { voteScore: "desc" },
            take: 10,
          },
        },
        orderBy,
        skip,
        take,
      }),
      prisma.comment.count({ where }),
    ]);

    return { comments, total };
  },

  async update(id: string, data: { content: string }) {
    return prisma.comment.update({
      where: { id },
      data,
      include: commentIncludes,
    });
  },

  async softDelete(id: string) {
    return prisma.comment.update({
      where: { id },
      data: { isDeleted: true, content: "[deleted]" },
    });
  },

  async updateVoteScore(commentId: string) {
    const upvotes = await prisma.vote.count({
      where: { commentId, targetType: "COMMENT", type: "UPVOTE" },
    });
    const downvotes = await prisma.vote.count({
      where: { commentId, targetType: "COMMENT", type: "DOWNVOTE" },
    });
    return prisma.comment.update({
      where: { id: commentId },
      data: { voteScore: upvotes - downvotes },
    });
  },
};
