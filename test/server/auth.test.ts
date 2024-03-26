import { sql } from "drizzle-orm";
import { expect, test } from "vitest";
import { AuthUseCase } from "~/server/auth/auth.useCase";
import { db } from "~/server/db/db";
import { InsertUserSchema } from "~/server/users/user.dataclass";
import { UserUseCase } from "~/server/users/user.useCase";

test("validateEmail works", async () => {
  const authUseCase = new AuthUseCase();

  const goodEmail = "test@gmail.com";
  const badEmail = "just a string";

  expect(authUseCase.validateEmail(goodEmail)).toBe(true);
  expect(authUseCase.validateEmail(badEmail)).toBe(false);
});

test("create a session and logout", async () => {
  const authUseCase = new AuthUseCase();
  await db.run(
    sql`insert into user (id, email, password, user_type) values (1, 'test@gmail.com', 'password', 'OWNER')`,
  );

  const headers = new Headers();

  const request = new Request("http://app.com/path");

  await authUseCase.createUserSession({
    request,
    userId: 1,
    remember: false,
    redirectTo: "/",
  });

  await authUseCase.getUserFromRequest(
    new Request("http://app.com/path", {
      headers,
    }),
  );

  authUseCase.logout(request);
});

test("verify login", async () => {
  const authUseCase = new AuthUseCase();
  const userUserCase = new UserUseCase();

  const newUser: InsertUserSchema = {
    email: "test@gmail.com",
    password: "password",
    userType: "USER",
  };

  await userUserCase.createUser(newUser);

  const { success, user } = await authUseCase.verifyLogin(
    newUser.email,
    newUser.password,
  );

  expect(success).toBe(true);
  expect(user).toBeDefined();
  expect(user!.email).toBe(newUser.email);
});

test("verify login fail no user", async () => {
  const authUseCase = new AuthUseCase();

  const { success } = await authUseCase.verifyLogin(
    "test@gmail.com",
    "password",
  );

  expect(success).toBe(false);
});

test("verify login fail bad password", async () => {
  const authUseCase = new AuthUseCase();
  const userUserCase = new UserUseCase();

  const newUser: InsertUserSchema = {
    email: "test@gmail.com",
    password: "password",
    userType: "USER",
  };

  await userUserCase.createUser(newUser);

  const { success } = await authUseCase.verifyLogin(newUser.email, "wrong");

  expect(success).toBe(false);
});
