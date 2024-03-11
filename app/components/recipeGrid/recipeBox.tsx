import { Link } from "@remix-run/react";
import { SelectRecipeSchema } from "~/db/schema/recipe.server";

interface RecipeBoxProps {
  recipe: SelectRecipeSchema;
}

export default function RecipeBox(props: RecipeBoxProps) {
  const { recipe } = props;

  return (
    <Link to={`/recipes/${recipe.slug}`}>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-medium text-gray-900 border-b-2 pb-2">
          {recipe.title}
        </h3>
      </div>
    </Link>
  );
}
