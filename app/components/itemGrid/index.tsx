import { SearchResult } from "~/server/types/search";
import ItemBox from "./itemBox";

interface ItemGridProps {
  items: SearchResult[];
  itemType: "recipes" | "menus";
}

export default function ItemGrid(props: ItemGridProps) {
  const { items, itemType } = props;

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {items.map((item, idx) => (
        <li key={idx} className=" rounded-lg bg-white shadow">
          <ItemBox item={item} itemType={itemType} />
        </li>
      ))}
    </ul>
  );
}
