import { Link } from "@remix-run/react";

interface RecipeBoxProps {
  recipe: {
    slug: string;
    description: string;
    title: string;
  };
}

export default function RecipeBox(props: RecipeBoxProps) {
  const { recipe } = props;

  return (
    <Link to={`/recipes/${recipe.slug}`}>
      <div className="flex flex-1 flex-col p-6 min-h-32 shadow-2xl">
        <p className="text-lg font-medium text-gray-900 border-b-2 pb-2">
          {recipe.title}
        </p>
        <div className="min-h-4">
          <p className="truncate text-sm font-sm text-gray-900 mt-2">
            {recipe.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
