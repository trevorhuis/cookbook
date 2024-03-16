import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";

import DeleteRecipeModal from "~/components/deleteModal";
import { useState } from "react";
import { getUser } from "~/session.server";
import { deleteRecipeById } from "~/models/recipe.server";
import { getRecipeBySlugWithDetails } from "~/resources/recipe.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await getUser(request);
  const isOwner = user?.userType === "OWNER";
  const slug = params.slug as string;

  const data = await getRecipeBySlugWithDetails(slug);

  if (!data) return redirect("/recipes");

  return { data, isOwner };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const slug = params.slug as string;

  const formData = await request.formData();
  const { _action, id } = Object.fromEntries(formData);

  if (_action === "_delete") {
    const recipeId = parseInt(id as string);
    await deleteRecipeById(recipeId);

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
    <div className="mx-auto max-w-4xl mt-16">
      <h1 className="text-4xl text-center font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
        {data.recipe.title}
      </h1>
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl md:col-span-2">
        <div className="p-4">
          <p className="text-xl leading-8 text-teal-700 font-bold">
            Description
          </p>
          <p className="text-md leading-8 text-gray-700 my-4">
            {data.recipe.description}
          </p>
          <div className="grid md:grid-cols-2 border-t-2">
            <div className="grid-span-1 p-4">
              <p className="text-xl leading-8 text-teal-700 font-bold">
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
              <p className="text-xl leading-8 text-teal-700 font-bold">Steps</p>
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

  return (
    <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex content-center justify-start space-x-2">
        <p className="text-4xl font-bold text-gray-900">{data.recipe.title}</p>
        {/* <button className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={clsx(
                "h-6 w-6 hover:fill-red-500 active:animate-ping ",
                recipe.isFavorite && "",
              )}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button> */}
      </div>
      <div className="flex items-center space-x-2 mt-2">
        <span className="text-md text-gray-500">
          Published on {data.recipe.updatedAt}
        </span>
        {data.tags &&
          data.tags.length > 0 &&
          data.tags.map((tag, index: number) => (
            <div
              key={index}
              className="text-md flex-initial rounded-lg bg-teal-100 p-2 text-center font-medium text-teal-800 shadow-sm"
            >
              {tag.tag}
            </div>
          ))}
      </div>
      {/* {data.recipe. && recipe.photoUrl !== "" && (
        <div className="mb-8 mt-4 mx-right max-w-lg">
          <img
            className="object-contain rounded-md"
            src={recipe.photoUrl}
            alt={recipe.title}
          />
        </div>
      )} */}

      {data.recipe.description !== "" && (
        <p className="mt-2 text-2xl text-gray-500">Description</p>
      )}
      <p className="text-gray-900 mt-2">{data.recipe.description}</p>
      <div className="grid md:grid-cols-3 border-t-2">
        <div className="grid-span-1">
          <p className="mt-2 text-2xl text-gray-500">Ingredients</p>
          <ul className="list-inside list-disc">
            {data.ingredients.map((ingredient, index: number) => (
              <li key={index} className="p-1 text-gray-900">
                {ingredient.ingredient}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid-span-2">
          <p className="mt-2 text-2xl text-gray-500">Steps</p>
          <ol className="list-inside list-decimal">
            {data.steps.map((step, index: number) => (
              <li key={index} className="p-1 text-gray-900">
                {step.step}
              </li>
            ))}
          </ol>
        </div>
      </div>
      {isOwner && (
        <div className="flex">
          <Link
            className="m-2 inline-flex items-center rounded-md border border-transparent bg-gray-400 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
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
      <Form method="POST">
        <DeleteRecipeModal
          open={openDelete}
          setOpen={setOpenDelete}
          itemToDelete={"Recipe"}
          handleDelete={handleDelete}
        />
      </Form>
    </div>
  );
};

export default Recipe;
