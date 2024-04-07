import { asc, eq, sql } from "drizzle-orm";
import { db } from "~/server/db/db";
import { menuRecipes, menus } from "~/server/db/schema/menu";
import {
  InsertMenuRecipeSchema,
  InsertMenuSchema,
  SelectMenuSchema,
} from "./menu.dataclass";
import { recipes } from "../db/schema/recipe";

export class MenuWriteDao {
  async insertMenu(data: InsertMenuSchema) {
    const menuId = await db
      .insert(menus)
      .values(data)
      .returning({ insertedId: menus.id });

    await this.insertMenuSearch(data.title, data.slug, data.description);

    return menuId[0].insertedId;
  }

  async deleteMenu(id: SelectMenuSchema["id"]) {
    const result = await db.select().from(menus).where(eq(menus.id, id));
    if (result.length === 0) throw Error("No menu present");
    const menu = result[0];

    await db.delete(menus).where(eq(menus.id, id));

    await this.deleteMenuSearch(menu.slug);
  }

  async addRecipeToMenu(data: InsertMenuRecipeSchema) {
    await db.insert(menuRecipes).values(data);
  }

  async insertMenuSearch(title: string, slug: string, description: string) {
    await db.run(
      sql`insert into menu_search (title, slug, description) values (${title}, ${slug}, ${description})`,
    );
  }

  async deleteMenuSearch(slug: string) {
    await db.run(sql`delete from menu_search where slug = ${slug}`);
  }
}

export class MenuReadDao {
  async selectMenuBySlug(slug: SelectMenuSchema["slug"]) {
    const result = await db.select().from(menus).where(eq(menus.slug, slug));

    return result[0];
  }

  async selectMenuById(id: SelectMenuSchema["id"]) {
    const result = await db.select().from(menus).where(eq(menus.id, id));

    return result[0];
  }

  async selectMenuRecipes(id: SelectMenuSchema["id"]) {
    const result = await db
      .select({
        id: recipes.id,
        slug: recipes.slug,
        title: recipes.title,
        description: recipes.description,
      })
      .from(menuRecipes)
      .innerJoin(recipes, eq(menuRecipes.recipeId, recipes.id))
      .where(eq(menuRecipes.menuId, id));

    return result;
  }

  async selectAllMenusPaginate(count: number, offset: number) {
    const result = await db
      .select({
        id: menus.id,
        slug: menus.slug,
        title: menus.title,
        description: menus.description,
      })
      .from(menus)
      .orderBy(asc(menus.id)) // order by is mandatory
      .limit(count)
      .offset(offset);

    return result;
  }

  async selectMenuCount() {
    const result = await db
      .select({
        count: sql<number>`cast(count(${menus.id}) as int)`,
      })
      .from(menus);

    return result[0].count;
  }

  async searchMenus(query: string) {
    const menusResult = await db.run(
      sql`
        select id, slug, title, description from menu where slug in (
          select slug from menu_search WHERE menu_search MATCH lower(${query})
          UNION
          select slug from menu where id in (
            select mr.menu_id from recipe r
            join menu_recipe mr on r.id = mr.recipe_id
            where slug in (
              select slug from recipe_search WHERE recipe_search MATCH lower(${query})
            )
          )
        );
      `,
    );

    return menusResult.rows;
  }
}
