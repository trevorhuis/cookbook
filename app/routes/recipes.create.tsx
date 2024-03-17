import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { useState } from "react";
import { requireUserId } from "~/session.server";
import { saveRecipe } from "~/resources/recipe.server";
import { recipeFormValidator } from "~/utils";
import RecipeForm from "~/components/recipeForm";
import RecipeFormError from "~/components/recipeForm/recipeFormError";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);

  return {};
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  if (_action == "cancel") return redirect("/recipes");

  const { recipe, errors } = recipeFormValidator(values);

  if (errors.length > 0) {
    return json({ errors });
  }

  const result = await saveRecipe(recipe);
  if (result === null) return redirect("/recipes");
  return redirect(`/recipes/${result.slug}`);
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
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  return (
    <div className="mx-auto max-w-2xl mt-16">
      <h1 className="text-6xl text-center font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
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
        imageUrls={imageUrls}
        setImageUrls={setImageUrls}
      />
    </div>
  );
}
