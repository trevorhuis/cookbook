import { createSlug } from "~/utils";
import { RecipeReadDao, RecipeWriteDao } from "./recipe.dao";
import {
  RecipeSearchArraySchema,
  SaveRecipeSchema,
  SelectRecipeSchema,
} from "./recipe.dataclass";
import dayjs from "dayjs";

export class RecipeUseCase {
  recipeReadDao: RecipeReadDao;
  recipeWriteDao: RecipeWriteDao;

  constructor() {
    this.recipeReadDao = new RecipeReadDao();
    this.recipeWriteDao = new RecipeWriteDao();
  }

  async getRecipeById(recipeId: number) {
    try {
      const recipe = await this.recipeReadDao.selectRecipeById(recipeId);
      return { success: true, recipe };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  }

  async getRecipeCount() {
    return await this.recipeReadDao.selectRecipeCount();
  }

  async getRandomRecipes(count: number) {
    try {
      return await this.recipeReadDao.selectRandomRecipes(count);
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getPaginatedRecipes(limit: number, offset: number) {
    try {
      return await this.recipeReadDao.selectAllRecipesPaginate(limit, offset);
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async createRecipe(data: SaveRecipeSchema) {
    const slug = createSlug(data.title);

    const recipe = await this.recipeReadDao.selectRecipeBySlug(slug);

    if (recipe) return { success: false };

    try {
      const recipeId = await this.recipeWriteDao.insertRecipe({
        title: data.title,
        slug,
        description: data.description,
        prepTime: data.prepTime,
        cookTime: data.cookTime,
        servings: data.servings,
      });

      this.createRecipeTags(recipeId, data.tags);
      this.createRecipeSteps(recipeId, data.steps);
      this.createRecipeIngredients(recipeId, data.ingredients);
      return { success: true, recipeId, recipeSlug: slug };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  }

  async updateRecipe(
    recipeId: SelectRecipeSchema["id"],
    recipe: SaveRecipeSchema,
  ) {
    try {
      await this.recipeWriteDao.deleteRecipe(recipeId);
      return await this.createRecipe(recipe);
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  }

  async deleteRecipe(recipeId: SelectRecipeSchema["id"]) {
    try {
      await this.recipeWriteDao.deleteRecipe(recipeId);
      return { success: true };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  }

  async getFullRecipe(slug: SelectRecipeSchema["slug"]) {
    const recipe = await this.recipeReadDao.selectRecipeBySlug(slug);

    recipe.updatedAt = dayjs(recipe.updatedAt).format("MMMM DD, YYYY");

    const [steps, tags, ingredients] = await Promise.all([
      this.recipeReadDao.selectRecipeSteps(recipe.id),
      this.recipeReadDao.selectRecipeTags(recipe.id),
      this.recipeReadDao.selectRecipeIngredients(recipe.id),
    ]);

    return {
      recipe,
      steps,
      tags,
      ingredients,
    };
  }

  recipeFormValidator(form: FormData) {
    const { ...values } = Object.fromEntries(form);

    let recipeId = null;
    const errors: string[] = [];

    const ingredients = [];
    const tags = [];
    const steps = [];
    // let images: string[] = [];
    let cookTime: number | null = null;
    let prepTime: number | null = null;
    let servings: number | null = null;

    for (const property in values) {
      const key = property as string;
      const value = values[property] as string;
      const inputs = key.split("_");
      if (inputs[0] === "ingredient") ingredients.push(value);
      if (inputs[0] === "tag") tags.push(value);
      if (inputs[0] === "step") steps.push(value);
    }

    // try {
    //   images = JSON.parse(values.imageUrls as string) as string[];
    // } catch {
    //   console.log("unable to parse images");
    // }

    if (values.recipeId !== undefined) {
      recipeId = parseInt(values.recipeId as string);
    }

    const title = values.title as string;
    const description = values.description as string;

    if ((values.prepTime as string) !== "") {
      const prepTimeParsed = parseInt(values.prepTime as string);
      if (isNaN(prepTimeParsed)) errors.push("Prep Time must be an integer.");
      else prepTime = prepTimeParsed;
    }

    if ((values.cookTime as string) !== "") {
      const cookTimeParsed = parseInt(values.cookTime as string);
      if (isNaN(cookTimeParsed)) errors.push("Cook Time must be an integer.");
      else cookTime = cookTimeParsed;
    }

    if ((values.servings as string) !== "") {
      const servingsParsed = parseInt(values.servings as string);
      if (isNaN(servingsParsed)) errors.push("Servings must be an integer.");
      else servings = servingsParsed;
    }

    // Form Validation
    if (ingredients.length === 0 || ingredients[0] === "")
      errors.push("There are no ingredients in the recipe.");
    if (steps.length === 0 || steps[0] === "")
      errors.push("There are no steps in the recipe.");

    if (title === undefined || title === "")
      errors.push("The title is empty for this recipe.");
    if (description === undefined || description === "")
      errors.push("The description is empty for this recipe.");

    const recipe: SaveRecipeSchema = {
      title,
      description,
      tags,
      steps,
      ingredients,
      prepTime,
      cookTime,
      servings,
    };

    return { recipeId, recipe, errors };
  }

  async createRecipeTags(
    recipeId: SelectRecipeSchema["id"],
    recipeTags: string[],
  ) {
    if (recipeTags.length === 0) return;

    const tagsToInsert = recipeTags.map((tag: string) => {
      return {
        recipeId,
        tag,
      };
    });

    await this.recipeWriteDao.insertRecipeTags(tagsToInsert);
  }

  async createRecipeSteps(
    recipeId: SelectRecipeSchema["id"],
    recipeSteps: string[],
  ) {
    if (recipeSteps.length === 0) return;

    const stepsToInsert = recipeSteps.map((step: string, idx: number) => {
      return {
        recipeId,
        step,
        stepNumber: idx + 1,
      };
    });

    this.recipeWriteDao.insertRecipeSteps(stepsToInsert);
  }

  async createRecipeIngredients(
    recipeId: SelectRecipeSchema["id"],
    recipeIngredients: string[],
  ) {
    if (recipeIngredients.length === 0) return;

    const ingredientsToInsert = recipeIngredients.map((ingredient: string) => {
      return {
        recipeId,
        ingredient,
      };
    });

    this.recipeWriteDao.insertRecipeIngredients(ingredientsToInsert);
  }

  async searchRecipes(query: string) {
    try {
      const searchResult = await this.recipeReadDao.queryRecipes(query);
      const parsedRows = await RecipeSearchArraySchema.parseAsync(searchResult);
      return { success: true, recipes: parsedRows };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  }
}
