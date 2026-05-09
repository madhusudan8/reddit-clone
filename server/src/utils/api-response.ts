import { Response } from "express";

interface PaginationMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasMore?: boolean;
  nextCursor?: string | null;
}

interface ApiResponseOptions<T> {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: T;
  pagination?: PaginationMeta;
}

export function sendSuccess<T>({
  res,
  statusCode = 200,
  message = "Success",
  data,
  pagination,
}: ApiResponseOptions<T>) {
  const response: Record<string, unknown> = {
    success: true,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  if (pagination) {
    response.pagination = pagination;
  }

  return res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  statusCode = 500,
  message = "Internal Server Error",
  details?: unknown
) {
  const response: Record<string, unknown> = {
    success: false,
    message,
  };

  if (details && process.env.NODE_ENV === "development") {
    response.details = details;
  }

  return res.status(statusCode).json(response);
}

export function sendCreated<T>(res: Response, data: T, message = "Created successfully") {
  return sendSuccess({ res, statusCode: 201, message, data });
}

export function sendNoContent(res: Response) {
  return res.status(204).send();
}
