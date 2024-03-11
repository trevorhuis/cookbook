import { z } from "zod";
import dayjs from "dayjs";
import {
  InsertRecipeIngredientSchema,
  InsertRecipeSchema,
  InsertRecipeStepSchema,
  InsertRecipeTagSchema,
  SelectRecipeIngredientSchema,
  SelectRecipeSchema,
  SelectRecipeStepSchema,
  SelectRecipeTagSchema,
} from "~/db/schema/recipe.server";
import {
  createRecipe,
  createRecipeIngredients,
  createRecipeSteps,
  createRecipeTags,
  getRecipeBySlug,
  getRecipeIngredients,
  getRecipeSteps,
  getRecipeTags,
} from "~/models/recipe.server";
import { createSlug } from "~/utils";

export const SaveRecipe = z.object({
  title: z.string(),
  description: z.string(),
  steps: z.array(z.string()),
  tags: z.array(z.string()),
  ingredients: z.array(z.string()),
});

export async function saveRecipe(recipe: z.infer<typeof SaveRecipe>) {
  const recipeInsert: InsertRecipeSchema = {
    description: recipe.description,
    slug: createSlug(recipe.title),
    title: recipe.title,
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

  //   const recipeImages = recipe.images.map((url: string): InsertRecipeImageSchema => {
  //     return {
  //         recipeId,
  //         url
  //     }
  //   })
  await createRecipeTags(recipeTags);
  await createRecipeSteps(recipeSteps);
  await createRecipeIngredients(recipeIngredients);
  //   await createRecipeImages(recipeImages);

  return recipeId;
}

export async function getRecipeBySlugWithDetails(
  slug: SelectRecipeSchema["slug"],
): Promise<{
  recipe: SelectRecipeSchema;
  steps: SelectRecipeStepSchema[];
  tags: SelectRecipeTagSchema[];
  ingredients: SelectRecipeIngredientSchema[];
} | null> {
  const recipe = await getRecipeBySlug(slug);

  recipe.updatedAt = dayjs(recipe.updatedAt).format("MMMM DD, YYYY");

  const [steps, tags, ingredients] = await Promise.all([
    getRecipeSteps(recipe.id),
    getRecipeTags(recipe.id),
    getRecipeIngredients(recipe.id),
  ]);

  return {
    recipe,
    steps,
    tags,
    ingredients,
  };
}
