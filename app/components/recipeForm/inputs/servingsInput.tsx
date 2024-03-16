type ServingsInputProps = {
  servings: number | null;
  setServings: (servings: number) => void;
};

export default function ServingsInput(props: ServingsInputProps) {
  const { servings, setServings } = props;
  return (
    <div className="sm:col-span-2 sm:col-start-1">
      <label
        htmlFor="servings"
        className="block text-md font-medium leading-6 text-gray-900"
      >
        {`Servings (optional)`}
      </label>
      <div className="mt-2">
        <input
          type="text"
          name="servings"
          id="servings"
          value={servings || ""}
          onChange={(e) => setServings(parseInt(e.target.value))}
          className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
}
