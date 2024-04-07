import { asc, eq, sql } from "drizzle-orm";
import { db } from "../db/db";
import {
  // recipeImages,
  recipeIngredients,
  recipeSteps,
  recipeTags,
  recipes,
} from "../db/schema/recipe";
import {
  // InsertRecipeImageSchema,
  InsertRecipeIngredientSchema,
  InsertRecipeSchema,
  InsertRecipeStepSchema,
  InsertRecipeTagSchema,
  // SelectRecipeImageSchema,
  SelectRecipeIngredientSchema,
  SelectRecipeSchema,
  SelectRecipeStepSchema,
  SelectRecipeTagSchema,
} from "./recipe.dataclass";

export class RecipeWriteDao {
  async insertRecipe(data: InsertRecipeSchema) {
    const recipeId = await db
      .insert(recipes)
      .values({
        ...data,
        updatedAt: sql`CURRENT_TIMESTAMP`,
        createdAt: sql`CURRENT_TIMESTAMP`,
      })
      .returning({ insertedId: recipes.id });

    await this.insertRecipeSearch(data.title, data.slug, data.description);

    return recipeId[0].insertedId;
  }
  async insertRecipeSteps(steps: InsertRecipeStepSchema[]) {
    await db.insert(recipeSteps).values(steps);
  }

  async insertRecipeIngredients(ingredients: InsertRecipeIngredientSchema[]) {
    await db.insert(recipeIngredients).values(ingredients);
  }

  async insertRecipeTags(tags: InsertRecipeTagSchema[]) {
    await db.insert(recipeTags).values(tags);
  }

  // async insertRecipeImages(images: InsertRecipeImageSchema[]) {
  //   await db.insert(recipeImages).values(images);
  // }

  async deleteRecipe(id: SelectRecipeSchema["id"]) {
    const result = await db.select().from(recipes).where(eq(recipes.id, id));
    if (result.length === 0) throw Error("No recipe present");
    const recipe = result[0];

    await db
      .delete(recipes)
      .where(eq(recipes.id, id))
      .returning({ deletedId: recipes.id });

    await this.deleteRecipeSearch(recipe.title);
  }

  async insertRecipeSearch(title: string, slug: string, description: string) {
    await db.run(
      sql`insert into recipe_search (title, slug, description) values (${title}, ${slug}, ${description})`,
    );
  }

  async deleteRecipeSearch(slug: string) {
    await db.run(sql`delete from recipe_search where slug = ${slug}`);
  }
}

export class RecipeReadDao {
  async selectRecipeById(id: SelectRecipeSchema["id"]) {
    const recipe = await db.select().from(recipes).where(eq(recipes.id, id));

    return recipe[0];
  }

  async selectRecipeBySlug(slug: SelectRecipeSchema["slug"]) {
    const recipe = await db
      .select()
      .from(recipes)
      .where(eq(recipes.slug, slug));

    return recipe[0];
  }

  async selectRecipeSteps(id: SelectRecipeStepSchema["id"]) {
    return await db
      .select()
      .from(recipeSteps)
      .where(eq(recipeSteps.recipeId, id))
      .all();
  }

  async selectRecipeTags(id: SelectRecipeTagSchema["id"]) {
    return await db
      .select()
      .from(recipeTags)
      .where(eq(recipeTags.recipeId, id))
      .all();
  }

  async selectRecipeIngredients(id: SelectRecipeIngredientSchema["id"]) {
    return await db
      .select()
      .from(recipeIngredients)
      .where(eq(recipeIngredients.recipeId, id))
      .all();
  }

  // async selectRecipeImages(id: SelectRecipeImageSchema["id"]) {
  //   return await db
  //     .select()
  //     .from(recipeImages)
  //     .where(eq(recipeImages.id, id))
  //     .all();
  // }

  async selectAllRecipesPaginate(limit: number, offset: number) {
    const recipesResult = await db
      .select({
        id: recipes.id,
        slug: recipes.slug,
        title: recipes.title,
        description: recipes.description,
      })
      .from(recipes)
      .orderBy(asc(recipes.id)) // order by is mandatory
      .limit(limit)
      .offset(offset);

    return recipesResult;
  }

  async selectRecipeCount() {
    const result = await db
      .select({
        count: sql<number>`cast(count(${recipes.id}) as int)`,
      })
      .from(recipes);

    return result[0].count;
  }

  async selectRandomRecipes(count: number) {
    const result = await db
      .select()
      .from(recipes)
      .orderBy(sql`RANDOM()`)
      .limit(count)
      .all();

    return result;
  }

  async queryRecipes(query: string) {
    const recipesResult = await db.run(
      sql`select id, slug, title, description from recipe where slug in (select slug from recipe_search WHERE recipe_search MATCH lower(${query}));`,
    );

    return recipesResult.rows;
  }
}
