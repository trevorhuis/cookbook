import { eq } from "drizzle-orm";
import { db } from "~/server/db/db";
import { menuRecipes, menus } from "~/server/db/schema/menu";
import {
  InsertMenuRecipeSchema,
  InsertMenuSchema,
  SelectMenuSchema,
} from "./menu.dataclass";

export class MenuWriteDao {
  async insertMenu(data: InsertMenuSchema) {
    await db.insert(menus).values(data);
  }

  async deleteMenu(id: SelectMenuSchema["id"]) {
    await db.delete(menus).where(eq(menus.id, id));
  }

  async addRecipeToMenu(data: InsertMenuRecipeSchema) {
    await db.insert(menuRecipes).values(data);
  }
}

export class MenuReadDao {}
