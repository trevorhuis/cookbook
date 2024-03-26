import { AuthUseCase } from "~/server/auth/auth.useCase";
import { MenuUseCase } from "~/server/menus/menu.useCase";
import { RecipeUseCase } from "./recipes/recipe.useCase";
import { UserUseCase } from "./users/user.useCase";

class Server {
  menusUseCase: MenuUseCase;
  recipeUseCase: RecipeUseCase;
  usersUseCase: UserUseCase;
  authUseCase: AuthUseCase;

  constructor() {
    this.menusUseCase = new MenuUseCase();
    this.recipeUseCase = new RecipeUseCase();
    this.usersUseCase = new UserUseCase();
    this.authUseCase = new AuthUseCase();
  }
}

export default new Server();
