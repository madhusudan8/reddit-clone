import { Router } from "express";
import { communityController } from "./community.controller";
import { requireAuthentication } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  createCommunitySchema,
  updateCommunitySchema,
  communityQuerySchema,
  nameParamSchema,
} from "../../validations/schemas";
import { createLimiter } from "../../middleware/rate-limiter";

const router = Router();

// GET /api/communities — List communities
router.get(
  "/",
  validate(communityQuerySchema, "query"),
  communityController.list
);

// GET /api/communities/trending — Trending communities
router.get(
  "/trending",
  validate(communityQuerySchema, "query"),
  communityController.getTrending
);

// GET /api/communities/:name — Community details
router.get(
  "/:name",
  validate(nameParamSchema, "params"),
  communityController.getByName
);

// POST /api/communities — Create community
router.post(
  "/",
  requireAuthentication,
  createLimiter,
  validate(createCommunitySchema),
  communityController.create
);

// PATCH /api/communities/:name — Update community
router.patch(
  "/:name",
  requireAuthentication,
  validate(nameParamSchema, "params"),
  validate(updateCommunitySchema),
  communityController.update
);

// POST /api/communities/:name/join — Join community
router.post(
  "/:name/join",
  requireAuthentication,
  validate(nameParamSchema, "params"),
  communityController.join
);

// DELETE /api/communities/:name/leave — Leave community
router.delete(
  "/:name/leave",
  requireAuthentication,
  validate(nameParamSchema, "params"),
  communityController.leave
);

export default router;
