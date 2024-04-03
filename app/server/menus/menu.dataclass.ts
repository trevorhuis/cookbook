import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { menuRecipes, menus } from "../db/schema/menu";

export const insertMenuSchema = createInsertSchema(menus);
export const selectMenuSchema = createSelectSchema(menus);

export type InsertMenuSchema = z.infer<typeof insertMenuSchema>;
export type SelectMenuSchema = z.infer<typeof selectMenuSchema>;

export const insertMenuRecipeSchema = createInsertSchema(menuRecipes);
export const selectMenuRecipeSchema = createSelectSchema(menuRecipes);

export type InsertMenuRecipeSchema = z.infer<typeof insertMenuRecipeSchema>;
export type SelectMenuRecipeSchema = z.infer<typeof selectMenuRecipeSchema>;

export type SaveMenuSchema = {
  title: string;
  description: string;
  recipes: number[];
};
