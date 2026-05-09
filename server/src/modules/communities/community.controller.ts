import { Request, Response, NextFunction } from "express";
import { communityService } from "./community.service";
import { sendSuccess, sendCreated, sendNoContent } from "../../utils/api-response";
import { getPaginationMeta } from "../../utils/pagination";

export const communityController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const community = await communityService.create({
        ...req.validated!.body,
        ownerId: req.dbUser!.id,
      });
      sendCreated(res, community, "Community created successfully");
    } catch (error) {
      next(error);
    }
  },

  async getByName(req: Request, res: Response, next: NextFunction) {
    try {
      const community = await communityService.getByName(req.validated!.params.name as string);
      sendSuccess({ res, data: community });
    } catch (error) {
      next(error);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search } = req.validated!.query;
      const { communities, total } = await communityService.list(
        page,
        limit,
        search
      );
      sendSuccess({
        res,
        data: communities,
        pagination: getPaginationMeta(total, page, limit),
      });
    } catch (error) {
      next(error);
    }
  },

  async getTrending(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit } = req.validated!.query || { limit: 10 };
      const communities = await communityService.getTrending(limit);
      sendSuccess({ res, data: communities });
    } catch (error) {
      next(error);
    }
  },

  async join(req: Request, res: Response, next: NextFunction) {
    try {
      await communityService.join(req.dbUser!.id, req.validated!.params.name as string);
      sendSuccess({ res, message: "Joined community successfully" });
    } catch (error) {
      next(error);
    }
  },

  async leave(req: Request, res: Response, next: NextFunction) {
    try {
      await communityService.leave(req.dbUser!.id, req.validated!.params.name as string);
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const community = await communityService.update(
        req.validated!.params.name as string,
        req.dbUser!.id,
        req.validated!.body
      );
      sendSuccess({ res, data: community, message: "Community updated" });
    } catch (error) {
      next(error);
    }
  },
};
