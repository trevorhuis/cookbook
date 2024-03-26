import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import Server from "~/server";

export const action = async ({ request }: ActionFunctionArgs) =>
  Server.authUseCase.logout(request);

export const loader = async () => redirect("/");
