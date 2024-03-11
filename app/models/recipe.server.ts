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
): Promise<SelectRecipeSchema | null> {
  const recipe = await db.select().from(recipes).where(eq(recipes.id, id));

  return recipe[0];
}

export async function getRecipeBySlug(slug: string) {
  const recipe = await db.select().from(recipes).where(eq(recipes.slug, slug));

  return recipe[0];
}

export async function getRecipeSteps(id: number) {
  return await db
    .select()
    .from(recipeSteps)
    .where(eq(recipeSteps.recipeId, id))
    .all();
}

export async function getRecipeTags(id: number) {
  return await db
    .select()
    .from(recipeTags)
    .where(eq(recipeTags.recipeId, id))
    .all();
}

export async function getRecipeIngredients(id: number) {
  return await db
    .select()
    .from(recipeIngredients)
    .where(eq(recipeIngredients.recipeId, id))
    .all();
}

export async function createRecipeSteps(steps: InsertRecipeStepSchema[]) {
  if (steps.length > 0) await db.insert(recipeSteps).values(steps);
}

export async function createRecipeIngredients(
  ingredients: InsertRecipeIngredientSchema[],
) {
  if (ingredients.length > 0)
    await db.insert(recipeIngredients).values(ingredients);
}

export async function createRecipeTags(tags: InsertRecipeTagSchema[]) {
  if (tags.length > 0) await db.insert(recipeTags).values(tags);
}

export async function createRecipeImages(images: InsertRecipeImageSchema[]) {
  if (images.length > 0) await db.insert(recipeImages).values(images);
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

export async function getRecipes(limit: number, offset: number) {
  const recipesResult = await db
    .select()
    .from(recipes)
    .limit(limit)
    .offset(offset);

  return recipesResult;
}

export async function getRecipeCount() {
  const result = await db
    .select({
      count: sql<number>`cast(count(${recipes.id}) as int)`,
    })
    .from(recipes);

  return result[0].count;
}

export async function deleteRecipeById(id: number) {
  await db.delete(recipes).where(eq(recipes.id, id));
}
