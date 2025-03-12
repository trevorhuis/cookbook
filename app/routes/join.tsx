import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "react-router";
import {
  Form,
  Link,
  useActionData,
  useSearchParams,
  redirect,
} from "react-router";
import { useEffect, useRef } from "react";
import Server from "~/server";
import { type InsertUserSchema } from "~/server/users/user.dataclass";
import { safeRedirect } from "~/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await Server.authUseCase.getUserId(request);
  if (userId) return redirect("/");
  return {};
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  if (!Server.authUseCase.validateEmail(email)) {
    return { errors: { email: "Email is invalid", password: null } };
  }

  if (typeof password !== "string" || password.length === 0) {
    return { errors: { email: null, password: "Password is required" } };
  }

  if (password.length < 8) {
    return { errors: { email: null, password: "Password is too short" } };
  }

  const userSearch = await Server.usersUseCase.getUserByEmail(email);

  if (userSearch.user) {
    return {
      errors: {
        email: "A user already exists with this email",
        password: null,
      },
    };
  }

  const userInsert: InsertUserSchema = {
    email,
    password,
    userType: "USER",
  };

  const { success, userId } = await Server.usersUseCase.createUser(userInsert);

  if (!success || !userId) {
    return {
      errors: {
        email: "Failed to create a new user",
        password: null,
      },
    };
  }

  return Server.authUseCase.createUserSession({
    redirectTo,
    remember: false,
    request,
    userId,
  });
}

export const meta: MetaFunction = () => [{ title: "Sign Up" }];

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="py-18 mx-auto max-w-2xl sm:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-lg px-8">
        <h1 className="mb-8 text-center text-6xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {`Crystal's Cookbook`}
        </h1>
        <Form method="post" className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                ref={emailRef}
                id="email"
                required
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
                className="w-full rounded border border-teal-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.email ? (
                <div className="pt-1 text-red-700" id="email-error">
                  {actionData.errors.email}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                ref={passwordRef}
                name="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
                className="w-full rounded border border-teal-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.password ? (
                <div className="pt-1 text-red-700" id="password-error">
                  {actionData.errors.password}
                </div>
              ) : null}
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button
            type="submit"
            className="w-full rounded bg-teal-500 px-4 py-2 text-white hover:bg-teal-600 focus:bg-teal-400"
          >
            Create Account
          </button>
          <div className="flex items-center justify-center">
            <div className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                className="text-teal-500 underline"
                to={{
                  pathname: "/login",
                  search: searchParams.toString(),
                }}
              >
                Log in
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
