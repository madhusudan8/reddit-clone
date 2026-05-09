import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

export function getPaginationMeta(total: number, page: number, limit: number) {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasMore: page < totalPages,
  };
}

export function getSkipTake(page: number, limit: number) {
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}
