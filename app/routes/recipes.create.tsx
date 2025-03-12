import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  useActionData,
  redirect,
  Form,
} from "react-router";
import { useState } from "react";
import RecipeFormError from "~/components/form/FormError";
import Server from "~/server";
import {
  DescriptionInput,
  IngredientsInput,
  StepsInput,
  TagsInput,
  TitleInput,
  ServingsInput,
} from "~/components/form/inputs";
import CancelSaveButtons from "~/components/form/cancelSaveButtons";
import CookTimeInput from "~/components/form/inputs/cookTimeInput";
import PrepTimeInput from "~/components/form/inputs/prepTimeInput";

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
    return { errors };
  }

  const { success, recipeSlug } =
    await Server.recipeUseCase.createRecipe(recipe);

  if (success === false) {
    return {
      errors: ["Error saving recipe to our database."],
    };
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
      <Form
        method="POST"
        className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
      >
        {/* {recipeId !== null && (
          <input type="hidden" name="recipeId" value={recipeId} />
        )} */}
        <div className="px-4 py-6 sm:p-8">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <TitleInput title={title} setTitle={setTitle} />

            <ServingsInput servings={servings} setServings={setServings} />

            <PrepTimeInput prepTime={prepTime} setPrepTime={setPrepTime} />

            <CookTimeInput cookTime={cookTime} setCookTime={setCookTime} />

            <TagsInput tags={tags} setTags={setTags} />

            {/* <ImagesInput imageUrls={imageUrls} setImageUrls={setImageUrls} /> */}

            <DescriptionInput
              description={description}
              setDescription={setDescription}
            />

            <IngredientsInput
              ingredients={ingredients}
              setIngredients={setIngredients}
            />

            <StepsInput steps={steps} setSteps={setSteps} />
          </div>
        </div>
        <CancelSaveButtons />
      </Form>
    </div>
  );
}
