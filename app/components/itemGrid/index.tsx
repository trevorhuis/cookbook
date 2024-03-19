import ItemBox from "./itemBox";

interface ItemGridProps {
  items: {
    slug: string;
    title: string;
    description: string;
  }[];
}

export default function ItemGrid(props: ItemGridProps) {
  const { items } = props;

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {items.map((item, idx) => (
        <li key={idx} className=" rounded-lg bg-white shadow">
          <ItemBox item={item} />
        </li>
      ))}
    </ul>
  );
}
