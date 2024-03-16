export type RecipeFormErrorProps = {
  errors: string[];
};

export default function RecipeFormError(props: RecipeFormErrorProps) {
  const { errors } = props;

  return (
    <div className="bg-red-100 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2 my-4">
      <ul className="list-inside list-disc">
        {errors.map((error, idx) => (
          <li key={idx} className="p-2">
            {error}
          </li>
        ))}
      </ul>
    </div>
  );
}
