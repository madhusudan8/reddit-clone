import { Router } from "express";
import { feedController } from "./feed.controller";
import { requireAuthentication, optionalAuthentication } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { feedQuerySchema } from "../../validations/schemas";

const router = Router();

// GET /api/feed/home — Personalized feed (requires auth)
router.get(
  "/home",
  requireAuthentication,
  validate(feedQuerySchema, "query"),
  feedController.getHomeFeed
);

// GET /api/feed/popular — Popular posts
router.get(
  "/popular",
  validate(feedQuerySchema, "query"),
  feedController.getPopularFeed
);

// GET /api/feed/all — All posts
router.get(
  "/all",
  validate(feedQuerySchema, "query"),
  feedController.getAllFeed
);

export default router;
