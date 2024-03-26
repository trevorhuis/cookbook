import dotenv from "dotenv";
import type { Config } from "drizzle-kit";

dotenv.config({
  path: ".env.local",
});

export default {
  schema: "./app/server/db/schema/*",
  out: "./migrations",
  driver: "turso",
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
} satisfies Config;
