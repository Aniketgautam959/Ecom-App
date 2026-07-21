"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Package, Truck, CreditCard } from "lucide-react";
import EcomNavbar from "@/components/Layout/EcomNavbar";
import EcomFooter from "@/components/Layout/EcomFooter";
import { useAuth } from "@/context/AuthContext";
import { useCurrency, formatPrice } from "@/context/CurrencyContext";
import { apiClient } from "@/lib/api-client";

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string | null;
  size: string | null;
  color: string | null;
  price: number;
  quantity: number;
  total: number;
}

interface OrderDetail {
  id: number;
  order_number: string;
  status: string;
  subtotal: number;
  discount: number;
  shipping_cost: number;
  tax: number;
  total: number;
  payment_method: string;
  payment_status: string;
  coupon_code: string | null;
  notes: string | null;
  date: string;
  created_at: string;
  shipping: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items: OrderItem[];
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

export default function OrderDetailPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const currency = useCurrency();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user && params.id) {
      apiClient
        .get(`/orders/${params.id}`)
        .then((res) => setOrder(res.data.data))
        .catch(() => router.push("/orders"))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, params.id, router]);

  const handleCancel = async () => {
    if (!order || !confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(true);
    try {
      await apiClient.post(`/orders/${order.id}/cancel`);
      setOrder((prev) => prev ? { ...prev, status: "cancelled" } : null);
    } catch {
      alert("Could not cancel order.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
        <EcomNavbar />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <p className="text-gray-400">Loading...</p>
        </main>
        <EcomFooter />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <EcomNavbar />
      <main className="flex-1 pt-16">
        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* Back + Title */}
          <div className="flex items-center gap-3 mb-6">
            <Link href="/orders" className="text-gray-400 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{order.order_number}</h1>
              <p className="text-xs text-gray-400">{order.date}</p>
            </div>
            <span className={`ml-auto px-3 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-700"}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Package className="w-4 h-4" /> Items ({order.items.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4">
                    <div className="relative w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden flex-shrink-0">
                      {item.product_image ? (
                        <Image src={item.product_image} alt="" fill sizes="56px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.product_name}</p>
                      <p className="text-xs text-gray-400">
                        Qty: {item.quantity}
                        {item.size && ` • Size: ${item.size}`}
                        {item.color && ` • Color: ${item.color}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{formatPrice(Number(item.total), currency)}</p>
                      <p className="text-xs text-gray-400">{formatPrice(Number(item.price), currency)} each</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4 space-y-1 text-sm">
                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatPrice(Number(order.subtotal), currency)}</span></div>
                {Number(order.discount) > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(Number(order.discount), currency)}</span></div>}
                <div className="flex justify-between text-gray-500"><span>Shipping</span><span>{Number(order.shipping_cost) === 0 ? "FREE" : formatPrice(Number(order.shipping_cost), currency)}</span></div>
                <div className="flex justify-between text-gray-500"><span>Tax</span><span>{formatPrice(Number(order.tax), currency)}</span></div>
                <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700"><span>Total</span><span>{formatPrice(Number(order.total), currency)}</span></div>
              </div>
            </div>

            {/* Side Info */}
            <div className="space-y-4">
              {/* Shipping */}
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Truck className="w-4 h-4" /> Shipping
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{order.shipping.name}</p>
                <p className="text-xs text-gray-500 mt-1">{order.shipping.address}</p>
                <p className="text-xs text-gray-500">{order.shipping.city}, {order.shipping.state} - {order.shipping.pincode}</p>
                <p className="text-xs text-gray-500">{order.shipping.phone}</p>
              </div>

              {/* Payment */}
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Payment
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{order.payment_method.toUpperCase()}</p>
                <p className="text-xs text-gray-500 mt-1">Status: <span className="font-medium">{order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}</span></p>
              </div>

              {/* Cancel */}
              {["pending", "confirmed"].includes(order.status) && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="w-full py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                  {cancelling ? "Cancelling..." : "Cancel Order"}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
      <EcomFooter />
    </div>
  );
}
