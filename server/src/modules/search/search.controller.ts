import { Request, Response, NextFunction } from "express";
import { searchService } from "./search.service";
import { sendSuccess } from "../../utils/api-response";
import { getPaginationMeta } from "../../utils/pagination";

export const searchController = {
  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { q, type, page, limit } = req.validated!.query;
      const result = await searchService.search(q, type, page, limit);

      sendSuccess({
        res,
        data: result.results,
        pagination:
          type !== "all"
            ? getPaginationMeta(result.total, page, limit)
            : { page: 1, limit, total: result.total, totalPages: 1, hasMore: false },
      });
    } catch (error) {
      next(error);
    }
  },
};
