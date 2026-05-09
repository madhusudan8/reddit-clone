import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log error in development
  if (process.env.NODE_ENV === "development") {
    console.error("❌ Error:", err.message);
    if (err.stack) {
      console.error(err.stack);
    }
  }

  // Handle our custom API errors
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details && process.env.NODE_ENV === "development"
        ? { details: err.details }
        : {}),
    });
    return;
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: formattedErrors,
    });
    return;
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        const target = (err.meta?.target as string[]) || [];
        res.status(409).json({
          success: false,
          message: `A record with this ${target.join(", ")} already exists`,
        });
        return;
      }
      case "P2025":
        res.status(404).json({
          success: false,
          message: "Record not found",
        });
        return;
      case "P2003":
        res.status(400).json({
          success: false,
          message: "Invalid reference — related record not found",
        });
        return;
      default:
        res.status(400).json({
          success: false,
          message: "Database error",
          ...(process.env.NODE_ENV === "development"
            ? { code: err.code, details: err.message }
            : {}),
        });
        return;
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      success: false,
      message: "Invalid data provided",
      ...(process.env.NODE_ENV === "development"
        ? { details: err.message }
        : {}),
    });
    return;
  }

  // Handle Clerk auth errors
  if (err.message?.includes("Unauthenticated")) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  // Default — unknown error
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
}
