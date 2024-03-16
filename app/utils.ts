import { useMatches } from "@remix-run/react";
import { useMemo } from "react";
import { SelectUserSchema } from "./db/schema/user.server";
import _ from "lodash";
import { SaveRecipe } from "./resources/recipe.server";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT,
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string,
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id],
  ) as any; // eslint-disable-line
  return route?.data;
}

// eslint-disable-next-line
function isUser(user: any): user is SelectUserSchema {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): SelectUserSchema | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): SelectUserSchema {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.",
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function createSlug(title: string) {
  return _.kebabCase(title);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function recipeFormValidator(values: any) {
  let recipeId = null;
  const errors: string[] = [];

  const ingredients = [];
  const tags = [];

  const steps = [];

  for (const property in values) {
    const key = property as string;
    const value = values[property] as string;
    const inputs = key.split("_");
    if (inputs[0] === "ingredient") ingredients.push(value);
    if (inputs[0] === "tag") tags.push(value);
    if (inputs[0] === "step") steps.push(value);
  }

  if (values.recipe_id !== undefined) {
    recipeId = parseInt(values.recipe_id as string);
  }

  const title = values.title as string;
  const description = values.description as string;
  const prepTime = values.prep_time as string;
  const cookTime = values.cook_time as string;
  const servings = values.servings as string;

  // Form Validation
  if (ingredients.length === 0 || ingredients[0] === "")
    errors.push("There are no ingredients in the recipe.");
  if (steps.length === 0 || steps[0] === "")
    errors.push("There are no steps in the recipe.");

  if (title === undefined || title === "")
    errors.push("The title is empty for this recipe.");
  if (description === undefined || description === "")
    errors.push("The description is empty for this recipe.");

  const recipe: SaveRecipe = {
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
