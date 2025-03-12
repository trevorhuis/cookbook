import "@testing-library/jest-dom/vitest";
import { sql } from "drizzle-orm";
import { beforeEach } from "vitest";
import { db } from "~/server/db/db";
import { menus } from "~/server/db/schema/menu";
import { recipes } from "~/server/db/schema/recipe";
import { users } from "~/server/db/schema/user";
import { logger } from "~/utils";

beforeEach(async () => {
  try {
    await db.delete(users);
    await db.delete(recipes);
    await db.delete(menus);
    await db.run(sql`delete from recipe_search;`);
    await db.run(sql`delete from menu_search;`);
  } catch (error) {
    logger.error(error);
  }
});
