import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { recipes } from "./recipe.server";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const menus = sqliteTable("menu", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const menuRecipes = sqliteTable("menu_recipe", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  menuId: integer("menu_id", { mode: "number" })
    .notNull()
    .references(() => menus.id, { onDelete: "cascade" }),
  recipeId: integer("recipe_id", { mode: "number" })
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
});

export const insertMenuSchema = createInsertSchema(menus);
export const selectMenuSchema = createSelectSchema(menus);

export type InsertMenuSchema = z.infer<typeof insertMenuSchema>;
export type SelectMenuSchema = z.infer<typeof selectMenuSchema>;

export const insertMenuRecipeSchema = createInsertSchema(menuRecipes);
export const selectMenuRecipeSchema = createSelectSchema(menuRecipes);

export type InsertMenuRecipeSchema = z.infer<typeof insertMenuRecipeSchema>;
export type SelectMenuRecipeSchema = z.infer<typeof selectMenuRecipeSchema>;
