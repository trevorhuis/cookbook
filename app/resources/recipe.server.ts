import { z } from "zod";
import dayjs from "dayjs";
import {
  InsertRecipeImageSchema,
  InsertRecipeIngredientSchema,
  InsertRecipeSchema,
  InsertRecipeStepSchema,
  InsertRecipeTagSchema,
  SelectRecipeImageSchema,
  SelectRecipeIngredientSchema,
  SelectRecipeSchema,
  SelectRecipeStepSchema,
  SelectRecipeTagSchema,
} from "~/db/schema/recipe.server";
import {
  createRecipe,
  createRecipeImages,
  createRecipeIngredients,
  createRecipeSteps,
  createRecipeTags,
  deleteRecipeById,
  getRecipeBySlug,
  getRecipeImages,
  getRecipeIngredients,
  getRecipeSteps,
  getRecipeTags,
} from "~/models/recipe.server";
import { createSlug } from "~/utils";

export type SaveRecipe = {
  title: string;
  description: string;
  tags: string[];
  steps: string[];
  ingredients: string[];
  images: string[];
  prepTime: number | null;
  cookTime: number | null;
  servings: number | null;
};

const RecipeSearchSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
});

export const RecipeSearchArraySchema = z.array(RecipeSearchSchema);
type RecipeSearchArraySchema = z.infer<typeof RecipeSearchArraySchema>;

export async function saveRecipe(recipe: SaveRecipe) {
  const recipeInsert: InsertRecipeSchema = {
    description: recipe.description,
    slug: createSlug(recipe.title),
    title: recipe.title,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    servings: recipe.servings,
  };

  const recipeId = await createRecipe(recipeInsert);

  if (!recipeId) return null;

  const recipeTags = recipe.tags.map((tag: string): InsertRecipeTagSchema => {
    return {
      recipeId,
      tag,
    };
  });

  const recipeSteps = recipe.steps.map(
    (step: string, idx: number): InsertRecipeStepSchema => {
      return {
        recipeId,
        step,
        stepNumber: idx + 1,
      };
    },
  );

  const recipeIngredients = recipe.ingredients.map(
    (ingredient: string): InsertRecipeIngredientSchema => {
      return {
        recipeId,
        ingredient,
      };
    },
  );

  const recipeImages = recipe.images.map(
    (url: string): InsertRecipeImageSchema => {
      return {
        recipeId,
        url,
      };
    },
  );

  await createRecipeTags(recipeTags);
  await createRecipeSteps(recipeSteps);
  await createRecipeIngredients(recipeIngredients);
  await createRecipeImages(recipeImages);

  return { recipeId, slug: recipeInsert.slug };
}

export async function updateRecipe(recipeId: number, recipe: SaveRecipe) {
  await deleteRecipeById(recipeId);

  return await saveRecipe(recipe);
}

export async function getRecipeBySlugWithDetails(
  slug: SelectRecipeSchema["slug"],
): Promise<{
  recipe: SelectRecipeSchema;
  steps: SelectRecipeStepSchema[];
  tags: SelectRecipeTagSchema[];
  ingredients: SelectRecipeIngredientSchema[];
  images: SelectRecipeImageSchema[];
} | null> {
  const recipe = await getRecipeBySlug(slug);

  recipe.updatedAt = dayjs(recipe.updatedAt).format("MMMM DD, YYYY");

  const [steps, tags, ingredients, images] = await Promise.all([
    getRecipeSteps(recipe.id),
    getRecipeTags(recipe.id),
    getRecipeIngredients(recipe.id),
    getRecipeImages(recipe.id),
  ]);

  return {
    recipe,
    steps,
    tags,
    ingredients,
    images,
  };
}
