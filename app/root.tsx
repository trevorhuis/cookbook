import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
} from "@remix-run/react";
import styles from "~/styles/tailwind.css?url";
import Header from "./components/Header";
import { getUser } from "./session.server";
import { LoaderFunctionArgs } from "@remix-run/node";

export const links = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ user: await getUser(request) });
};

export function Layout({ children }: { children: React.ReactNode }) {
  const user = useLoaderData<typeof loader>().user;
  let isOwner = false,
    isAuthenticated = false;

  if (user) {
    isOwner = user.userType === "OWNER";
    isAuthenticated = true;
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Header isOwner={isOwner} authenticated={isAuthenticated} />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
