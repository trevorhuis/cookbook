import { randomUUIDv7 } from "bun";

type ImagesInputProps = {
  imageUrls: string[];
  setImageUrls: (image: string[]) => void;
};

export default function ImagesInput(props: ImagesInputProps) {
  const { imageUrls, setImageUrls } = props;

  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length <= 0) return;
    const file = e.target.files[0];
    const filename = encodeURIComponent(
      `${randomUUIDv7()}.${file.name.split(".")[1]}`,
    );
    const res = await fetch(`/api/upload-image?file=${filename}`);
    const data = await res.json();

    fetch(data.post, {
      method: "PUT",
      body: file,
    });

    setImageUrls([
      ...imageUrls,
      `https://pub-6ae725fc135b4572a23d21e8ee83183b.r2.dev/${data.key}`,
    ]);
  };

  return (
    <div className="sm:col-span-6">
      <label
        htmlFor="cover-image"
        className="block text-sm font-medium text-gray-700"
      >
        Images
      </label>
      <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
        <div className="space-y-1 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md bg-white font-medium text-teal-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-2 hover:text-teal-500"
            >
              <span>Upload a file</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept=".jpg, .jpeg, .png"
                onInput={uploadPhoto}
              />
              <input
                type="hidden"
                name="imageUrls"
                value={JSON.stringify(imageUrls)}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
    </div>
  );
}
