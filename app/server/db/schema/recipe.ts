import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const recipes = sqliteTable("recipe", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull().unique(),
  description: text("description").notNull(),
  slug: text("slug").notNull().unique(),
  prepTime: integer("prep_time", { mode: "number" }),
  cookTime: integer("cook_time", { mode: "number" }),
  servings: integer("servings", { mode: "number" }),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const recipeIngredients = sqliteTable("recipe_ingredient", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  recipeId: integer("recipe_id", { mode: "number" })
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  ingredient: text("ingredient").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const recipeSteps = sqliteTable("recipe_step", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  recipeId: integer("recipe_id", { mode: "number" })
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  step: text("step").notNull(),
  stepNumber: integer("step_number", { mode: "number" }).notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const recipeTags = sqliteTable("recipe_tag", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  recipeId: integer("recipe_id", { mode: "number" })
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  tag: text("tag").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const recipeImages = sqliteTable("recipe_image", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  recipeId: integer("recipe_id", { mode: "number" })
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
