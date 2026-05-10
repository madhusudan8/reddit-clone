import { Router } from "express";
import { postController } from "./post.controller";
import { requireAuthentication, optionalAuthentication } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  createPostSchema,
  updatePostSchema,
  postQuerySchema,
  idParamSchema,
} from "../../validations/schemas";
import { createLimiter } from "../../middleware/rate-limiter";

const router = Router();

// GET /api/posts/saved — List saved posts
router.get(
  "/saved",
  requireAuthentication,
  validate(postQuerySchema, "query"),
  postController.getSaved
);

// GET /api/posts — List posts
router.get(
  "/",
  validate(postQuerySchema, "query"),
  postController.list
);

// GET /api/posts/:id — Post detail
router.get(
  "/:id",
  optionalAuthentication,
  validate(idParamSchema, "params"),
  postController.getById
);

// POST /api/posts — Create post
router.post(
  "/",
  requireAuthentication,
  createLimiter,
  validate(createPostSchema),
  postController.create
);

// PATCH /api/posts/:id — Update post
router.patch(
  "/:id",
  requireAuthentication,
  validate(idParamSchema, "params"),
  validate(updatePostSchema),
  postController.update
);

// DELETE /api/posts/:id — Delete post
router.delete(
  "/:id",
  requireAuthentication,
  validate(idParamSchema, "params"),
  postController.delete
);

// POST /api/posts/:id/save — Toggle save/unsave
router.post(
  "/:id/save",
  requireAuthentication,
  validate(idParamSchema, "params"),
  postController.toggleSave
);

export default router;
