import { Router } from "express";
import { userController } from "./user.controller";
import { requireAuthentication } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { updateUserSchema, usernameParamSchema } from "../../validations/schemas";

const router = Router();

// GET /api/users/:username — Public user profile
router.get(
  "/:username",
  validate(usernameParamSchema, "params"),
  userController.getUserByUsername
);

// PATCH /api/users/me — Update own profile
router.patch(
  "/me",
  requireAuthentication,
  validate(updateUserSchema),
  userController.updateProfile
);

// GET /api/users/:username/posts — User's posts
router.get(
  "/:username/posts",
  validate(usernameParamSchema, "params"),
  userController.getUserPosts
);

export default router;
