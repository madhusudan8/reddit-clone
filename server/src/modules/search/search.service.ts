import { searchRepository } from "./search.repository";

export const searchService = {
  async search(query: string, type: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    switch (type) {
      case "posts": {
        const { posts, total } = await searchRepository.searchPosts(query, skip, limit);
        return { results: posts, total, type: "posts" };
      }
      case "communities": {
        const { communities, total } = await searchRepository.searchCommunities(query, skip, limit);
        return { results: communities, total, type: "communities" };
      }
      case "users": {
        const { users, total } = await searchRepository.searchUsers(query, skip, limit);
        return { results: users, total, type: "users" };
      }
      case "all":
      default: {
        // Search all types in parallel
        const [postsResult, communitiesResult, usersResult] = await Promise.all([
          searchRepository.searchPosts(query, 0, 5),
          searchRepository.searchCommunities(query, 0, 5),
          searchRepository.searchUsers(query, 0, 5),
        ]);

        return {
          results: {
            posts: postsResult.posts,
            communities: communitiesResult.communities,
            users: usersResult.users,
          },
          total: postsResult.total + communitiesResult.total + usersResult.total,
          type: "all",
        };
      }
    }
  },
};
