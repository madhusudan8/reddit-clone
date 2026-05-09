import prisma from "../../config/database";

export const searchRepository = {
  async searchPosts(query: string, skip: number, take: number) {
    const where = {
      isDeleted: false,
      OR: [
        { title: { contains: query, mode: "insensitive" as const } },
        { content: { contains: query, mode: "insensitive" as const } },
      ],
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: { select: { id: true, username: true, avatarUrl: true } },
          community: { select: { id: true, name: true, displayName: true, avatarUrl: true } },
          _count: { select: { comments: true, votes: true } },
        },
        orderBy: { voteScore: "desc" },
        skip,
        take,
      }),
      prisma.post.count({ where }),
    ]);

    return { posts, total };
  },

  async searchCommunities(query: string, skip: number, take: number) {
    const where = {
      OR: [
        { name: { contains: query, mode: "insensitive" as const } },
        { displayName: { contains: query, mode: "insensitive" as const } },
        { description: { contains: query, mode: "insensitive" as const } },
      ],
    };

    const [communities, total] = await Promise.all([
      prisma.community.findMany({
        where,
        include: {
          _count: { select: { memberships: true, posts: true } },
        },
        orderBy: { memberships: { _count: "desc" } },
        skip,
        take,
      }),
      prisma.community.count({ where }),
    ]);

    return { communities, total };
  },

  async searchUsers(query: string, skip: number, take: number) {
    const where = {
      OR: [
        { username: { contains: query, mode: "insensitive" as const } },
        { displayName: { contains: query, mode: "insensitive" as const } },
      ],
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          karma: true,
          createdAt: true,
          _count: { select: { posts: true, comments: true } },
        },
        orderBy: { karma: "desc" },
        skip,
        take,
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  },
};
