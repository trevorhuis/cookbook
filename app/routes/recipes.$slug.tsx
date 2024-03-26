import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";

import DeleteRecipeModal from "~/components/deleteModal";
import { useState } from "react";
import Server from "~/server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await Server.authUseCase.getUserFromRequest(request);
  const isOwner = user?.userType === "OWNER";
  const slug = params.slug as string;

  const data = await Server.recipeUseCase.getFullRecipe(slug);

  if (!data) return redirect("/recipes");

  return { data, isOwner };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const slug = params.slug as string;

  const formData = await request.formData();
  const { _action, id } = Object.fromEntries(formData);

  if (_action === "_delete") {
    const recipeId = parseInt(id as string);
    await Server.recipeUseCase.deleteRecipe(recipeId);

    return redirect("/recipes");
  }

  return redirect(`/recipes/${slug}`);
}

const Recipe = () => {
  const { data, isOwner } = useLoaderData<typeof loader>();
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const submit = useSubmit();

  function handleDelete() {
    submit(
      {
        id: data.recipe.id,
        _action: "_delete",
      },
      {
        method: "POST",
      },
    );
  }

  return (
    <div className="mx-auto mt-16 max-w-4xl">
      <h1 className="mb-4 text-center text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {data.recipe.title}
      </h1>
      <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5 md:col-span-2">
        <div className="p-4">
          <p className="text-xl font-bold leading-8 text-teal-700">
            Description
          </p>
          <p className="text-md my-4 leading-8 text-gray-700">
            {data.recipe.description}
          </p>
          <div className="grid border-t-2 md:grid-cols-2">
            <div className="grid-span-1 p-4">
              <p className="text-xl font-bold leading-8 text-teal-700">
                Ingredients
              </p>

              <ul className="list-inside list-disc">
                {data.ingredients.map((ingredient, index: number) => (
                  <li key={index} className="p-1 text-gray-900">
                    {ingredient.ingredient}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid-span-2 p-4">
              <p className="text-xl font-bold leading-8 text-teal-700">Steps</p>
              <ol className="list-inside list-decimal">
                {data.steps.map((step, index: number) => (
                  <li key={index} className="p-1 text-gray-900">
                    {step.step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <Form method="POST">
            {isOwner && (
              <div className="flex items-center justify-end gap-x-2 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                <Link
                  className="m-2 inline-flex items-center rounded-md border border-transparent bg-gray-500 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                  to={`/recipes/edit/${data.recipe.slug}`}
                >
                  Edit
                </Link>
                <button
                  type="button"
                  className="m-2 inline-flex items-center rounded-md border border-transparent bg-red-500 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                  onClick={() => setOpenDelete(true)}
                >
                  Delete
                </button>
              </div>
            )}
            <DeleteRecipeModal
              open={openDelete}
              setOpen={setOpenDelete}
              itemToDelete={"Recipe"}
              handleDelete={handleDelete}
            />
          </Form>
        </div>
      </div>
    </div>
  );
};
export default Recipe;
