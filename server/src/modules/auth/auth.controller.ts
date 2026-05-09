import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { sendSuccess, sendCreated } from "../../utils/api-response";

export const authController = {
  async syncUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.syncUser(req.validated!.body);
      sendCreated(res, user, "User synced successfully");
    } catch (error) {
      next(error);
    }
  },

  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.getCurrentUser(req.dbUser!.id);
      sendSuccess({ res, data: user });
    } catch (error) {
      next(error);
    }
  },
};
