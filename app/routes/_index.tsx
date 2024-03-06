import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div>
      <h1 className="text-2xl">Welcome to Remix</h1>
      <ul>
        <li>
          <Link
            className="text-sky-900 underline"
            target="_blank"
            to="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </Link>
        </li>
        <li>
          <Link
            className="text-sky-900 underline"
            target="_blank"
            to="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </Link>
        </li>
        <li>
          <Link
            className="text-sky-900 underline"
            target="_blank"
            to="https://remix.run/docs"
            rel="noreferrer"
          >
            Remix Docs
          </Link>
        </li>
      </ul>
    </div>
  );
}
