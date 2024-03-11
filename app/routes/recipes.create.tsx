import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  TagsInput,
  DescriptionInput,
  IngredientsInput,
  StepsInput,
  TitleInput,
} from "~/components/forms";
import { Form, useSubmit } from "@remix-run/react";
import { useState } from "react";
import { requireUserId } from "~/session.server";
import { SaveRecipe, saveRecipe } from "~/resources/recipe.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);

  return {};
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const _action = formData.get("_action");

  if (_action == "cancel") return redirect("/recipes");

  const recipe = JSON.parse(formData.get("recipe") as string);

  const saveRecipeObject = SaveRecipe.parse(recipe);
  const recipeId = await saveRecipe(saveRecipeObject);

  return redirect(`/recipes/${recipeId}`);
}

export default function CreateRecipePage() {
  const submit = useSubmit();

  const [title, setTitle] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState<string>("");
  //   const [imageUrl, setImageUrl] = useState<string>("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>([""]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const $form = event.currentTarget;
    const formData = new FormData($form);

    const recipe = {
      title,
      description,
      ingredients,
      steps,
      tags,
      //   photoUrl: imageUrl,
    };

    formData.set("recipe", JSON.stringify(recipe));

    submit(formData, {
      // @ts-expect-error method may be undefined
      method: $form.getAttribute("method") ?? $form.method,
      action: $form.getAttribute("action") ?? $form.action,
    });
  };
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mt-4">
        <Form
          onSubmit={handleSubmit}
          method="post"
          className="space-y-8 divide-gray-200"
        >
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Create a New Recipe
          </h3>

          <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
            <TitleInput title={title} setTitle={setTitle} />

            <TagsInput tags={tags} setTags={setTags} />

            <DescriptionInput
              description={description}
              setDescription={setDescription}
            />

            <StepsInput steps={steps} setSteps={setSteps} />

            <IngredientsInput
              ingredients={ingredients}
              setIngredients={setIngredients}
            />

            {/* <ImagesInput setImageUrl={setImageUrl} /> */}
          </div>

          {/* {imageUrl && (
            <div className="mx-auto items-center">
              { <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckIcon
                  className="h-6 w-6 text-green-600"
                  aria-hidden="true"
                />
              </div> }
              <div className="mt-3 text-center sm:mt-5">Upload successful</div>
            </div>
          )} */}
          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="submit"
                name="_action"
                value="cancel"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                name="_action"
                value="save"
                disabled={false}
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-600"
              >
                Save
              </button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
