import { expect, test } from "vitest";
import { faker } from "@faker-js/faker";
import {
  createRecipe,
  getRecipeById,
  searchRecipes,
} from "~/models/recipe.server";

test("create new recipe and find by id", async () => {
  const title = faker.lorem.words(3);
  const recipeId = await createRecipe({
    title,
    description: faker.lorem.paragraph(),
    slug: faker.lorem.slug(),
    prepTime: faker.number.int(60),
    cookTime: faker.number.int(60),
    servings: faker.number.int(10),
  });

  const recipe = await getRecipeById(recipeId!);

  expect(recipe).not.toBeNull();
  expect(recipe?.id).toBe(recipeId);
  expect(recipe?.title).toBe(title);
});

test("create new recipe and search by title", async () => {
  const findTitle = "find this recipe";
  const notFindTitle = "not this recipe";
  await createRecipe({
    title: findTitle,
    description: faker.lorem.paragraph(),
    slug: faker.lorem.slug(),
    prepTime: faker.number.int(60),
    cookTime: faker.number.int(60),
    servings: faker.number.int(10),
  });

  await createRecipe({
    title: notFindTitle,
    description: faker.lorem.paragraph(),
    slug: faker.lorem.slug(),
    prepTime: faker.number.int(60),
    cookTime: faker.number.int(60),
    servings: faker.number.int(10),
  });

  const recipes = await searchRecipes("find");

  expect(recipes).not.toBeNull();
  expect(recipes.length).toBeGreaterThan(0);
  expect(recipes[0].title).toBe(findTitle);
});
