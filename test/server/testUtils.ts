import { faker } from "@faker-js/faker";

export function createFakeMenu() {
  return {
    title: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    recipes: [] as number[],
  };
}

export function createFakeRecipe() {
  return {
    title: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    prepTime: faker.number.int(60),
    cookTime: faker.number.int(60),
    servings: faker.number.int(10),
    steps: [faker.lorem.words(3)],
    ingredients: [faker.lorem.words(3)],
    tags: [faker.lorem.words(3)],
  };
}
