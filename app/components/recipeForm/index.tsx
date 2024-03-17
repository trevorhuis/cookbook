import { Form } from "@remix-run/react";
import {
  DescriptionInput,
  IngredientsInput,
  StepsInput,
  TagsInput,
  TitleInput,
  ServingsInput,
  // ImagesInput,
} from "./inputs";
import CookTimeInput from "./inputs/cookTimeInput";
import PrepTimeInput from "./inputs/prepTimeInput";

type RecipeFormProps = {
  recipeId: number | null;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  servings: number | null;
  setServings: (servings: number) => void;
  cookTime: number | null;
  setCookTime: (servings: number) => void;
  prepTime: number | null;
  setPrepTime: (servings: number) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  ingredients: string[];
  setIngredients: (ingredients: string[]) => void;
  steps: string[];
  setSteps: (steps: string[]) => void;
  imageUrls: string[];
  setImageUrls: (url: string[]) => void;
};

export default function RecipeForm(props: RecipeFormProps) {
  const {
    recipeId,
    description,
    setDescription,
    title,
    setTitle,
    servings,
    setServings,
    cookTime,
    setCookTime,
    prepTime,
    setPrepTime,
    tags,
    setTags,
    ingredients,
    setIngredients,
    steps,
    setSteps,
    // imageUrls,
    // setImageUrls,
  } = props;

  return (
    <Form
      method="POST"
      className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
    >
      {recipeId !== null && (
        <input type="hidden" name="recipe_id" value={recipeId} />
      )}
      <div className="px-4 py-6 sm:p-8">
        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <TitleInput title={title} setTitle={setTitle} />

          <ServingsInput servings={servings} setServings={setServings} />

          <PrepTimeInput prepTime={prepTime} setPrepTime={setPrepTime} />

          <CookTimeInput cookTime={cookTime} setCookTime={setCookTime} />

          <TagsInput tags={tags} setTags={setTags} />

          {/* <ImagesInput imageUrls={imageUrls} setImageUrls={setImageUrls} /> */}

          <DescriptionInput
            description={description}
            setDescription={setDescription}
          />

          <IngredientsInput
            ingredients={ingredients}
            setIngredients={setIngredients}
          />

          <StepsInput steps={steps} setSteps={setSteps} />
        </div>
      </div>
      <div className="flex items-center justify-end gap-x-2 border-t border-gray-900/10 px-4 py-4 sm:px-8">
        <button
          type="submit"
          name="_action"
          value="cancel"
          className="m-2 inline-flex items-center rounded-md border border-transparent bg-gray-500 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          name="_action"
          value="save"
          className="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
