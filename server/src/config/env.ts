import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  CLERK_SECRET_KEY: z.string().min(1, "CLERK_SECRET_KEY is required"),
  CLERK_PUBLISHABLE_KEY: z.string().min(1, "CLERK_PUBLISHABLE_KEY is required"),
  CLIENT_URL: z.string().default("http://localhost:3000"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
});

function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    console.error(parsed.error.flatten().fieldErrors);
    // Don't crash in dev — just warn
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
    console.warn("⚠️  Running with potentially invalid env vars in development mode");
    return envSchema.parse({
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL || "postgresql://localhost:5432/reddit_clone",
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || "sk_test_placeholder",
      CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY || "pk_test_placeholder",
    });
  }

  return parsed.data;
}

export const env = validateEnv();
