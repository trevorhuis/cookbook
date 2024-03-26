import { faker } from "@faker-js/faker";
import { expect, test } from "vitest";
import {
  InsertUserSchema,
  SelectUserSchema,
  insertUserSchema,
  selectUserSchema,
} from "~/server/users/user.dataclass";
import { UserUseCase } from "~/server/users/user.useCase";

test("create a new user", async () => {
  const userUseCase = new UserUseCase();

  const newUser: InsertUserSchema = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    userType: "USER",
  };

  const createResult = await userUseCase.createUser(newUser);
  expect(createResult.success).toBe(true);
  expect(createResult.userEmail).toBe(newUser.email);

  const { success, user } = await userUseCase.getUserByEmail(newUser.email);
  expect(success).toBe(true);
  expect(user!.email).toBe(newUser.email);
});

test("user data classes", async () => {
  const newUserInsert: InsertUserSchema = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    userType: "USER",
  };

  insertUserSchema.parse(newUserInsert);

  expect(newUserInsert.email).toBeTypeOf("string");
  expect(newUserInsert.password).toBeTypeOf("string");
  expect(newUserInsert.userType).toBeTypeOf("string");

  const newUserSelect: SelectUserSchema = {
    email: faker.internet.email(),
    userType: "USER",
    createdAt: null,
    updatedAt: null,
  };

  selectUserSchema.parse(newUserSelect);

  expect(newUserSelect.email).toBeTypeOf("string");
});
