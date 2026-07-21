"use client";

import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import EcomNavbar from "@/components/Layout/EcomNavbar";
import EcomFooter from "@/components/Layout/EcomFooter";
import { useCart } from "@/context/CartContext";
import { useCurrency, formatPrice } from "@/context/CurrencyContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const currency = useCurrency();

  const shipping = 0;
  const tax = parseFloat((totalPrice * 0.03).toFixed(2));
  const total = totalPrice + shipping + tax;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      {/* Promo Banner */}
      <div className="bg-gray-900 text-white text-center text-xs py-2 px-4">
        Get 25% OFF on your first order.{" "}
        <Link href="/products" className="underline font-semibold hover:text-gray-300">
          Order Now
        </Link>
      </div>

      <EcomNavbar />

      <main className="flex-1 pt-16">
        {/* Page Header */}
        <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Cart</h1>
            <nav className="text-sm text-gray-400">
              <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">Ecommerce</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-700">Cart</span>
            </nav>
          </div>
        </div>

        {/* Cart Content */}
        <div className="max-w-6xl mx-auto px-4 py-10">
          {items.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <ShoppingBag className="w-12 h-12 text-gray-300" />
              <p className="text-gray-400 text-lg">Your cart is empty.</p>
              <Link href="/" className="bg-gray-900 text-white px-6 py-3 text-sm font-medium hover:bg-gray-700 transition-colors rounded">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">

              {/* Cart Items */}
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-5">Your cart</h2>

                <div className="space-y-0 divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center gap-4 py-5">
                      {/* Product Image */}
                      <div className="relative w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                        ) : (
                          <div className="w-10 h-12 bg-gray-300 rounded" />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${item.slug}`} className="text-sm font-medium text-gray-900 dark:text-white hover:underline mb-1 block">
                          {item.name}
                        </Link>
                        <p className="text-xs text-gray-400">
                          Size: <span className="text-gray-600 dark:text-gray-300">{item.size}</span>
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-sm font-medium text-gray-900 dark:text-white w-20 text-right">
                        {formatPrice(item.price * item.quantity, currency)}
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                          className="text-gray-400 hover:text-gray-700 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm text-gray-900 dark:text-white w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                          className="text-gray-400 hover:text-gray-700 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id, item.size, item.color)}
                        className="text-gray-300 hover:text-red-500 transition-colors ml-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:w-72 flex-shrink-0">
                <div className="border border-gray-200 dark:border-gray-700 rounded p-6 dark:bg-gray-900">
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-5">Order Summary</h2>

                  <div className="space-y-3 mb-5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                      <span className="text-gray-900 dark:text-white font-medium">{formatPrice(totalPrice, currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                      <span className="text-gray-900 dark:text-white font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Tax</span>
                      <span className="text-gray-900 dark:text-white font-medium">{formatPrice(tax, currency)}</span>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between text-sm">
                      <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                      <span className="font-bold text-gray-900 dark:text-white">{formatPrice(total, currency)}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="block w-full bg-gray-900 text-white text-center py-3 text-sm font-semibold hover:bg-gray-700 transition-colors rounded"
                  >
                    Checkout
                  </Link>

                  <div className="text-center mt-3">
                    <Link href="/products" className="text-xs text-gray-500 underline hover:text-gray-800">
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      <EcomFooter />
    </div>
  );
}
