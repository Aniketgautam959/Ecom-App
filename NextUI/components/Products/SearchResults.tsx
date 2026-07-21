"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCurrency, formatPrice } from "@/context/CurrencyContext";

interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  status: boolean;
  category: { id: number; name: string } | null;
  brand: { id: number; name: string } | null;
}

export default function SearchResults({ initialProducts, query }: { initialProducts: ApiProduct[]; query: string }) {
  const [products] = useState<ApiProduct[]>(initialProducts);
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const currency = useCurrency();
  const [addedId, setAddedId] = useState<number | null>(null);

  const handleAddToCart = (product: ApiProduct) => {
    addItem({ id: product.id, slug: product.slug, name: product.name, price: Number(product.price), image: product.image, size: "M", color: "#94a3b8" });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-20 flex flex-col items-center gap-3">
        <ShoppingBag className="w-12 h-12 text-gray-200 dark:text-gray-700" />
        <p className="text-gray-500 dark:text-gray-400">
          No products found for <span className="font-medium text-gray-900 dark:text-white">&quot;{query}&quot;</span>.
        </p>
        <Link href="/products" className="text-sm text-gray-900 dark:text-white underline">
          Browse all products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-400 mb-5">
        Found <span className="text-gray-700 dark:text-gray-300 font-medium">{products.length}</span> result{products.length !== 1 ? "s" : ""} for <span className="font-medium text-gray-900 dark:text-white">&quot;{query}&quot;</span>
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map((product) => (
          <div key={product.id} className="group relative">
            <Link href={`/products/${product.slug}`} className="block">
              <div className="relative bg-gray-100 dark:bg-gray-800 rounded overflow-hidden aspect-[3/4]">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                  </div>
                )}
                {!product.status && (
                  <span className="absolute top-2 left-2 bg-gray-900 text-white text-xs px-2 py-0.5 rounded">Out of Stock</span>
                )}
              </div>
            </Link>

            <button
              onClick={(e) => { e.preventDefault(); toggleItem({ id: product.id, slug: product.slug, name: product.name, price: Number(product.price), image: product.image }); }}
              className={`absolute top-2 right-2 w-7 h-7 rounded-full shadow flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ${
                isInWishlist(product.id) ? "bg-red-500 text-white opacity-100" : "bg-white dark:bg-gray-800 text-gray-500"
              }`}
            >
              <Heart className="w-3.5 h-3.5" fill={isInWishlist(product.id) ? "currentColor" : "none"} />
            </button>

            <div className="mt-3">
              <Link href={`/products/${product.slug}`}>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{product.brand?.name ?? product.category?.name ?? ""}</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white leading-snug line-clamp-2 hover:underline">{product.name}</p>
              </Link>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{formatPrice(Number(product.price), currency)}</span>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.status}
                  className={`text-xs px-2.5 py-1 rounded transition-colors ${
                    addedId === product.id
                      ? "bg-green-600 text-white"
                      : product.status
                      ? "bg-gray-900 text-white hover:bg-gray-700"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {addedId === product.id ? "Added!" : "+ Cart"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
