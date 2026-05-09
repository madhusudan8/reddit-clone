import prisma from "../../config/database";

export const authRepository = {
  async findByClerkId(clerkId: string) {
    return prisma.user.findUnique({
      where: { clerkId },
    });
  },

  async createUser(data: {
    clerkId: string;
    username: string;
    email: string;
    displayName?: string;
    avatarUrl?: string | null;
  }) {
    return prisma.user.create({ data });
  },

  async updateUser(clerkId: string, data: { displayName?: string; avatarUrl?: string | null }) {
    return prisma.user.update({
      where: { clerkId },
      data,
    });
  },

  async getUserWithStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
    return user;
  },
};
