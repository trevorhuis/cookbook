import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  redirect,
} from "react-router";
import { Form, Link, useLoaderData, useSubmit } from "react-router";

import DeleteModal from "~/components/deleteModal";
import { useState } from "react";
import Server from "~/server";
import ItemGrid from "~/components/itemGrid";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await Server.authUseCase.getUserFromRequest(request);
  const isOwner = user?.userType === "OWNER";
  const slug = params.slug as string;

  const { menu } = await Server.menusUseCase.getMenuBySlug(slug);

  if (!menu) return redirect("/menus");

  return { menu, isOwner };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const slug = params.slug as string;

  const formData = await request.formData();
  const { _action, id } = Object.fromEntries(formData);

  if (_action === "_delete") {
    const menuId = parseInt(id as string);
    await Server.menusUseCase.deleteMenu(menuId);

    return redirect("/menus");
  }

  return redirect(`/menus/${slug}`);
}

const Menu = () => {
  const { menu, isOwner } = useLoaderData<typeof loader>();
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const submit = useSubmit();

  function handleDelete() {
    submit(
      {
        id: menu.id,
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
        {menu.title}
      </h1>
      <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5 md:col-span-2">
        <div className="p-4">
          <p className="text-xl font-bold leading-8 text-teal-700">
            Description
          </p>
          <p className="text-md my-4 leading-8 text-gray-700">
            {menu.description}
          </p>

          <Form method="POST">
            {isOwner && (
              <div className="flex items-center justify-end gap-x-2 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                <Link
                  className="m-2 inline-flex items-center rounded-md border border-transparent bg-gray-500 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                  to={`/menus/edit/${menu.slug}`}
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
            <DeleteModal
              open={openDelete}
              setOpen={setOpenDelete}
              itemToDelete={"Menu"}
              handleDelete={handleDelete}
            />
          </Form>
        </div>
      </div>
      <div className="m-4">
        <ItemGrid items={menu.recipes} itemType="recipes" />
      </div>
    </div>
  );
};
export default Menu;
