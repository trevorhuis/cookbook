import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
  recipeImages,
  recipeIngredients,
  recipeSteps,
  recipeTags,
  recipes,
} from "../db/schema/recipe";

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

export type SaveRecipeSchema = {
  title: string;
  description: string;
  tags: string[];
  steps: string[];
  ingredients: string[];
  prepTime: number | null;
  cookTime: number | null;
  servings: number | null;
};

export const RecipeSearchSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
});

export const RecipeSearchArraySchema = z.array(RecipeSearchSchema);
