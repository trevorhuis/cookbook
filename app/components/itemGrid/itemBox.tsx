import { Link } from "@remix-run/react";

interface ItemBoxProps {
  item: {
    slug: string;
    description: string;
    title: string;
  };
}

export default function ItemBox(props: ItemBoxProps) {
  const { item } = props;

  return (
    <Link to={`/items/${item.slug}`}>
      <div className="flex flex-1 flex-col p-6 min-h-32 shadow-2xl">
        <p className="text-lg font-medium text-gray-900 border-b-2 pb-2">
          {item.title}
        </p>
        <div className="min-h-4">
          <p className="truncate text-sm font-sm text-gray-900 mt-2">
            {item.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
