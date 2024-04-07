import { Form } from "@remix-run/react";
import {
  DescriptionInput,
  TitleInput,
  // ImagesInput,
} from "../inputs";
import SearchBar from "~/components/searchBar";
import RecipeList from "./recipeListView";
import { SearchResult } from "~/server/types/search";
import CancelSaveButtons from "../cancelSaveButtons";

type MenuFormProps = {
  menuId: number | null;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  searchText: string;
  setSearchText: (searchText: string) => void;
  recipeSearchResults: SearchResult[];
  selectedRecipes: SearchResult[];
};

export default function MenuForm(props: MenuFormProps) {
  const {
    menuId,
    description,
    setDescription,
    title,
    setTitle,
    searchText,
    setSearchText,
    recipeSearchResults,
    selectedRecipes,
  } = props;

  return (
    <Form
      method="POST"
      className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
    >
      {menuId !== null && <input type="hidden" name="menuId" value={menuId} />}
      <div className="px-4 py-6 sm:p-8">
        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <TitleInput title={title} setTitle={setTitle} />

          {/* <ImagesInput imageUrls={imageUrls} setImageUrls={setImageUrls} /> */}

          <DescriptionInput
            description={description}
            setDescription={setDescription}
          />

          <div className="col-span-full mt-1">
            <h2 className="text-lg font-semibold text-gray-900">
              Selected Recipes
            </h2>
            {selectedRecipes !== null && (
              <RecipeList recipes={selectedRecipes} showButtons={false} />
            )}
          </div>

          <div className="col-span-full mt-1">
            <input name="searchText" value={searchText} hidden readOnly />
            <SearchBar setSearchText={setSearchText} />

            {recipeSearchResults !== null && (
              <RecipeList recipes={recipeSearchResults} showButtons={true} />
            )}
          </div>
        </div>
      </div>
      <CancelSaveButtons />
    </Form>
  );
}
