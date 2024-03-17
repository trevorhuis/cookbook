import { expect, test } from "vitest";
import { createSlug } from "~/utils";

test("create new recipe and find by id", async () => {
  const title = "Cranberry Sauce";

  const slug = createSlug(title);
  expect(slug).toBe("cranberry-sauce");
});

test("error", async () => {
  const result = parseInt("hello");
  expect(result).toBe(NaN);
});
