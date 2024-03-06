import { expect, test } from "vitest";
import { faker } from "@faker-js/faker";
import {
  createUser,
  getUserById,
  getUserByEmail,
  deleteUserByEmail,
  verifyLogin,
} from "~/models/user.server";

test("create new user & read by email", async () => {
  const email = faker.internet.email();
  const password = faker.internet.password();

  await createUser({
    email,
    password,
    userType: "USER",
  });

  const user = await getUserByEmail(email);

  expect(user).not.toBeNull();
  expect(user?.email).toBe(email);
  expect(user?.userType).toBe("USER");
});

test("create new user & read by id", async () => {
  const email = faker.internet.email();
  const password = faker.internet.password();

  const userId = await createUser({
    email,
    password,
    userType: "USER",
  });

  expect(userId).not.toBe(false);

  const user = await getUserById(userId!);
  expect(user).not.toBeNull();
  expect(user?.email).toBe(email);
  expect(user?.userType).toBe("USER");
});

test("delete user by email", async () => {
  const email = faker.internet.email();
  const password = faker.internet.password();

  await createUser({
    email,
    password,
    userType: "USER",
  });

  await deleteUserByEmail(email);

  const user = await getUserByEmail(email);
  expect(user).toBeUndefined();
});

test("verify login", async () => {
  const email = faker.internet.email();
  const password = faker.internet.password();

  await createUser({
    email,
    password,
    userType: "USER",
  });

  const user = await verifyLogin(email, password);
  expect(user).not.toBe(false);
  expect(user?.email).toBe(email);
  expect(user?.userType).toBe("USER");
});
