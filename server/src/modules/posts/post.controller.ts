import { Request, Response, NextFunction } from "express";
import { postService } from "./post.service";
import { sendSuccess, sendCreated, sendNoContent } from "../../utils/api-response";
import { getPaginationMeta } from "../../utils/pagination";

export const postController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await postService.create({
        ...req.validated!.body,
        authorId: req.dbUser!.id,
      });
      sendCreated(res, post, "Post created successfully");
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await postService.getById(req.validated!.params.id as string, req.dbUser?.id);
      sendSuccess({ res, data: post });
    } catch (error) {
      next(error);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, sort, communityId, communityName, authorId } = req.validated!.query;
      const { posts, total } = await postService.list({
        page,
        limit,
        sort,
        communityId,
        communityName,
        authorId,
      });
      sendSuccess({
        res,
        data: posts,
        pagination: getPaginationMeta(total, page, limit),
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await postService.update(req.validated!.params.id as string, req.dbUser!.id, req.validated!.body);
      sendSuccess({ res, data: post, message: "Post updated" });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await postService.delete(req.validated!.params.id as string, req.dbUser!.id, req.dbUser!.isAdmin);
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  },

  async toggleSave(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await postService.toggleSave(req.dbUser!.id, req.validated!.params.id as string);
      sendSuccess({ res, data: result, message: result.saved ? "Post saved" : "Post unsaved" });
    } catch (error) {
      next(error);
    }
  },
};
