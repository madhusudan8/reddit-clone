import { Router } from "express";
import { commentController } from "./comment.controller";
import { requireAuthentication } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  createCommentSchema,
  updateCommentSchema,
  commentQuerySchema,
  idParamSchema,
  postIdParamSchema,
} from "../../validations/schemas";
import { createLimiter } from "../../middleware/rate-limiter";

const router = Router();

// POST /api/comments — Create comment
router.post(
  "/",
  requireAuthentication,
  createLimiter,
  validate(createCommentSchema),
  commentController.create
);

// GET /api/comments/post/:postId — Get comments by post
router.get(
  "/post/:postId",
  validate(postIdParamSchema, "params"),
  validate(commentQuerySchema, "query"),
  commentController.getByPostId
);

// PATCH /api/comments/:id — Edit comment
router.patch(
  "/:id",
  requireAuthentication,
  validate(idParamSchema, "params"),
  validate(updateCommentSchema),
  commentController.update
);

// DELETE /api/comments/:id — Delete comment
router.delete(
  "/:id",
  requireAuthentication,
  validate(idParamSchema, "params"),
  commentController.delete
);

export default router;
