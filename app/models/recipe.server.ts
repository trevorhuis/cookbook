import { eq, sql } from "drizzle-orm";
import { db } from "~/db/db.server";
import {
  InsertRecipeSchema,
  InsertRecipeStepSchema,
  SelectRecipeSchema,
  recipes,
  recipeSteps,
  recipeIngredients,
  InsertRecipeIngredientSchema,
  InsertRecipeTagSchema,
  recipeTags,
  InsertRecipeImageSchema,
  recipeImages,
} from "~/db/schema/recipe.server";

export async function createRecipe(
  data: InsertRecipeSchema,
): Promise<InsertRecipeSchema["id"]> {
  const recipeId = await db
    .insert(recipes)
    .values(data)
    .returning({ insertedId: recipes.id });

  await db.run(
    sql`insert into recipe_search (title, description, slug) values (${data.title}, ${data.description}, ${data.slug})`,
  );

  return recipeId[0].insertedId;
}

export async function getRecipeById(
  id: SelectRecipeSchema["id"],
): Promise<InsertRecipeSchema | null> {
  const recipe = await db.select().from(recipes).where(eq(recipes.id, id));

  return recipe[0];
}

export async function createRecipeSteps(steps: InsertRecipeStepSchema[]) {
  await db.insert(recipeSteps).values(steps);
}

export async function createRecipeIngredients(
  ingredients: InsertRecipeIngredientSchema[],
) {
  await db.insert(recipeIngredients).values(ingredients);
}

export async function createRecipeTags(tags: InsertRecipeTagSchema[]) {
  await db.insert(recipeTags).values(tags);
}

export async function createRecipeImages(images: InsertRecipeImageSchema[]) {
  await db.insert(recipeImages).values(images);
}

export async function searchRecipes(query: string) {
  try {
    const recipes = await db.run(sql`select * from recipe_search(${query})`);
    return recipes.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}
