import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
      <p className="m-6 text-center text-2xl">{`Crystal's Cookbook`}</p>
      <p className="text-md m-6 text-center">
        {`Explore fantastic recipes from world-class chef Crystal Huis in 't Veld.`}
      </p>
      {/* <div className="grid grid-cols-1 space-x-6">
        <Card
          title={"Recipes"}
          description={"Your favorite recipes"}
          image={recipeImage}
          url={"/recipes"}
        />
      </div> */}
    </div>
  );
}
