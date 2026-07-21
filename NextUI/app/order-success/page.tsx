"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Package, ShoppingBag } from "lucide-react";
import EcomNavbar from "@/components/Layout/EcomNavbar";
import EcomFooter from "@/components/Layout/EcomFooter";
import { useAuth } from "@/context/AuthContext";
import { useCurrency, formatPrice } from "@/context/CurrencyContext";
import { apiClient } from "@/lib/api-client";

interface OrderDetail {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string;
  total: number;
  items: {
    id: number;
    product_name: string;
    product_image: string | null;
    quantity: number;
    price: number;
    total: number;
    size: string | null;
    color: string | null;
  }[];
  shipping: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

function OrderSuccessContent() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currency = useCurrency();

  const orderId = searchParams.get("order_id");
  const orderNumber = searchParams.get("order_number");

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (!orderId && !orderNumber) {
      router.push("/orders");
      return;
    }

    if (user) {
      const endpoint = orderId ? `/orders/${orderId}` : "/orders";
      apiClient
        .get(endpoint)
        .then((res) => {
          const data = res.data.data;
          if (orderNumber && Array.isArray(data)) {
            const matched = data.find((o: OrderDetail) => o.order_number === orderNumber);
            setOrder(matched || null);
          } else {
            setOrder(data);
          }
        })
        .catch(() => setOrder(null))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, orderId, orderNumber, router]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <EcomNavbar />
      <main className="flex-1 pt-16">
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-500 mb-6">
            Thank you for your purchase. Your order{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {orderNumber || order?.order_number || "..."}
            </span>{" "}
            has been confirmed.
          </p>

          {loading ? (
            <p className="text-sm text-gray-400">Loading order details...</p>
          ) : order ? (
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-5 text-left mb-8">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" /> Order Summary
              </h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden flex-shrink-0">
                      {item.product_image ? (
                        <Image src={item.product_image} alt="" fill sizes="48px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.product_name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Qty: {item.quantity}
                        {item.size && ` • ${item.size}`}
                        {item.color && ` • ${item.color}`}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatPrice(Number(item.total), currency)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 mt-4 pt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">Total</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatPrice(Number(order.total), currency)}
                </span>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                <p>Payment: {order.payment_method.toUpperCase()}</p>
                <p>Status: {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}</p>
                <p>Shipping to: {order.shipping.name}, {order.shipping.city}</p>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/orders"
              className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              View My Orders
            </Link>
            <Link
              href="/products"
              className="px-6 py-2.5 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
      <EcomFooter />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
        <EcomNavbar />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        </main>
        <EcomFooter />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
