import { Request, Response, NextFunction } from "express";
import { commentService } from "./comment.service";
import { sendSuccess, sendCreated, sendNoContent } from "../../utils/api-response";
import { getPaginationMeta } from "../../utils/pagination";

export const commentController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const comment = await commentService.create({
        ...req.validated!.body,
        authorId: req.dbUser!.id,
      });
      sendCreated(res, comment, "Comment added");
    } catch (error) {
      next(error);
    }
  },

  async getByPostId(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, sort } = req.validated!.query;
      const { comments, total } = await commentService.getByPostId(
        req.validated!.params.postId as string,
        page,
        limit,
        sort
      );
      sendSuccess({
        res,
        data: comments,
        pagination: getPaginationMeta(total, page, limit),
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const comment = await commentService.update(
        req.validated!.params.id as string,
        req.dbUser!.id,
        req.validated!.body.content
      );
      sendSuccess({ res, data: comment, message: "Comment updated" });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await commentService.delete(req.validated!.params.id as string, req.dbUser!.id, req.dbUser!.isAdmin);
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  },
};
