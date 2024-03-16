type StepsInputProps = {
  steps: string[];
  setSteps: (steps: string[]) => void;
};

export default function StepsInput(props: StepsInputProps) {
  const { steps, setSteps } = props;

  function addStep() {
    setSteps([...steps, ""]);
  }

  function updateStep(index: number, value: string) {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  }

  function removeStep(index: number) {
    return () => {
      const newSteps = [...steps];
      newSteps.splice(index, 1);
      setSteps(newSteps);
    };
  }

  return (
    <div className="sm:col-span-6 ">
      <p className="text-md mb-4 block font-medium text-gray-700">Steps</p>
      {steps.map((step, index) => {
        return (
          <div className="my-2" key={index}>
            <label
              htmlFor="step"
              className="block text-sm font-medium text-gray-500"
            >
              Step {index + 1}
            </label>
            <div className="flex">
              <div className="flex-1">
                <textarea
                  id="step"
                  name={`step_${index}`}
                  rows={2}
                  className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  value={step}
                  onChange={(e) => {
                    updateStep(index, e.target.value);
                  }}
                />
              </div>
              <div className="flex-none content-center">
                <button
                  className="m-2"
                  type="button"
                  onClick={removeStep(index)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        );
      })}
      <button
        type="button"
        className="inline-flex items-center rounded-md border border-transparent bg-teal-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        onClick={addStep}
      >
        Add
      </button>
    </div>
  );
}
