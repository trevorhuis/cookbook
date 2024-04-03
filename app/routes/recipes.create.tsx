import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { useState } from "react";
import RecipeForm from "~/components/form/recipeForm";
import RecipeFormError from "~/components/form/FormError";
import Server from "~/server";

export async function loader({ request }: LoaderFunctionArgs) {
  await Server.authUseCase.requireUserId(request);

  return {};
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const _action = formData.get("_action");

  if (_action == "cancel") return redirect("/recipes");

  const { recipe, errors } = Server.recipeUseCase.recipeFormValidator(formData);

  if (errors.length > 0) {
    return json({ errors });
  }

  const { success, recipeSlug } =
    await Server.recipeUseCase.createRecipe(recipe);

  if (success === false) {
    return json({
      errors: ["Error saving recipe to our database."],
    });
  }

  return redirect(`/recipes/${recipeSlug}`);
}

export default function CreateRecipePage() {
  const actionData = useActionData<typeof action>();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [servings, setServings] = useState<number | null>(null);
  const [cookTime, setCookTime] = useState<number | null>(null);
  const [prepTime, setPrepTime] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>([""]);
  // const [imageUrls, setImageUrls] = useState<string[]>([]);

  return (
    <div className="mx-auto mt-16 max-w-2xl">
      <h1 className="mb-4 text-center text-6xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Your Next Masterpiece
      </h1>
      {actionData?.errors && <RecipeFormError errors={actionData?.errors} />}
      <RecipeForm
        recipeId={null}
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
