import { Request, Response, NextFunction } from "express";
import { voteService } from "./vote.service";
import { sendSuccess } from "../../utils/api-response";

export const voteController = {
  async castVote(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await voteService.castVote(req.dbUser!.id, req.validated!.body);
      sendSuccess({ res, data: result, message: `Vote ${result.action}` });
    } catch (error) {
      next(error);
    }
  },

  async removeVote(req: Request, res: Response, next: NextFunction) {
    try {
      const { targetType } = req.validated!.query || { targetType: "POST" };
      const result = await voteService.removeVote(
        req.dbUser!.id,
        req.validated!.params.targetId as string,
        targetType
      );
      sendSuccess({ res, data: result, message: "Vote removed" });
    } catch (error) {
      next(error);
    }
  },
};
