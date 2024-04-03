import { faker } from "@faker-js/faker";
import { expect, test, vi } from "vitest";
import { RecipeUseCase } from "~/server/recipes/recipe.useCase";
import { createSlug } from "~/utils";
import { createFakeRecipe } from "./testUtils";

function createFakeForm() {
  const formData = new FormData();

  formData.set("title", faker.lorem.words(3));
  formData.set("description", faker.lorem.paragraph());
  formData.set("prepTime", faker.number.int(60).toString());
  formData.set("cookTime", faker.number.int(60).toString());
  formData.set("servings", faker.number.int(10).toString());

  formData.set("ingredient_1", faker.lorem.words(3));
  formData.set("ingredient_2", faker.lorem.words(3));

  formData.set("step_1", faker.lorem.words(3));
  formData.set("step_2", faker.lorem.words(3));

  formData.set("tag_1", faker.lorem.words(3));
  formData.set("tag_2", faker.lorem.words(3));

  return formData;
}

test("create new recipe", async () => {
  const recipeUseCase = new RecipeUseCase();

  const newRecipe = createFakeRecipe();

  const { success, recipeId } = await recipeUseCase.createRecipe(newRecipe);
  expect(recipeId).greaterThanOrEqual(1);
  expect(success).toBe(true);
});

test("delete a recipe fail not exist", async () => {
  const recipeUseCase = new RecipeUseCase();

  const { success } = await recipeUseCase.deleteRecipe(1);
  expect(success).toBe(false);
});

test("create and delete a recipe", async () => {
  const recipeUseCase = new RecipeUseCase();

  const newRecipe = createFakeRecipe();

  const createResult = await recipeUseCase.createRecipe(newRecipe);
  expect(createResult.recipeId).greaterThanOrEqual(1);
  expect(createResult.success).toBe(true);

  const findResultPresent = await recipeUseCase.getRecipeById(
    createResult.recipeId!,
  );
  expect(findResultPresent.recipe).toBeTruthy();
  expect(findResultPresent.success).toBe(true);

  const deleteResult = await recipeUseCase.deleteRecipe(createResult.recipeId!);
  expect(deleteResult.success).toBe(true);

  const findResultAbsent = await recipeUseCase.getRecipeById(
    createResult.recipeId!,
  );
  expect(findResultAbsent.recipe).toBeFalsy();
  expect(findResultAbsent.success).toBe(true);
});

test("create new recipe fails after error", async () => {
  const recipeUseCase = new RecipeUseCase();
  const spy = vi.spyOn(recipeUseCase, "createRecipeSteps");
  spy.mockImplementationOnce(() => {
    throw Error();
  });

  const newRecipe = createFakeRecipe();

  const { success } = await recipeUseCase.createRecipe(newRecipe);
  expect(success).toBe(false);
});

test("create new recipe with empty extras", async () => {
  const recipeUseCase = new RecipeUseCase();

  const newRecipe = {
    title: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    prepTime: faker.number.int(60),
    cookTime: faker.number.int(60),
    servings: faker.number.int(10),
    steps: [],
    ingredients: [],
    tags: [],
  };

  const { success, recipeId } = await recipeUseCase.createRecipe(newRecipe);
  expect(recipeId).greaterThanOrEqual(1);
  expect(success).toBe(true);
});

test("duplicate recipe slugs should fail", async () => {
  const recipeUseCase = new RecipeUseCase();

  const newRecipe = createFakeRecipe();

  const { success, recipeId } = await recipeUseCase.createRecipe(newRecipe);
  expect(recipeId).greaterThanOrEqual(1);
  expect(success).toBe(true);

  const secondResult = await recipeUseCase.createRecipe(newRecipe);

  expect(secondResult.recipeId).toBeUndefined();
  expect(secondResult.success).toBe(false);
});

test("should be able to update a recipe", async () => {
  const recipeUseCase = new RecipeUseCase();

  const newRecipe = createFakeRecipe();

  const createResult = await recipeUseCase.createRecipe(newRecipe);
  expect(createResult.recipeId).greaterThanOrEqual(1);
  expect(createResult.success).toBe(true);

  const newDescription = faker.lorem.paragraph();
  const slugSearch = createSlug(newRecipe.title);

  const updateRecipe = {
    ...newRecipe,
    description: newDescription,
  };

  const updateResult = await recipeUseCase.updateRecipe(
    createResult.recipeId!,
    updateRecipe,
  );

  expect(updateResult.recipeId).greaterThanOrEqual(1);
  expect(updateResult.success).toBe(true);

  const { recipe } = await recipeUseCase.getFullRecipe(slugSearch);
  expect(recipe.description).toBe(newDescription);
});

test("should take FormData and return an object to save a recipe", () => {
  const recipeUseCase = new RecipeUseCase();

  const formData = createFakeForm();

  const { recipeId, recipe, errors } =
    recipeUseCase.recipeFormValidator(formData);

  expect(recipeId).toBeNull();
  expect(recipe.ingredients.length).toBe(2);
  expect(errors).toEqual([]);
});

test("should take FormData and return an object to update a recipe", () => {
  const recipeUseCase = new RecipeUseCase();

  const formData = createFakeForm();

  formData.set("recipeId", (5).toString());

  const { recipeId, recipe, errors } =
    recipeUseCase.recipeFormValidator(formData);

  expect(recipeId).toBe(5);
  expect(recipe.ingredients.length).toBe(2);
  expect(errors).toEqual([]);
});

test("should take FormData without title and return errors", () => {
  const recipeUseCase = new RecipeUseCase();

  const formData = createFakeForm();

  formData.delete("title");

  const { errors } = recipeUseCase.recipeFormValidator(formData);

  expect(errors).toEqual(["The title is empty for this recipe."]);
});

test("should take FormData without wrong integer inputs and return errors", () => {
  const recipeUseCase = new RecipeUseCase();

  const formData = createFakeForm();

  formData.set("prepTime", "string");
  formData.set("cookTime", "string");
  formData.set("servings", "string");

  const { errors } = recipeUseCase.recipeFormValidator(formData);

  expect(errors.length).toEqual(3);
});

test("empty form return all errors", () => {
  const recipeUseCase = new RecipeUseCase();

  const formData = new FormData();

  const { errors } = recipeUseCase.recipeFormValidator(formData);

  expect(errors.length).toEqual(7);
});

test("get random recipes", async () => {
  const recipesUseCase = new RecipeUseCase();

  const recipesEmpty = await recipesUseCase.getRandomRecipes(2);

  expect(recipesEmpty.length).toBe(0);

  await recipesUseCase.createRecipe(createFakeRecipe());
  await recipesUseCase.createRecipe(createFakeRecipe());
  await recipesUseCase.createRecipe(createFakeRecipe());

  const recipesPresent = await recipesUseCase.getRandomRecipes(2);
  expect(recipesPresent.length).toBe(2);
});

test("get paginated recipes and recipe count", async () => {
  const recipesUseCase = new RecipeUseCase();

  await recipesUseCase.createRecipe(createFakeRecipe());
  await recipesUseCase.createRecipe(createFakeRecipe());
  await recipesUseCase.createRecipe(createFakeRecipe());
  await recipesUseCase.createRecipe(createFakeRecipe());

  const recipeCount = await recipesUseCase.getRecipeCount();
  expect(recipeCount).toBe(4);

  const recipes = await recipesUseCase.getPaginatedRecipes(2, 2);
  expect(recipes.length).toBe(2);
});

test("search recipes", async () => {
  const recipesUseCase = new RecipeUseCase();

  const recipe = createFakeRecipe();
  await recipesUseCase.createRecipe(recipe);

  const { success, recipes } = await recipesUseCase.searchRecipes(recipe.title);
  expect(success).toBe(true);
  expect(recipes!.length).toBe(1);
});
