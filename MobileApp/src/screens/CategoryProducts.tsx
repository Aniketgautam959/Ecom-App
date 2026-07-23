import { useApp } from "../context/AppContext";
import { Shop } from "./Shop";

export function CategoryProducts({ back }: { back: () => void }) {
  const { selectedCategory } = useApp();
  return (
    <Shop
      back={back}
      initialCategoryId={selectedCategory?.id ?? null}
      title={selectedCategory?.name ?? "Products"}
    />
  );
}
