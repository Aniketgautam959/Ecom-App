"use client";

import { useState } from "react";
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
  featured: ApiProduct[];
  latest: ApiProduct[];
}

export default function FeaturedProductsSection({ featured, latest }: Props) {
  const [activeTab, setActiveTab] = useState<"featured" | "latest">("featured");

  const products = activeTab === "featured" ? featured : latest;

  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-10">
          <button
            onClick={() => setActiveTab("featured")}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
              activeTab === "featured"
                ? "border-gray-900 dark:border-white text-gray-900 dark:text-white"
                : "border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Featured
          </button>
          <button
            onClick={() => setActiveTab("latest")}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
              activeTab === "latest"
                ? "border-gray-900 dark:border-white text-gray-900 dark:text-white"
                : "border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Latest
          </button>
        </div>

        {/* Product Grid */}
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
