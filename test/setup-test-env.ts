import { installGlobals } from "@remix-run/node";
import "@testing-library/jest-dom/vitest";
import { sql } from "drizzle-orm";
import { beforeEach } from "vitest";
import { db } from "~/db/db.server";
import { recipes } from "~/db/schema/recipe.server";
import { users } from "~/db/schema/user.server";

installGlobals();

beforeEach(async () => {
  await db.delete(users);
  await db.delete(recipes);
  await db.run(sql`delete from recipe_search`);
});
