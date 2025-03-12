import { ActionFunctionArgs } from "react-router";
import { Form, useActionData, useLoaderData } from "react-router";
import { useState } from "react";
import Paginator from "~/components/paginator";
import ItemGrid from "~/components/itemGrid";
import SearchBar from "~/components/searchBar";
import Server from "~/server";

export async function loader() {
  const recipes = await Server.recipeUseCase.getPaginatedRecipes(8, 0);
  const recipeCount = await Server.recipeUseCase.getRecipeCount();
  return { recipes, recipeCount };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  const skip = (parseInt(values.page as string) - 1) * 8;

  if (values.searchText === "") {
    const recipes = await Server.recipeUseCase.getPaginatedRecipes(8, skip);
    const recipeCount = await Server.recipeUseCase.getRecipeCount();

    return { recipes, recipeCount, shouldShowPaginator: true };
  }

  const { recipes } = await Server.recipeUseCase.searchRecipes(
    values.searchText as string,
  );
  return { recipes, recipeCount: 1, shouldShowPaginator: false };
}

export default function RecipesPage() {
  let { recipes, recipeCount } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  if (actionData) {
    recipes = actionData.recipes!;
    recipeCount = actionData.recipeCount;
  }

  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  return (
    <div className="mx-auto mt-24 max-w-4xl px-4 sm:px-6 lg:px-8">
      <Form method="post">
        <input name="page" value={page} hidden readOnly />
        <input name="searchText" value={searchText} hidden readOnly />
        <SearchBar setSearchText={setSearchText} />

        {recipeCount === 0 && <p className="mt-6 text-xl">No recipes found</p>}
        {recipeCount > 0 && (
          <>
            <div className="mt-6 py-4">
              <ItemGrid items={recipes} itemType="recipes" />
            </div>

            {searchText === "" && recipes.length > 0 && (
              <Paginator page={page} setPage={setPage} length={recipeCount} />
            )}
          </>
        )}
      </Form>
    </div>
  );
}
