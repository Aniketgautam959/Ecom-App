"use client";

import Link from "next/link";
import Image from "next/image";
import { useCurrency, formatPrice } from "@/context/CurrencyContext";

interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
  image: string;
  bgColor: string;
  slug?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const currency = useCurrency();
  const href = product.slug ? `/products/${product.slug}` : `/products/${product.id}`;

  return (
    <Link href={href} className="group block">
      {/* Image Container */}
      <div className={`${product.bgColor} relative rounded-sm aspect-[3/4] flex items-center justify-center overflow-hidden mb-3`}>
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-6">
            <div className="w-3/4 h-4/5 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <span className="text-xs text-gray-400 dark:text-gray-500 text-center px-2">{product.name}</span>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">{product.name}</h3>
        <div className="flex items-center gap-3">
          <span className="text-xs border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 px-2 py-0.5">
            {product.inStock ? "IN STOCK" : "OUT OF STOCK"}
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {formatPrice(product.price, currency)}
          </span>
        </div>
      </div>
    </Link>
  );
}
