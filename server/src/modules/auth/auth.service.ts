import { authRepository } from "./auth.repository";
import { ApiError } from "../../utils/api-error";

export const authService = {
  async syncUser(data: {
    clerkId: string;
    username: string;
    email: string;
    displayName?: string;
    avatarUrl?: string | null;
  }) {
    // Check if user already exists
    const existing = await authRepository.findByClerkId(data.clerkId);

    if (existing) {
      // Update if needed
      return authRepository.updateUser(data.clerkId, {
        displayName: data.displayName,
        avatarUrl: data.avatarUrl,
      });
    }

    // Create new user
    return authRepository.createUser(data);
  },

  async getCurrentUser(userId: string) {
    const user = await authRepository.getUserWithStats(userId);
    if (!user) {
      throw ApiError.notFound("User not found");
    }
    return user;
  },
};
