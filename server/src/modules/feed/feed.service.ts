import { feedRepository } from "./feed.repository";

export const feedService = {
  async getHomeFeed(userId: string, page: number, limit: number, sort: "latest" | "top" | "trending") {
    const skip = (page - 1) * limit;
    return feedRepository.getHomeFeed(userId, skip, limit, sort);
  },

  async getPopularFeed(page: number, limit: number, sort: "latest" | "top" | "trending", userId?: string) {
    const skip = (page - 1) * limit;
    return feedRepository.getPopularFeed(skip, limit, sort, userId);
  },

  async getAllFeed(page: number, limit: number, sort: "latest" | "top" | "trending", userId?: string) {
    const skip = (page - 1) * limit;
    return feedRepository.getAllFeed(skip, limit, sort, userId);
  },
};
