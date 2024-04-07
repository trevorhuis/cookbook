import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { useState } from "react";
import Server from "~/server";
import MenuForm from "~/components/form/menuForm";
import { logger } from "~/utils";
import FormError from "~/components/form/FormError";
import { SearchResult } from "~/server/types/search";

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
          return json({
            errors: ["Error adding recipe"],
            ...emptyMenuDefaults,
          });
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
        return json({
          errors: ["Error fetching recipes"],
          ...emptyMenuDefaults,
        });
      }
      return json({
        errors: [] as string[],
        searchRecipes: recipesResult.recipes,
        selectedRecipes,
        title,
        description,
        searchText: search,
      });
    }

    if (_action == "addRecipeToMenu") {
      const recipeId = formData.get("recipeId");
      const result = await Server.recipeUseCase.getRecipeById(
        parseInt(recipeId as string),
      );
      selectedRecipes.push(result.recipe);
      if (result.success === false) {
        return json({ errors: ["Error adding recipe"], ...emptyMenuDefaults });
      }

      return json({
        errors: [],
        searchRecipes: [],
        selectedRecipes,
        title,
        description,
        searchText: "",
      });
    }
  } catch (error) {
    logger.error(error);
    return json({
      errors: ["Error saving menu to our database."],
      ...emptyMenuDefaults,
    });
  }

  if (_action == "save") {
    const { menu, errors } = Server.menusUseCase.menuFormValidator(formData);

    if (errors.length > 0) {
      return json({ errors, ...emptyMenuDefaults });
    }

    const { success, menuSlug } = await Server.menusUseCase.createMenu(menu);

    if (success === false) {
      return json({
        errors: ["Error saving menu to our database."],
        ...emptyMenuDefaults,
      });
    }

    return redirect(`/menus/${menuSlug}`);
  }

  return json({ errors: ["Invalid action"], ...emptyMenuDefaults });
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
      <MenuForm
        menuId={null}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        searchText={searchText}
        setSearchText={setSearchText}
        recipeSearchResults={recipeSearchResults}
        selectedRecipes={selectedRecipes}
      />
    </div>
  );
}
