import { Router } from "express";
import { voteController } from "./vote.controller";
import { requireAuthentication } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { voteSchema } from "../../validations/schemas";
import { voteLimiter } from "../../middleware/rate-limiter";

const router = Router();

// POST /api/votes — Cast or toggle vote
router.post(
  "/",
  requireAuthentication,
  voteLimiter,
  validate(voteSchema),
  voteController.castVote
);

// DELETE /api/votes/:targetId — Remove vote
router.delete(
  "/:targetId",
  requireAuthentication,
  voteController.removeVote
);

export default router;
