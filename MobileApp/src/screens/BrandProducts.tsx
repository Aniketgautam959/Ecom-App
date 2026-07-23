import { useApp } from "../context/AppContext";
import { Shop } from "./Shop";

export function BrandProducts({ back }: { back: () => void }) {
  const { selectedBrand } = useApp();
  return (
    <Shop
      back={back}
      initialBrandId={selectedBrand?.id ?? null}
      title={selectedBrand?.name ?? "Products"}
    />
  );
}
