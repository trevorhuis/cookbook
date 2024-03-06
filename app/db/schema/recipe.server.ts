import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

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

export const insertRecipeSchema = createInsertSchema(recipes);
export const selectRecipeSchema = createSelectSchema(recipes);

export type InsertRecipeSchema = z.infer<typeof insertRecipeSchema>;
export type SelectRecipeSchema = z.infer<typeof selectRecipeSchema>;

export const insertRecipeIngredientSchema =
  createInsertSchema(recipeIngredients);
export const selectRecipeIngredientSchema =
  createSelectSchema(recipeIngredients);

export type InsertRecipeIngredientSchema = z.infer<
  typeof insertRecipeIngredientSchema
>;
export type SelectRecipeIngredientSchema = z.infer<
  typeof selectRecipeIngredientSchema
>;

export const insertRecipeStepSchema = createInsertSchema(recipeSteps);
export const selectRecipeStepSchema = createSelectSchema(recipeSteps);

export type InsertRecipeStepSchema = z.infer<typeof insertRecipeStepSchema>;
export type SelectRecipeStepSchema = z.infer<typeof selectRecipeStepSchema>;

export const insertRecipeTagSchema = createInsertSchema(recipeTags);
export const selectRecipeTagSchema = createSelectSchema(recipeTags);

export type InsertRecipeTagSchema = z.infer<typeof insertRecipeTagSchema>;
export type SelectRecipeTagSchema = z.infer<typeof selectRecipeTagSchema>;

export const insertRecipeImageSchema = createInsertSchema(recipeImages);
export const selectRecipeImageSchema = createSelectSchema(recipeImages);

export type InsertRecipeImageSchema = z.infer<typeof insertRecipeImageSchema>;
export type SelectRecipeImageSchema = z.infer<typeof selectRecipeImageSchema>;
