import { Request, Response, NextFunction } from "express";
import { feedService } from "./feed.service";
import { sendSuccess } from "../../utils/api-response";
import { getPaginationMeta } from "../../utils/pagination";

export const feedController = {
  async getHomeFeed(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, sort } = req.validated!.query;
      const { posts, total } = await feedService.getHomeFeed(
        req.dbUser!.id,
        page,
        limit,
        sort
      );
      sendSuccess({
        res,
        data: posts,
        pagination: getPaginationMeta(total, page, limit),
      });
    } catch (error) {
      next(error);
    }
  },

  async getPopularFeed(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, sort } = req.validated!.query;
      const { posts, total } = await feedService.getPopularFeed(
        page,
        limit,
        sort
      );
      sendSuccess({
        res,
        data: posts,
        pagination: getPaginationMeta(total, page, limit),
      });
    } catch (error) {
      next(error);
    }
  },

  async getAllFeed(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, sort } = req.validated!.query;
      const { posts, total } = await feedService.getAllFeed(
        page,
        limit,
        sort
      );
      sendSuccess({
        res,
        data: posts,
        pagination: getPaginationMeta(total, page, limit),
      });
    } catch (error) {
      next(error);
    }
  },
};
