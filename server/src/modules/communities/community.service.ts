import { communityRepository } from "./community.repository";
import { ApiError } from "../../utils/api-error";

export const communityService = {
  async create(data: {
    name: string;
    displayName: string;
    description?: string;
    isPrivate?: boolean;
    ownerId: string;
  }) {
    const existing = await communityRepository.findByName(data.name);
    if (existing) {
      throw ApiError.conflict(`Community r/${data.name} already exists`);
    }
    return communityRepository.create(data);
  },

  async getByName(name: string) {
    const community = await communityRepository.findByName(name);
    if (!community) {
      throw ApiError.notFound(`Community r/${name} not found`);
    }
    return community;
  },

  async list(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    return communityRepository.list(skip, limit, search);
  },

  async getTrending(limit: number = 10) {
    return communityRepository.getTrending(limit);
  },

  async join(userId: string, communityName: string) {
    const community = await communityRepository.findByName(communityName);
    if (!community) {
      throw ApiError.notFound(`Community r/${communityName} not found`);
    }

    const isMember = await communityRepository.isMember(userId, community.id);
    if (isMember) {
      throw ApiError.conflict("You are already a member of this community");
    }

    return communityRepository.join(userId, community.id);
  },

  async leave(userId: string, communityName: string) {
    const community = await communityRepository.findByName(communityName);
    if (!community) {
      throw ApiError.notFound(`Community r/${communityName} not found`);
    }

    if (community.ownerId === userId) {
      throw ApiError.badRequest("Community owner cannot leave the community");
    }

    const isMember = await communityRepository.isMember(userId, community.id);
    if (!isMember) {
      throw ApiError.badRequest("You are not a member of this community");
    }

    return communityRepository.leave(userId, community.id);
  },

  async update(
    communityName: string,
    userId: string,
    data: { displayName?: string; description?: string; avatarUrl?: string | null; bannerUrl?: string | null; isPrivate?: boolean }
  ) {
    const community = await communityRepository.findByName(communityName);
    if (!community) {
      throw ApiError.notFound(`Community r/${communityName} not found`);
    }

    // Check ownership or admin
    const membership = await communityRepository.getMembership(userId, community.id);
    if (community.ownerId !== userId && membership?.role !== "ADMIN" && membership?.role !== "MODERATOR") {
      throw ApiError.forbidden("You don't have permission to update this community");
    }

    return communityRepository.update(community.id, data);
  },
};
