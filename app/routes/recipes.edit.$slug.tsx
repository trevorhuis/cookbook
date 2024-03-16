import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import RecipeForm from "~/components/recipeForm";
import RecipeFormError from "~/components/recipeForm/recipeFormError";
import {
  getRecipeBySlugWithDetails,
  updateRecipe,
} from "~/resources/recipe.server";
import { requireUserId } from "~/session.server";
import { recipeFormValidator } from "~/utils";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireUserId(request);

  const slug = params.slug as string;

  const data = await getRecipeBySlugWithDetails(slug);

  if (!data) return redirect("/recipes");

  return { data };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  if (_action == "cancel") return redirect("/recipes");

  const { recipeId, recipe, errors } = recipeFormValidator(values);

  if (recipeId === null) errors.push("Recipe not found to update.");

  if (errors.length > 0) {
    return json({ errors });
  }

  const result = await updateRecipe(recipeId!, recipe);
  if (result === null) return redirect("/recipes");
  return redirect(`/recipes/${result.slug}`);
}

export default function EditRecipePage() {
  const { data } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const [title, setTitle] = useState<string>(data.recipe.title);
  const [description, setDescription] = useState<string>(
    data.recipe.description,
  );
  const [cookTime, setCookTime] = useState<number | null>(data.recipe.cookTime);
  const [prepTime, setPrepTime] = useState<number | null>(data.recipe.prepTime);
  const [servings, setServings] = useState<number | null>(data.recipe.servings);
  const [tags, setTags] = useState<string[]>(data.tags.map((tag) => tag.tag));
  const [ingredients, setIngredients] = useState<string[]>(
    data.ingredients.map((ingredient) => ingredient.ingredient),
  );
  const [steps, setSteps] = useState<string[]>(
    data.steps.map((step) => step.step),
  );

  return (
    <div className="mx-auto max-w-2xl mt-16">
      <h1 className="text-6xl text-center font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
        {title}
      </h1>
      {actionData?.errors && <RecipeFormError errors={actionData?.errors} />}
      <RecipeForm
        recipeId={data.recipe.id}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        servings={servings}
        setServings={setServings}
        cookTime={cookTime}
        setCookTime={setCookTime}
        prepTime={prepTime}
        setPrepTime={setPrepTime}
        tags={tags}
        setTags={setTags}
        ingredients={ingredients}
        setIngredients={setIngredients}
        steps={steps}
        setSteps={setSteps}
      />
    </div>
  );
}
