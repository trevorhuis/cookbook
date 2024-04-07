import { Form } from "@remix-run/react";
import {
  DescriptionInput,
  IngredientsInput,
  StepsInput,
  TagsInput,
  TitleInput,
  ServingsInput,
  // ImagesInput,
} from "../inputs";
import CookTimeInput from "../inputs/cookTimeInput";
import PrepTimeInput from "../inputs/prepTimeInput";
import CancelSaveButtons from "../cancelSaveButtons";

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
  // imageUrls: string[];
  // setImageUrls: (url: string[]) => void;
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
        <input type="hidden" name="recipeId" value={recipeId} />
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
      <CancelSaveButtons />
    </Form>
  );
}
