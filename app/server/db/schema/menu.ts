import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { recipes } from "./recipe";

export const menus = sqliteTable("menu", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const menuRecipes = sqliteTable(
  "menu_recipe",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    menuId: integer("menu_id", { mode: "number" })
      .notNull()
      .references(() => menus.id, { onDelete: "cascade" }),
    recipeId: integer("recipe_id", { mode: "number" })
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
  },
  (t) => ({
    first: unique().on(t.menuId, t.recipeId),
  }),
);
