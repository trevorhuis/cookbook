import type { ActionFunctionArgs } from "react-router/node";
import { redirect } from "react-router/node";
import Server from "~/server";

export const action = async ({ request }: ActionFunctionArgs) =>
  Server.authUseCase.logout(request);

export const loader = async () => redirect("/");
