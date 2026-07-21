import Link from "next/link";
import Image from "next/image";

interface Brand {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
}

interface Props {
  brands: Brand[];
}

export default function BrandGrid({ brands }: Props) {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs tracking-widest text-gray-400 dark:text-gray-500 uppercase mb-2">Trusted</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Top Brands</h2>
        </div>

        {brands.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No brands available.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                className="group relative flex items-center justify-center bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg h-24 px-4 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
              >
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 16vw"
                    className="object-contain opacity-80 group-hover:opacity-100 transition-opacity p-4"
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{brand.name}</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
