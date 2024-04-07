type searchBarProps = {
  setSearchText: (searchText: string) => void;
};

export default function SearchBar(props: searchBarProps) {
  const { setSearchText } = props;

  return (
    <div className="mt-18 flex flex-col items-center md:flex-row">
      <div className="mr-2 w-full md:basis-5/6">
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700"
        >
          Search
        </label>
        <div className="relative">
          <input
            type="text"
            name="search"
            id="search"
            className="w-full rounded border border-teal-500 px-2 py-1 text-lg "
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-5 w-full md:basis-1/6">
        <button
          type="submit"
          name="_action"
          value="searchRecipes"
          className="w-full rounded-md bg-teal-600 px-3 py-2 font-medium text-white shadow-sm"
        >
          Search
        </button>
      </div>
    </div>
  );
}
