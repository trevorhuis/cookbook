import { ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Paginator from "~/components/paginator";
import ItemGrid from "~/components/itemGrid";
import SearchBar from "~/components/searchBar";
import Server from "~/server";

export async function loader() {
  const { menus } = await Server.menusUseCase.getPaginatedMenus(8, 0);
  const menuCount = await Server.menusUseCase.getMenuCount();

  return { menus, menuCount, error: null };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  const skip = (parseInt(values.page as string) - 1) * 8;

  if (values.searchText === "") {
    const { menus } = await Server.menusUseCase.getPaginatedMenus(8, skip);
    const menuCount = await Server.menusUseCase.getMenuCount();

    return { menus, menuCount, shouldShowPaginator: true };
  }

  const { menus } = await Server.menusUseCase.searchMenus(
    values.searchText as string,
  );
  return { menus, menuCount: 1, shouldShowPaginator: false };
}

export default function MenusPage() {
  let { menus, menuCount } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  if (actionData) {
    menus = actionData.menus!;
    menuCount = actionData.menuCount;
  }

  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  return (
    <div className="mx-auto mt-24 max-w-4xl px-4 sm:px-6 lg:px-8">
      <Form method="post">
        <input name="page" value={page} hidden readOnly />
        <input name="searchText" value={searchText} hidden readOnly />
        <SearchBar setSearchText={setSearchText} />

        <div className="m-4">
          {menuCount === 0 && <p className="mt-6 text-xl">No menus found</p>}
          {menuCount > 0 && (
            <>
              <div className="mt-6 py-4">
                <ItemGrid items={menus} itemType="menus" />
              </div>

              {searchText === "" && menus.length > 0 && (
                <Paginator page={page} setPage={setPage} length={menuCount} />
              )}
            </>
          )}
        </div>
      </Form>
    </div>
  );
}
