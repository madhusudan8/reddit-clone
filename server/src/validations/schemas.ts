import { z } from "zod";

// ============================================
// POST VALIDATIONS
// ============================================
export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(300, "Title must be 300 characters or less")
    .trim(),
  content: z.string().max(40000, "Content too long").optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),
  linkUrl: z.string().url("Invalid link URL").optional(),
  type: z.enum(["TEXT", "IMAGE", "LINK"]).default("TEXT"),
  communityId: z.string().min(1, "Community is required"),
});

export const updatePostSchema = z.object({
  title: z
    .string()
    .min(1)
    .max(300)
    .trim()
    .optional(),
  content: z.string().max(40000).optional(),
});

export const postQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(["latest", "top", "trending"]).default("latest"),
  communityId: z.string().optional(),
  communityName: z.string().optional(),
  authorId: z.string().optional(),
});

// ============================================
// COMMENT VALIDATIONS
// ============================================
export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(10000, "Comment too long")
    .trim(),
  postId: z.string().min(1, "Post ID is required"),
  parentId: z.string().optional(),
});

export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(10000, "Comment too long")
    .trim(),
});

export const commentQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(["best", "new", "top"]).default("best"),
});

// ============================================
// COMMUNITY VALIDATIONS
// ============================================
export const createCommunitySchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(21, "Name must be 21 characters or less")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Name can only contain letters, numbers, and underscores"
    ),
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(100)
    .trim(),
  description: z.string().max(500).optional(),
  isPrivate: z.boolean().default(false),
});

export const updateCommunitySchema = z.object({
  displayName: z.string().min(1).max(100).trim().optional(),
  description: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional().nullable(),
  bannerUrl: z.string().url().optional().nullable(),
  isPrivate: z.boolean().optional(),
});

export const communityQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});

// ============================================
// VOTE VALIDATIONS
// ============================================
export const voteSchema = z.object({
  type: z.enum(["UPVOTE", "DOWNVOTE"]),
  targetType: z.enum(["POST", "COMMENT"]),
  targetId: z.string().min(1, "Target ID is required"),
});

// ============================================
// SEARCH VALIDATIONS
// ============================================
export const searchQuerySchema = z.object({
  q: z.string().min(1, "Search query is required").max(200).trim(),
  type: z.enum(["posts", "communities", "users", "all"]).default("all"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

// ============================================
// FEED VALIDATIONS
// ============================================
export const feedQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  sort: z.enum(["latest", "top", "trending"]).default("latest"),
});

// ============================================
// USER VALIDATIONS
// ============================================
export const updateUserSchema = z.object({
  displayName: z.string().min(1).max(100).trim().optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional().nullable(),
  bannerUrl: z.string().url().optional().nullable(),
});

export const syncUserSchema = z.object({
  clerkId: z.string().min(1),
  username: z.string().min(1),
  email: z.string().email(),
  displayName: z.string().optional(),
  avatarUrl: z.string().url().optional().nullable(),
});

// ============================================
// PARAM VALIDATIONS
// ============================================
export const idParamSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export const nameParamSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const usernameParamSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

export const postIdParamSchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
});
