import { eq } from "drizzle-orm";
import { db } from "~/.server/db/db";
import {
  InsertMenuRecipeSchema,
  InsertMenuSchema,
  SelectMenuRecipeSchema,
  SelectMenuSchema,
  menuRecipes,
  menus,
} from "~/.server/db/schema/menu.server";

export async function createMenu(data: InsertMenuSchema) {
  const menuId = await db
    .insert(menus)
    .values(data)
    .returning({ insertedId: menus.id });

  return menuId;
}

export async function updateMenu(data: SelectMenuSchema) {
  await db
    .update(menus)
    .set({ title: data.title, description: data.description })
    .where(eq(menus.id, data.id));
}

export async function deleteMenu(id: SelectMenuSchema["id"]) {
  await db.delete(menus).where(eq(menus.id, id));
}

export async function addMenuRecipe(data: InsertMenuRecipeSchema) {
  await db.insert(menuRecipes).values(data);
}

export async function deleteMenuRecipe(id: SelectMenuRecipeSchema["id"]) {
  await db.delete(menuRecipes).where(eq(menuRecipes.id, id));
}
