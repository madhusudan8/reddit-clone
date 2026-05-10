import { PostType } from "@prisma/client";
import { postRepository } from "./post.repository";
import { communityRepository } from "../communities/community.repository";
import { ApiError } from "../../utils/api-error";

export const postService = {
  async create(data: {
    title: string;
    content?: string;
    imageUrl?: string;
    linkUrl?: string;
    type: string;
    communityId: string;
    authorId: string;
  }) {
    // Verify community exists
    const community = await communityRepository.findById(data.communityId);
    if (!community) {
      throw ApiError.notFound("Community not found");
    }

    // Verify user is a member
    const isMember = await communityRepository.isMember(data.authorId, data.communityId);
    if (!isMember) {
      throw ApiError.forbidden("You must join this community to post");
    }

    return postRepository.create({
      ...data,
      type: data.type as PostType,
    });
  },

  async getById(id: string, userId?: string) {
    const post = await postRepository.findById(id, userId);
    if (!post) {
      throw ApiError.notFound("Post not found");
    }
    return post;
  },

  async list(options: {
    page: number;
    limit: number;
    sort: "latest" | "top" | "trending";
    communityId?: string;
    communityName?: string;
    authorId?: string;
    userId?: string;
  }) {
    const skip = (options.page - 1) * options.limit;
    return postRepository.list({
      skip,
      take: options.limit,
      sort: options.sort,
      communityId: options.communityId,
      communityName: options.communityName,
      authorId: options.authorId,
      userId: options.userId,
    });
  },

  async update(postId: string, userId: string, data: { title?: string; content?: string }) {
    const post = await postRepository.findById(postId);
    if (!post) {
      throw ApiError.notFound("Post not found");
    }
    if (post.authorId !== userId) {
      throw ApiError.forbidden("You can only edit your own posts");
    }
    return postRepository.update(postId, data);
  },

  async delete(postId: string, userId: string, isAdmin: boolean) {
    const post = await postRepository.findById(postId);
    if (!post) {
      throw ApiError.notFound("Post not found");
    }
    if (post.authorId !== userId && !isAdmin) {
      throw ApiError.forbidden("You can only delete your own posts");
    }
    return postRepository.softDelete(postId);
  },

  async toggleSave(userId: string, postId: string) {
    const post = await postRepository.findById(postId);
    if (!post) {
      throw ApiError.notFound("Post not found");
    }

    const isSaved = await postRepository.isSaved(userId, postId);
    if (isSaved) {
      await postRepository.unsavePost(userId, postId);
      return { saved: false };
    } else {
      await postRepository.savePost(userId, postId);
      return { saved: true };
    }
  },

  async getSavedPosts(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    return postRepository.getSavedPosts(userId, skip, limit);
  },
};
