type searchBarProps = {
  setSearchText: (searchText: string) => void;
  page: number;
};

export default function SearchBar(props: searchBarProps) {
  const { setSearchText } = props;

  return (
    <div className="flex flex-col items-center md:flex-row mt-18">
      <div className="w-full md:basis-5/6 mr-2">
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
          className="w-full bg-teal-600 rounded-md px-3 py-2 font-medium text-white shadow-sm"
        >
          Search
        </button>
        {/* <button
          type="submit"
          className="w-full inline-flex rounded-md border border-transparent bg-teal-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Search
        </button> */}
      </div>
    </div>
  );
}
