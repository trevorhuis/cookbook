import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { useState } from "react";
import FormError from "~/components/form/FormError";
import Server from "~/server";
import MenuForm from "~/components/form/menuForm";

export async function loader({ request }: LoaderFunctionArgs) {
  await Server.authUseCase.requireUserId(request);

  return {};
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const _action = formData.get("_action");

  if (_action == "cancel") return redirect("/menus");

  const { menu, errors } = Server.menusUseCase.menuFormValidator(formData);

  if (errors.length > 0) {
    return json({ errors });
  }

  const { success, menuSlug } = await Server.menusUseCase.createMenu(menu);

  if (success === false) {
    return json({
      errors: ["Error saving menu to our database."],
    });
  }

  return redirect(`/menus/${menuSlug}`);
}

export default function CreateMenuPage() {
  const actionData = useActionData<typeof action>();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  return (
    <div className="mx-auto mt-16 max-w-2xl">
      <h1 className="mb-4 text-center text-6xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Your Next Masterpiece
      </h1>
      {actionData?.errors && <FormError errors={actionData?.errors} />}
      <MenuForm
        menuId={null}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
      />
    </div>
  );
}
