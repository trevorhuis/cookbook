import "dotenv/config";
import { resolve } from "node:path";
import { db } from "~/server/db/db";
import { migrate } from "drizzle-orm/libsql/migrator";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  console.log("Migrate starting ...");
  await migrate(db, {
    migrationsFolder: resolve(__dirname, "../../../migrations"),
  });
  console.log("Migrate finished.");
})();
