import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { clerkMiddleware } from "@clerk/express";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error-handler";
import { generalLimiter } from "./middleware/rate-limiter";

// Route imports
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import communityRoutes from "./modules/communities/community.routes";
import postRoutes from "./modules/posts/post.routes";
import commentRoutes from "./modules/comments/comment.routes";
import voteRoutes from "./modules/votes/vote.routes";
import feedRoutes from "./modules/feed/feed.routes";
import searchRoutes from "./modules/search/search.routes";

const app = express();

// ============================================
// GLOBAL MIDDLEWARE
// ============================================

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression
app.use(compression());

// Logging
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Rate limiting
app.use(generalLimiter);

// Clerk authentication (attaches auth to req)
app.use(clerkMiddleware());

// ============================================
// HEALTH CHECK
// ============================================
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Reddit Clone API is running 🚀",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// API ROUTES
// ============================================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/search", searchRoutes);

// ============================================
// 404 HANDLER
// ============================================
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ============================================
// ERROR HANDLER (must be last)
// ============================================
app.use(errorHandler);

export default app;
