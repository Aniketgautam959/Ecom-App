import Link from "next/link";
import Image from "next/image";

interface Category {
  id: number;
  name: string;
  slug: string;
  image: string | null;
}

interface Props {
  categories: Category[];
}

export default function CategoryGrid({ categories }: Props) {
  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs tracking-widest text-gray-400 dark:text-gray-500 uppercase mb-2">Browse By</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Shop Categories</h2>
        </div>

        {categories.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No categories available.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group block text-center"
              >
                <div className="relative aspect-square bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden mb-3 mx-auto w-24 h-24 md:w-28 md:h-28 flex items-center justify-center border border-gray-200 dark:border-gray-800 group-hover:border-gray-400 dark:group-hover:border-gray-600 transition-colors">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 768px) 112px, 128px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-xs text-gray-400 font-medium px-2">{category.name}</span>
                  )}
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
