import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  redirect,
  useActionData,
} from "react-router";
import { useState } from "react";
import Server from "~/server";
import { logger } from "~/utils";
import FormError from "~/components/form/FormError";
import { Form } from "react-router";
import SearchBar from "~/components/searchBar";
import { type SearchResult } from "~/server/types/search";
import RecipeList from "~/components/form/menuForm/recipeListView";
import CancelSaveButtons from "~/components/form/cancelSaveButtons";
import DescriptionInput from "~/components/form/inputs/descriptionInput";
import TitleInput from "~/components/form/inputs/titleInput";

export async function loader({ request }: LoaderFunctionArgs) {
  await Server.authUseCase.requireUserId(request);

  return {};
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const _action = formData.get("_action");

  const emptyMenuDefaults = {
    title: "",
    description: "",
    searchText: "",
    selectedRecipes: [] as SearchResult[],
    searchRecipes: [] as SearchResult[],
  };

  if (_action == "cancel") return redirect("/menus");

  try {
    const { ...values } = Object.fromEntries(formData);

    const selectedRecipes = [];

    for (const key in values) {
      if (key.includes("recipeMenu_")) {
        const recipeId = parseInt(values[key] as string);
        const result = await Server.recipeUseCase.getRecipeById(recipeId);
        if (result.success === false) {
          return {
            errors: ["Error adding recipe"],
            ...emptyMenuDefaults,
          };
        }
        selectedRecipes.push(result.recipe);
      }
    }

    const title = values["title"] as string;
    const description = values["description"] as string;

    if (_action == "searchRecipes") {
      const search = formData.get("searchText") as string;
      const recipesResult = await Server.recipeUseCase.searchRecipes(search);

      if (recipesResult.success === false) {
        return {
          errors: ["Error fetching recipes"],
          ...emptyMenuDefaults,
        };
      }
      return {
        errors: [] as string[],
        searchRecipes: recipesResult.recipes,
        selectedRecipes,
        title,
        description,
        searchText: search,
      };
    }

    if (_action == "addRecipeToMenu") {
      const recipeId = formData.get("recipeId");
      const result = await Server.recipeUseCase.getRecipeById(
        parseInt(recipeId as string),
      );
      selectedRecipes.push(result.recipe);
      if (result.success === false) {
        return { errors: ["Error adding recipe"], ...emptyMenuDefaults };
      }

      return {
        errors: [],
        searchRecipes: [],
        selectedRecipes,
        title,
        description,
        searchText: "",
      };
    }
  } catch (error) {
    logger.error(error);
    return {
      errors: ["Error saving menu to our database."],
      ...emptyMenuDefaults,
    };
  }

  if (_action == "save") {
    const { menu, errors } = Server.menusUseCase.menuFormValidator(formData);

    if (errors.length > 0) {
      return { errors, ...emptyMenuDefaults };
    }

    const { success, menuSlug } = await Server.menusUseCase.createMenu(menu);

    if (success === false) {
      return {
        errors: ["Error saving menu to our database."],
        ...emptyMenuDefaults,
      };
    }

    return redirect(`/menus/${menuSlug}`);
  }

  return { errors: ["Invalid action"], ...emptyMenuDefaults };
}

export default function CreateMenuPage() {
  const actionData = useActionData<typeof action>();

  const recipeSearchResults =
    actionData !== undefined ? actionData.searchRecipes! : [];

  const selectedRecipes =
    actionData !== undefined ? actionData.selectedRecipes! : [];

  const [title, setTitle] = useState<string>(
    actionData !== undefined ? actionData.title : "",
  );
  const [description, setDescription] = useState<string>(
    actionData !== undefined ? actionData.description : "",
  );
  const [searchText, setSearchText] = useState<string>(
    actionData !== undefined ? actionData.searchText : "",
  );

  return (
    <div className="mx-auto mt-16 max-w-2xl">
      <h1 className="mb-4 text-center text-6xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Your Next Masterpiece
      </h1>
      {actionData !== undefined && <FormError errors={actionData?.errors} />}
      <Form
        method="POST"
        className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
      >
        {/* {menuId !== null && (
          <input type="hidden" name="menuId" value={menuId} />
        )} */}
        <div className="px-4 py-6 sm:p-8">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <TitleInput title={title} setTitle={setTitle} />

            {/* <ImagesInput imageUrls={imageUrls} setImageUrls={setImageUrls} /> */}

            <DescriptionInput
              description={description}
              setDescription={setDescription}
            />

            <div className="col-span-full mt-1">
              <h2 className="text-lg font-semibold text-gray-900">
                Selected Recipes
              </h2>
              {selectedRecipes !== null && (
                <RecipeList recipes={selectedRecipes} showButtons={false} />
              )}
            </div>

            <div className="col-span-full mt-1">
              <input name="searchText" value={searchText} hidden readOnly />
              <SearchBar setSearchText={setSearchText} />

              {recipeSearchResults !== null && (
                <RecipeList recipes={recipeSearchResults} showButtons={true} />
              )}
            </div>
          </div>
        </div>
        <CancelSaveButtons />
      </Form>
    </div>
  );
}
