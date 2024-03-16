import RecipeBox from "./recipeBox";

interface RecipeGridProps {
  recipes: {
    slug: string;
    title: string;
    description: string;
  }[];
}

export default function RecipeGrid(props: RecipeGridProps) {
  const { recipes } = props;

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {recipes.map((recipe, idx) => (
        <li key={idx} className=" rounded-lg bg-white shadow">
          <RecipeBox recipe={recipe} />
        </li>
      ))}
    </ul>
  );
}
