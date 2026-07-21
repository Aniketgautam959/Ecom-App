import ProductCard from "@/components/Home/ProductCard";

interface ApiProduct {
  id: number;
  name: string;
  price: number;
  status: boolean;
  image: string | null;
  slug: string;
}

interface Props {
  products: ApiProduct[];
}

export default function BestSellingSection({ products }: Props) {
  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs tracking-widest text-gray-400 dark:text-gray-500 uppercase mb-2">SHOP NOW</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Best Selling</h2>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  price: Number(product.price),
                  inStock: product.status,
                  image: product.image ?? "",
                  bgColor: "bg-gray-100",
                  slug: product.slug,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
