import { Request, Response, NextFunction } from "express";
import { clerkClient, requireAuth } from "@clerk/express";
import prisma from "../config/database";
import { ApiError } from "../utils/api-error";

// Extend Express Request to include our user
declare global {
  namespace Express {
    interface Request {
      dbUser?: {
        id: string;
        clerkId: string;
        username: string;
        email: string;
        displayName: string | null;
        avatarUrl: string | null;
        isAdmin: boolean;
      };
    }
  }
}

/**
 * Middleware to require authentication via Clerk and sync user to database.
 * Attaches `req.dbUser` with the database user record.
 */
export async function requireAuthentication(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Use Clerk's requireAuth to validate the session
    const auth = (req as any).auth;

    if (!auth?.userId) {
      throw ApiError.unauthorized("Authentication required");
    }

    const clerkId = auth.userId;

    // Find or create user in our database
    let dbUser = await prisma.user.findUnique({
      where: { clerkId },
      select: {
        id: true,
        clerkId: true,
        username: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        isAdmin: true,
      },
    });

    if (!dbUser) {
      // Sync from Clerk
      try {
        const clerkUser = await clerkClient.users.getUser(clerkId);
        dbUser = await prisma.user.create({
          data: {
            clerkId,
            username:
              clerkUser.username ||
              `user_${clerkId.slice(-8)}`,
            email:
              clerkUser.emailAddresses[0]?.emailAddress ||
              `${clerkId}@placeholder.com`,
            displayName: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || null,
            avatarUrl: clerkUser.imageUrl || null,
          },
          select: {
            id: true,
            clerkId: true,
            username: true,
            email: true,
            displayName: true,
            avatarUrl: true,
            isAdmin: true,
          },
        });
      } catch (syncError) {
        console.error("Failed to sync user from Clerk:", syncError);
        throw ApiError.internal("Failed to authenticate user");
      }
    }

    req.dbUser = dbUser;
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional auth — attaches user if present but doesn't require it.
 */
export async function optionalAuthentication(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const auth = (req as any).auth;

    if (auth?.userId) {
      const dbUser = await prisma.user.findUnique({
        where: { clerkId: auth.userId },
        select: {
          id: true,
          clerkId: true,
          username: true,
          email: true,
          displayName: true,
          avatarUrl: true,
          isAdmin: true,
        },
      });

      if (dbUser) {
        req.dbUser = dbUser;
      }
    }

    next();
  } catch {
    // Silently continue if auth fails
    next();
  }
}

/**
 * Require admin role.
 */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.dbUser?.isAdmin) {
    next(ApiError.forbidden("Admin access required"));
    return;
  }
  next();
}
