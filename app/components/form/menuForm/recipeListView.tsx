import { Link } from "react-router";
import { type SearchResult } from "~/server/types/search";

type RecipeListProps = {
  recipes: SearchResult[];
  showButtons?: boolean;
};

export default function RecipeList(props: RecipeListProps) {
  const { recipes, showButtons } = props;

  return (
    <ul className="divide-y divide-gray-100">
      {recipes.map((recipe, idx) => (
        <li
          key={recipe.id}
          className="flex items-center justify-between gap-x-6 py-5"
        >
          <div className="min-w-0">
            <div className="flex items-start gap-x-3">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                {recipe.title}
              </p>
            </div>
            <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
              <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                <circle cx={1} cy={1} r={1} />
              </svg>
              <p className="truncate">{recipe.description}</p>
            </div>
          </div>
          {showButtons === true && (
            <div className="flex flex-none items-center gap-x-4">
              <Link
                to={`/recipes/${recipe.slug}`}
                target="_blank"
                rel="noreferrer"
                className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
              >
                View Recipe
              </Link>
              <button
                name="_action"
                value="addRecipeToMenu"
                className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-teal-900 shadow-sm ring-1 ring-inset ring-teal-300 hover:bg-teal-50 sm:block"
              >
                Add Recipe
              </button>
              <input type="hidden" name="recipeId" value={recipe.id} />
            </div>
          )}
          {showButtons === false && (
            <input type="hidden" name={`recipeMenu_${idx}`} value={recipe.id} />
          )}
        </li>
      ))}
    </ul>
  );
}
