import { Router } from "express";
import { searchController } from "./search.controller";
import { validate } from "../../middleware/validate";
import { searchQuerySchema } from "../../validations/schemas";

const router = Router();

// GET /api/search — Unified search
router.get(
  "/",
  validate(searchQuerySchema, "query"),
  searchController.search
);

export default router;
