type PrepTimeInputProps = {
  prepTime: number | null;
  setPrepTime: (prepTime: number) => void;
};

export default function PrepTimeInput(props: PrepTimeInputProps) {
  const { prepTime, setPrepTime } = props;
  return (
    <div className="sm:col-span-2">
      <label
        htmlFor="prep_time"
        className="block text-md font-medium leading-6 text-gray-900"
      >
        {`Prep Time (optional)`}
      </label>
      <div className="mt-2">
        <input
          type="text"
          name="prep_time"
          id="prep_time"
          value={prepTime || ""}
          onChange={(e) => setPrepTime(parseInt(e.target.value))}
          className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
}
