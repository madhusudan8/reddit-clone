import prisma from "../../config/database";
import { Prisma, PostType } from "@prisma/client";

const postIncludes = {
  author: { select: { id: true, username: true, avatarUrl: true, displayName: true } },
  community: { select: { id: true, name: true, displayName: true, avatarUrl: true } },
  _count: { select: { comments: true, votes: true } },
} satisfies Prisma.PostInclude;

export const postRepository = {
  async create(data: {
    title: string;
    content?: string;
    imageUrl?: string;
    linkUrl?: string;
    type: PostType;
    authorId: string;
    communityId: string;
  }) {
    return prisma.post.create({
      data,
      include: postIncludes,
    });
  },

  async findById(id: string, userId?: string) {
    const post = await prisma.post.findUnique({
      where: { id, isDeleted: false },
      include: {
        ...postIncludes,
        votes: userId
          ? { where: { userId }, select: { type: true } }
          : false,
        savedBy: userId
          ? { where: { userId }, select: { userId: true } }
          : false,
      },
    });
    return post;
  },

  async list(options: {
    skip: number;
    take: number;
    sort: "latest" | "top" | "trending";
    communityId?: string;
    communityName?: string;
    authorId?: string;
    userId?: string;
  }) {
    const where: Prisma.PostWhereInput = {
      isDeleted: false,
      ...(options.communityId && { communityId: options.communityId }),
      ...(options.communityName && { community: { name: options.communityName } }),
      ...(options.authorId && { authorId: options.authorId }),
    };

    let orderBy: Prisma.PostOrderByWithRelationInput;
    switch (options.sort) {
      case "top":
        orderBy = { voteScore: "desc" };
        break;
      case "trending":
        orderBy = { voteScore: "desc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          ...postIncludes,
          votes: options.userId
            ? { where: { userId: options.userId }, select: { type: true } }
            : false,
          savedBy: options.userId
            ? { where: { userId: options.userId }, select: { userId: true } }
            : false,
        },
        orderBy,
        skip: options.skip,
        take: options.take,
      }),
      prisma.post.count({ where }),
    ]);

    return { posts, total };
  },

  async update(id: string, data: { title?: string; content?: string }) {
    return prisma.post.update({
      where: { id },
      data,
      include: postIncludes,
    });
  },

  async softDelete(id: string) {
    return prisma.post.update({
      where: { id },
      data: { isDeleted: true },
    });
  },

  async savePost(userId: string, postId: string) {
    return prisma.savedPost.create({
      data: { userId, postId },
    });
  },

  async unsavePost(userId: string, postId: string) {
    return prisma.savedPost.delete({
      where: { userId_postId: { userId, postId } },
    });
  },

  async isSaved(userId: string, postId: string) {
    const saved = await prisma.savedPost.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    return !!saved;
  },

  async getSavedPosts(userId: string, skip: number, take: number) {
    const [savedPosts, total] = await Promise.all([
      prisma.savedPost.findMany({
        where: { userId },
        include: {
          post: {
            include: postIncludes,
          },
        },
        orderBy: { savedAt: "desc" },
        skip,
        take,
      }),
      prisma.savedPost.count({ where: { userId } }),
    ]);
    return { posts: savedPosts.map((sp) => sp.post), total };
  },

  async updateVoteScore(postId: string) {
    const upvotes = await prisma.vote.count({
      where: { postId, targetType: "POST", type: "UPVOTE" },
    });
    const downvotes = await prisma.vote.count({
      where: { postId, targetType: "POST", type: "DOWNVOTE" },
    });
    return prisma.post.update({
      where: { id: postId },
      data: { voteScore: upvotes - downvotes },
    });
  },
};
