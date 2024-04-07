import { expect, test } from "vitest";
import { MenuUseCase } from "~/server/menus/menu.useCase";
import { createFakeMenu, createFakeRecipe } from "./testUtils";
import { RecipeUseCase } from "~/server/recipes/recipe.useCase";
import { createSlug } from "~/utils";
import {
  InsertMenuSchema,
  SelectMenuSchema,
  insertMenuSchema,
  selectMenuSchema,
} from "~/server/menus/menu.dataclass";
import { faker } from "@faker-js/faker";

test("it should create a menu", async () => {
  const menuUseCase = new MenuUseCase();

  const newMenu = createFakeMenu();

  const { success, menuId } = await menuUseCase.createMenu(newMenu);
  expect(menuId).toBeGreaterThan(0);
  expect(success).toBe(true);
});

test("it should not create a menu with the same title", async () => {
  const menuUseCase = new MenuUseCase();

  const newMenu = createFakeMenu();

  const { success } = await menuUseCase.createMenu(newMenu);
  expect(success).toBe(true);

  const { success: success2 } = await menuUseCase.createMenu(newMenu);
  expect(success2).toBe(false);
});

test("it should add a menu with connected recipes", async () => {
  const menuUseCase = new MenuUseCase();
  const recipeUseCase = new RecipeUseCase();

  const newRecipe = createFakeRecipe();

  const { success, recipeId } = await recipeUseCase.createRecipe(newRecipe);
  expect(success).toBe(true);
  expect(recipeId).toBeGreaterThan(0);

  const newMenu = createFakeMenu();
  newMenu.recipes.push(recipeId!);

  const { success: successMenu, menuId } =
    await menuUseCase.createMenu(newMenu);
  expect(menuId).toBeGreaterThan(0);
  expect(successMenu).toBe(true);
});

test("it should get a menu by slug", async () => {
  const menuUseCase = new MenuUseCase();
  const recipeUseCase = new RecipeUseCase();

  const newRecipe = createFakeRecipe();

  const { recipeId } = await recipeUseCase.createRecipe(newRecipe);

  const newMenu = createFakeMenu();
  newMenu.recipes.push(recipeId!);

  const { menuId } = await menuUseCase.createMenu(newMenu);

  const slug = createSlug(newMenu.title);

  const { success, menu } = await menuUseCase.getMenuBySlug(slug);
  expect(success).toBe(true);
  expect(menu?.id).toBe(menuId);
  expect(menu?.title).toBe(newMenu.title);
  expect(menu?.recipes.length).toBe(1);
});

test("it should not get a menu by slug", async () => {
  const menuUseCase = new MenuUseCase();
  const slug = "not-a-slug";

  const { success } = await menuUseCase.getMenuBySlug(slug);
  expect(success).toBe(false);
});

test("it should delete a menu", async () => {
  const menuUseCase = new MenuUseCase();
  const recipeUseCase = new RecipeUseCase();

  const newRecipe = createFakeRecipe();

  const { recipeId } = await recipeUseCase.createRecipe(newRecipe);

  const newMenu = createFakeMenu();
  newMenu.recipes.push(recipeId!);

  const { menuId } = await menuUseCase.createMenu(newMenu);

  await menuUseCase.deleteMenu(menuId!);

  const { success } = await menuUseCase.getMenuBySlug(newMenu.title);
  expect(success).toBe(false);
});

test("it should add a recipe to a menu", async () => {
  const menuUseCase = new MenuUseCase();
  const recipeUseCase = new RecipeUseCase();

  const newRecipe = createFakeRecipe();

  const { recipeId } = await recipeUseCase.createRecipe(newRecipe);

  const newMenu = createFakeMenu();
  const { menuId } = await menuUseCase.createMenu(newMenu);

  await menuUseCase.addRecipeToMenu(menuId!, recipeId!);

  const slug = createSlug(newMenu.title);

  const { menu } = await menuUseCase.getMenuBySlug(slug);
  expect(menu?.recipes.length).toBe(1);
});

test("it should not add a recipe to a menu", async () => {
  const menuUseCase = new MenuUseCase();
  const recipeUseCase = new RecipeUseCase();

  const newRecipe = createFakeRecipe();

  const { recipeId } = await recipeUseCase.createRecipe(newRecipe);

  const newMenu = createFakeMenu();
  const { menuId } = await menuUseCase.createMenu(newMenu);

  await menuUseCase.addRecipeToMenu(menuId!, recipeId!);

  await menuUseCase.addRecipeToMenu(menuId!, recipeId!);

  const slug = createSlug(newMenu.title);

  const { menu } = await menuUseCase.getMenuBySlug(slug);
  expect(menu?.recipes.length).toBe(1);
});

test("menu data classes", async () => {
  const newMenuInsert: InsertMenuSchema = {
    title: faker.lorem.words(2),
    slug: createSlug(faker.lorem.words(2)),
    description: faker.lorem.paragraph(),
  };

  insertMenuSchema.parse(newMenuInsert);

  expect(newMenuInsert.title).toBeTypeOf("string");
  expect(newMenuInsert.slug).toBeTypeOf("string");
  expect(newMenuInsert.description).toBeTypeOf("string");

  const newMenuSelect: SelectMenuSchema = {
    id: 1,
    slug: createSlug(faker.lorem.words(2)),
    title: faker.lorem.words(2),
    description: faker.lorem.paragraph(),
    createdAt: null,
    updatedAt: null,
  };

  selectMenuSchema.parse(newMenuSelect);

  expect(newMenuSelect.slug).toBeTypeOf("string");
});

test("it should search menus by menu title", async () => {
  const menuUseCase = new MenuUseCase();
  const recipeUseCase = new RecipeUseCase();

  const newRecipe = createFakeRecipe();

  const { recipeId } = await recipeUseCase.createRecipe(newRecipe);

  const newMenu = createFakeMenu();
  newMenu.title = "menu title";
  newMenu.recipes.push(recipeId!);

  await menuUseCase.createMenu(newMenu);

  const { success, menus } = await menuUseCase.searchMenus("menu");
  expect(success).toBe(true);
  expect(menus!.length).toBeGreaterThan(0);
});

test("it should search menus by recipe title", async () => {
  const menuUseCase = new MenuUseCase();
  const recipeUseCase = new RecipeUseCase();

  const newRecipe = createFakeRecipe();
  newRecipe.title = "recipe title";

  const { recipeId } = await recipeUseCase.createRecipe(newRecipe);

  const newMenu = createFakeMenu();
  newMenu.recipes.push(recipeId!);

  await menuUseCase.createMenu(newMenu);

  const { success, menus } = await menuUseCase.searchMenus("recipe");
  expect(success).toBe(true);
  expect(menus!.length).toBeGreaterThan(0);
});
