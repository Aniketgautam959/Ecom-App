"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, ShoppingBag } from "lucide-react";
import EcomNavbar from "@/components/Layout/EcomNavbar";
import EcomFooter from "@/components/Layout/EcomFooter";
import { useAuth } from "@/context/AuthContext";
import { useCurrency, formatPrice } from "@/context/CurrencyContext";
import { apiClient } from "@/lib/api-client";

interface OrderSummary {
  id: number;
  order_number: string;
  status: string;
  total: number;
  payment_method: string;
  payment_status: string;
  items_count: number;
  date: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
};

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const currency = useCurrency();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      apiClient
        .get("/orders")
        .then((res) => setOrders(res.data.data ?? []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <EcomNavbar />
      <main className="flex-1 pt-16">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Orders</h1>

          {loading ? (
            <p className="text-sm text-gray-400">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="text-gray-400">No orders yet.</p>
              <Link href="/products" className="text-sm text-gray-900 dark:text-white underline">Start Shopping</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Package className="w-8 h-8 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{order.order_number}</p>
                        <p className="text-xs text-gray-400">{order.date} • {order.items_count} item{order.items_count > 1 ? "s" : ""}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{formatPrice(Number(order.total), currency)}</p>
                      <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-700"}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <EcomFooter />
    </div>
  );
}
