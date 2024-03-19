import { MenuUseCase } from "./menus/menu.useCase";
import { RecipeUseCase } from "./recipes/recipe.useCase";
import { UserUseCase } from "./users/user.useCase";

class Server {
  menusUseCase: MenuUseCase;
  recipeUseCase: RecipeUseCase;
  usersUseCase: UserUseCase;

  constructor() {
    this.menusUseCase = new MenuUseCase();
    this.recipeUseCase = new RecipeUseCase();
    this.usersUseCase = new UserUseCase();
  }
}

export default new Server();
