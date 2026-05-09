import prisma from "../../config/database";

export const userRepository = {
  async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
      include: {
        _count: {
          select: {
            posts: true,
            comments: true,
            communityMemberships: true,
          },
        },
      },
    });
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true,
            comments: true,
            communityMemberships: true,
          },
        },
      },
    });
  },

  async updateProfile(userId: string, data: {
    displayName?: string;
    bio?: string;
    avatarUrl?: string | null;
    bannerUrl?: string | null;
  }) {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  },

  async getUserPosts(userId: string, skip: number, take: number) {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { authorId: userId, isDeleted: false },
        include: {
          author: { select: { id: true, username: true, avatarUrl: true } },
          community: { select: { id: true, name: true, displayName: true, avatarUrl: true } },
          _count: { select: { comments: true, votes: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.post.count({ where: { authorId: userId, isDeleted: false } }),
    ]);
    return { posts, total };
  },
};
