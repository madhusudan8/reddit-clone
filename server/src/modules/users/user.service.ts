import { userRepository } from "./user.repository";
import { ApiError } from "../../utils/api-error";

export const userService = {
  async getUserByUsername(username: string) {
    const user = await userRepository.findByUsername(username);
    if (!user) {
      throw ApiError.notFound(`User u/${username} not found`);
    }
    // Strip sensitive fields
    const { clerkId, email, ...publicUser } = user;
    return publicUser;
  },

  async updateProfile(userId: string, data: {
    displayName?: string;
    bio?: string;
    avatarUrl?: string | null;
    bannerUrl?: string | null;
  }) {
    return userRepository.updateProfile(userId, data);
  },

  async getUserPosts(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    return userRepository.getUserPosts(userId, skip, limit);
  },
};
