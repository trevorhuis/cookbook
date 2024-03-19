import { RecipeDAO } from "./recipe.dao";

export class RecipeUseCase {
  recipeDao: RecipeDAO;

  constructor() {
    this.recipeDao = new RecipeDAO();
  }
}
