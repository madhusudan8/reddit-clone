import prisma from "../../config/database";
import { Prisma } from "@prisma/client";

export const communityRepository = {
  async create(data: {
    name: string;
    displayName: string;
    description?: string;
    isPrivate?: boolean;
    ownerId: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const community = await tx.community.create({ data });
      // Auto-join owner as ADMIN
      await tx.communityMembership.create({
        data: {
          userId: data.ownerId,
          communityId: community.id,
          role: "ADMIN",
        },
      });
      return community;
    });
  },

  async findByName(name: string) {
    return prisma.community.findUnique({
      where: { name },
      include: {
        owner: { select: { id: true, username: true, avatarUrl: true } },
        _count: { select: { memberships: true, posts: true } },
      },
    });
  },

  async findById(id: string) {
    return prisma.community.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, username: true, avatarUrl: true } },
        _count: { select: { memberships: true, posts: true } },
      },
    });
  },

  async list(skip: number, take: number, search?: string) {
    const where: Prisma.CommunityWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { displayName: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [communities, total] = await Promise.all([
      prisma.community.findMany({
        where,
        include: {
          _count: { select: { memberships: true, posts: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.community.count({ where }),
    ]);

    return { communities, total };
  },

  async getTrending(take: number = 10) {
    return prisma.community.findMany({
      include: {
        _count: { select: { memberships: true, posts: true } },
      },
      orderBy: { memberships: { _count: "desc" } },
      take,
    });
  },

  async update(id: string, data: Prisma.CommunityUpdateInput) {
    return prisma.community.update({
      where: { id },
      data,
    });
  },

  async join(userId: string, communityId: string) {
    return prisma.communityMembership.create({
      data: { userId, communityId },
    });
  },

  async leave(userId: string, communityId: string) {
    return prisma.communityMembership.delete({
      where: { userId_communityId: { userId, communityId } },
    });
  },

  async getMembership(userId: string, communityId: string) {
    return prisma.communityMembership.findUnique({
      where: { userId_communityId: { userId, communityId } },
    });
  },

  async isMember(userId: string, communityId: string) {
    const membership = await this.getMembership(userId, communityId);
    return !!membership;
  },
};
