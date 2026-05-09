import prisma from "../../config/database";
import { Prisma } from "@prisma/client";

const postIncludes = {
  author: { select: { id: true, username: true, avatarUrl: true, displayName: true } },
  community: { select: { id: true, name: true, displayName: true, avatarUrl: true } },
  _count: { select: { comments: true, votes: true } },
} satisfies Prisma.PostInclude;

export const feedRepository = {
  /**
   * Home feed — posts from communities the user has joined.
   */
  async getHomeFeed(
    userId: string,
    skip: number,
    take: number,
    sort: "latest" | "top" | "trending"
  ) {
    // Get user's community IDs
    const memberships = await prisma.communityMembership.findMany({
      where: { userId },
      select: { communityId: true },
    });

    const communityIds = memberships.map((m) => m.communityId);

    if (communityIds.length === 0) {
      // Fallback to popular feed if user hasn't joined any communities
      return this.getPopularFeed(skip, take, sort);
    }

    const where: Prisma.PostWhereInput = {
      communityId: { in: communityIds },
      isDeleted: false,
    };

    const orderBy = this.getSortOrder(sort);

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: postIncludes,
        orderBy,
        skip,
        take,
      }),
      prisma.post.count({ where }),
    ]);

    return { posts, total };
  },

  /**
   * Popular feed — top-voted posts across all communities.
   */
  async getPopularFeed(
    skip: number,
    take: number,
    sort: "latest" | "top" | "trending"
  ) {
    const where: Prisma.PostWhereInput = {
      isDeleted: false,
      community: { isPrivate: false },
    };

    const orderBy = this.getSortOrder(sort);

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: postIncludes,
        orderBy,
        skip,
        take,
      }),
      prisma.post.count({ where }),
    ]);

    return { posts, total };
  },

  /**
   * All feed — all posts from public communities.
   */
  async getAllFeed(
    skip: number,
    take: number,
    sort: "latest" | "top" | "trending"
  ) {
    const where: Prisma.PostWhereInput = {
      isDeleted: false,
    };

    const orderBy = this.getSortOrder(sort);

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: postIncludes,
        orderBy,
        skip,
        take,
      }),
      prisma.post.count({ where }),
    ]);

    return { posts, total };
  },

  getSortOrder(sort: "latest" | "top" | "trending"): Prisma.PostOrderByWithRelationInput {
    switch (sort) {
      case "top":
        return { voteScore: "desc" };
      case "trending":
        return { voteScore: "desc" }; // Could add time-decay in future
      default:
        return { createdAt: "desc" };
    }
  },
};
