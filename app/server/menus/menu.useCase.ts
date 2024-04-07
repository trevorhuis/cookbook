import { createSlug, logger } from "~/utils";
import { MenuReadDao, MenuWriteDao } from "./menu.dao";
import { SaveMenuSchema } from "./menu.dataclass";
import { SearchArraySchema } from "../types/search";

export class MenuUseCase {
  menuReadDao: MenuReadDao;
  menuWriteDao: MenuWriteDao;

  constructor() {
    this.menuReadDao = new MenuReadDao();
    this.menuWriteDao = new MenuWriteDao();
  }

  async getMenuBySlug(slug: string) {
    try {
      const menu = await this.menuReadDao.selectMenuBySlug(slug);

      if (!menu) return { success: false };

      const recipes = await this.menuReadDao.selectMenuRecipes(menu.id);

      return {
        success: true,
        menu: {
          id: menu.id,
          slug: menu.slug,
          title: menu.title,
          description: menu.description,
          recipes,
        },
      };
    } catch (error) {
      logger.error(error);
      return { success: false };
    }
  }

  async getMenuCount() {
    return await this.menuReadDao.selectMenuCount();
  }

  async getPaginatedMenus(count: number, page: number) {
    try {
      const menus = await this.menuReadDao.selectAllMenusPaginate(count, page);

      return {
        success: true,
        menus,
      };
    } catch (error) {
      logger.error(error);
      return { success: false, menus: [] };
    }
  }

  async searchMenus(query: string) {
    try {
      const searchResult = await this.menuReadDao.searchMenus(query);
      const menus = await SearchArraySchema.parseAsync(searchResult);
      return {
        success: true,
        menus,
      };
    } catch (error) {
      logger.error(error);
      return { success: false };
    }
  }

  async createMenu(newMenu: SaveMenuSchema) {
    try {
      const slug = createSlug(newMenu.title);

      const menu = await this.menuReadDao.selectMenuBySlug(slug);

      if (menu) return { success: false };

      const menuId = await this.menuWriteDao.insertMenu({
        title: newMenu.title,
        description: newMenu.description,
        slug,
      });

      for (const recipeId of newMenu.recipes) {
        await this.menuWriteDao.addRecipeToMenu({ menuId, recipeId });
      }

      return { success: true, menuSlug: slug, menuId };
    } catch (error) {
      logger.error(error);
      return { success: false };
    }
  }

  async addRecipeToMenu(menuId: number, recipeId: number) {
    logger.info(`Adding recipe ${recipeId} to menu ${menuId}`);
    try {
      await this.menuWriteDao.addRecipeToMenu({ menuId, recipeId });
      return { success: true };
    } catch (error) {
      logger.error(error);
      return { success: false };
    }
  }

  async deleteMenu(id: number) {
    try {
      await this.menuWriteDao.deleteMenu(id);
      return { success: true };
    } catch (error) {
      logger.error(error);
      return { success: false };
    }
  }

  menuFormValidator(form: FormData) {
    const { ...values } = Object.fromEntries(form);

    logger.info(values);

    let menuId = null;
    const errors: string[] = [];

    const recipes = [];

    for (const property in values) {
      const key = property as string;
      const value = values[property] as string;
      const inputs = key.split("_");
      if (inputs[0] === "recipeMenu") recipes.push(parseInt(value));
    }

    if (values.menuId !== undefined) {
      menuId = parseInt(values.menuId as string);
    }

    const title = values.title as string;
    const description = values.description as string;

    // Form Validation
    if (recipes.length === 0 || recipes[0] === undefined)
      errors.push("There are no recipes in the menu.");

    if (title === undefined || title === "")
      errors.push("The title is empty for this menu.");
    if (description === undefined || description === "")
      errors.push("The description is empty for this menu.");

    const menu: SaveMenuSchema = {
      title,
      description,
      recipes,
    };

    return { menuId, menu, errors };
  }
}
