import "dotenv/config";
import { resolve } from "node:path";
import { db } from "~/server/db/db";
import { migrate } from "drizzle-orm/libsql/migrator";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { logger } from "~/utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  logger.info("Migrate starting ...");
  await migrate(db, {
    migrationsFolder: resolve(__dirname, "../../../migrations"),
  });
  logger.info("Migrate finished.");
})();
