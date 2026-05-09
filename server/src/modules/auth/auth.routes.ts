import { Router } from "express";
import { authController } from "./auth.controller";
import { requireAuthentication } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { syncUserSchema } from "../../validations/schemas";
import { authLimiter } from "../../middleware/rate-limiter";

const router = Router();

// POST /api/auth/sync — Sync Clerk user to database
router.post(
  "/sync",
  authLimiter,
  validate(syncUserSchema),
  authController.syncUser
);

// GET /api/auth/me — Get current authenticated user
router.get(
  "/me",
  requireAuthentication,
  authController.getCurrentUser
);

export default router;
