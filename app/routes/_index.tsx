import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ItemGrid from "~/components/itemGrid";
import Server from "~/server";

export const meta: MetaFunction = () => {
  return [
    { title: "Crytal's Cookbook" },
    { name: "description", content: "Crystal's Cookbook Homepage" },
  ];
};

export async function loader() {
  const recipes = await Server.recipeUseCase.getRandomRecipes(8);

  return recipes;
}

export default function Index() {
  const recipes = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto max-w-2xl py-28 sm:py-36 lg:py-48">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          {`Crystal's Cookbook`}
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          {`Explore fantastic recipes from world-class chef Crystal Huis in 't Veld.`}
        </p>
        <h1 className="mt-8 text-2xl font-bold tracking-tight text-gray-900 sm:text-2xl">
          Some of the Collection
        </h1>
      </div>
      <div className="mt-8">
        <ItemGrid items={recipes} itemType="recipes" />
      </div>
    </div>
  );
}
