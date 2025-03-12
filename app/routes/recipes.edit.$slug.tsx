import { useState } from "react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  useActionData,
  useLoaderData,
  redirect,
} from "react-router";
import RecipeForm from "~/components/form/recipeForm";
import RecipeFormError from "~/components/form/FormError";
import Server from "~/server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await Server.authUseCase.requireUserId(request);

  const slug = params.slug as string;

  const data = await Server.recipeUseCase.getFullRecipe(slug);

  if (!data) return redirect("/recipes");

  return { data };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const _action = formData.get("_action");

  if (_action == "cancel") return redirect("/recipes");

  const { recipeId, recipe, errors } =
    Server.recipeUseCase.recipeFormValidator(formData);

  if (recipeId === null) errors.push("Recipe not found to update.");

  if (errors.length > 0) {
    return { errors };
  }

  const { success, recipeSlug } = await Server.recipeUseCase.updateRecipe(
    recipeId!,
    recipe,
  );

  if (success === false) {
    return {
      errors: ["Error saving recipe to our database."],
    };
  }

  return redirect(`/recipes/${recipeSlug}`);
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
  // const [imageUrls, setImageUrls] = useState<string[]>(
  //   data.images.map((image) => image.url),
  // );

  return (
    <div className="mx-auto mt-16 max-w-2xl">
      <h1 className="mb-4 text-center text-6xl font-bold tracking-tight text-gray-900 sm:text-4xl">
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
        // imageUrls={imageUrls}
        // setImageUrls={setImageUrls}
      />
    </div>
  );
}
