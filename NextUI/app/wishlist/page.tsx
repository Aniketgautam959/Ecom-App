"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, Package } from "lucide-react";
import EcomNavbar from "@/components/Layout/EcomNavbar";
import EcomFooter from "@/components/Layout/EcomFooter";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useCurrency, formatPrice } from "@/context/CurrencyContext";

export default function WishlistPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { items, removeItem, loading } = useWishlist();
  const { addItem: addToCart } = useCart();
  const currency = useCurrency();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
        <EcomNavbar />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <p className="text-gray-400">Loading wishlist...</p>
        </main>
        <EcomFooter />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <EcomNavbar />

      <main className="flex-1 pt-16">
        <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">My Wishlist</h1>
            <p className="text-sm text-gray-400">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-10">
          {items.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <Heart className="w-12 h-12 text-gray-300 mx-auto" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Your wishlist is empty</h2>
              <p className="text-sm text-gray-400">Save items you love and find them here anytime.</p>
              <Link
                href="/products"
                className="inline-block px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Explore Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((product) => (
                <div
                  key={product.id}
                  className="group border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                >
                  <Link href={`/products/${product.slug}`} className="block relative bg-gray-100 dark:bg-gray-800 aspect-[3/4]">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-10 h-10 text-gray-300" />
                      </div>
                    )}
                  </Link>

                  <div className="p-4">
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                      {formatPrice(Number(product.price), currency)}
                    </p>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => {
                          addToCart({
                            id: product.id,
                            slug: product.slug,
                            name: product.name,
                            price: Number(product.price),
                            image: product.image,
                            quantity: 1,
                            size: "M",
                            color: "#000000",
                          });
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-700 transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                      </button>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <EcomFooter />
    </div>
  );
}
