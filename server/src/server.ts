import app from "./app";
import { env } from "./config/env";
import prisma from "./config/database";

async function main() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    // Start server
    app.listen(env.PORT, () => {
      console.log(`\n🚀 Reddit Clone API Server`);
      console.log(`   Environment: ${env.NODE_ENV}`);
      console.log(`   Port: ${env.PORT}`);
      console.log(`   URL: http://localhost:${env.PORT}`);
      console.log(`   Health: http://localhost:${env.PORT}/api/health`);
      console.log(`\n📡 API Routes:`);
      console.log(`   POST   /api/auth/sync`);
      console.log(`   GET    /api/auth/me`);
      console.log(`   GET    /api/users/:username`);
      console.log(`   PATCH  /api/users/me`);
      console.log(`   GET    /api/communities`);
      console.log(`   POST   /api/communities`);
      console.log(`   GET    /api/communities/:name`);
      console.log(`   POST   /api/communities/:name/join`);
      console.log(`   DELETE /api/communities/:name/leave`);
      console.log(`   GET    /api/posts`);
      console.log(`   POST   /api/posts`);
      console.log(`   GET    /api/posts/:id`);
      console.log(`   PATCH  /api/posts/:id`);
      console.log(`   DELETE /api/posts/:id`);
      console.log(`   POST   /api/posts/:id/save`);
      console.log(`   POST   /api/comments`);
      console.log(`   GET    /api/comments/post/:postId`);
      console.log(`   PATCH  /api/comments/:id`);
      console.log(`   DELETE /api/comments/:id`);
      console.log(`   POST   /api/votes`);
      console.log(`   DELETE /api/votes/:targetId`);
      console.log(`   GET    /api/feed/home`);
      console.log(`   GET    /api/feed/popular`);
      console.log(`   GET    /api/feed/all`);
      console.log(`   GET    /api/search`);
      console.log("");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🔄 Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

main();
