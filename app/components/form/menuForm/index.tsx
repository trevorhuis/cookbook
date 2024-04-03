import { Form } from "@remix-run/react";
import {
  DescriptionInput,
  TitleInput,
  // ImagesInput,
} from "../inputs";

type MenuFormProps = {
  menuId: number | null;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
};

export default function MenuForm(props: MenuFormProps) {
  const { menuId, description, setDescription, title, setTitle } = props;

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
