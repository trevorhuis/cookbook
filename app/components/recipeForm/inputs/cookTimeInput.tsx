type CookTimeInputProps = {
  cookTime: number | null;
  setCookTime: (cookTime: number) => void;
};

export default function CookTimeInput(props: CookTimeInputProps) {
  const { cookTime, setCookTime } = props;

  return (
    <div className="sm:col-span-2">
      <label
        htmlFor="cookTime"
        className="block text-md font-medium leading-6 text-gray-900"
      >
        {`Cook Time (optional)`}
      </label>
      <div className="mt-2">
        <input
          type="text"
          name="cookTime"
          id="cookTime"
          value={cookTime || ""}
          onChange={(e) => setCookTime(parseInt(e.target.value))}
          className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
}
