import { commentRepository } from "./comment.repository";
import { postRepository } from "../posts/post.repository";
import { ApiError } from "../../utils/api-error";

export const commentService = {
  async create(data: {
    content: string;
    postId: string;
    authorId: string;
    parentId?: string;
  }) {
    // Verify post exists
    const post = await postRepository.findById(data.postId);
    if (!post) {
      throw ApiError.notFound("Post not found");
    }

    // Verify parent comment exists if replying
    if (data.parentId) {
      const parent = await commentRepository.findById(data.parentId);
      if (!parent) {
        throw ApiError.notFound("Parent comment not found");
      }
      if (parent.postId !== data.postId) {
        throw ApiError.badRequest("Parent comment belongs to a different post");
      }
    }

    return commentRepository.create(data);
  },

  async getByPostId(postId: string, page: number, limit: number, sort: "best" | "new" | "top") {
    const skip = (page - 1) * limit;
    return commentRepository.getByPostId(postId, skip, limit, sort);
  },

  async update(commentId: string, userId: string, content: string) {
    const comment = await commentRepository.findById(commentId);
    if (!comment) {
      throw ApiError.notFound("Comment not found");
    }
    if (comment.authorId !== userId) {
      throw ApiError.forbidden("You can only edit your own comments");
    }
    return commentRepository.update(commentId, { content });
  },

  async delete(commentId: string, userId: string, isAdmin: boolean) {
    const comment = await commentRepository.findById(commentId);
    if (!comment) {
      throw ApiError.notFound("Comment not found");
    }
    if (comment.authorId !== userId && !isAdmin) {
      throw ApiError.forbidden("You can only delete your own comments");
    }
    return commentRepository.softDelete(commentId);
  },
};
