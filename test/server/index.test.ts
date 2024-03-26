import { expect, test } from "vitest";
import Server from "~/server";

test("create a new server objects", async () => {
  expect(Server.authUseCase).toBeDefined();
  expect(Server.menusUseCase).toBeDefined();
  expect(Server.recipeUseCase).toBeDefined();
  expect(Server.usersUseCase).toBeDefined();
});
