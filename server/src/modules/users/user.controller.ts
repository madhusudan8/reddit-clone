import { Request, Response, NextFunction } from "express";
import { userService } from "./user.service";
import { sendSuccess } from "../../utils/api-response";
import { getPaginationMeta } from "../../utils/pagination";

export const userController = {
  async getUserByUsername(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.getUserByUsername(req.validated!.params.username as string);
      sendSuccess({ res, data: user });
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.updateProfile(req.dbUser!.id, req.validated!.body);
      sendSuccess({ res, data: user, message: "Profile updated" });
    } catch (error) {
      next(error);
    }
  },

  async getUserPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.validated!.query;
      const { posts, total } = await userService.getUserPosts(
        req.validated!.params.username as string,
        page,
        limit
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
