"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Truck, CreditCard, MapPin } from "lucide-react";
import EcomNavbar from "@/components/Layout/EcomNavbar";
import EcomFooter from "@/components/Layout/EcomFooter";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useCurrency, formatPrice } from "@/context/CurrencyContext";
import { apiClient } from "@/lib/api-client";

interface RazorpayResponse {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  error?: { description?: string };
}

interface RazorpayInstance {
  on(event: "payment.failed", handler: (response: RazorpayResponse) => void): void;
  open(): void;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: { color: string };
  modal: {
    ondismiss: () => void;
  };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface SavedAddress {
  id: number;
  label: string;
  name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default: boolean;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const currency = useCurrency();
  const router = useRouter();

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(false);

  const [form, setForm] = useState({
    shipping_name: user ? `${user.first_name} ${user.last_name ?? ""}`.trim() : "",
    shipping_phone: user?.phone_number ?? "",
    shipping_address: "",
    shipping_city: "",
    shipping_state: "",
    shipping_pincode: "",
    payment_method: "cod",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    final_total: number;
  } | null>(null);

  const [checkoutSettings, setCheckoutSettings] = useState({
    shipping_flat_rate: 50,
    shipping_free_threshold: 500,
    tax_rate: 18,
    razorpay_enabled: true,
    razorpay_key: "",
  });

  const applyAddress = (addr: SavedAddress) => {
    setForm((prev) => ({
      ...prev,
      shipping_name: addr.name,
      shipping_phone: addr.phone,
      shipping_address: addr.address_line,
      shipping_city: addr.city,
      shipping_state: addr.state,
      shipping_pincode: addr.pincode,
    }));
  };

  // Fetch saved addresses and checkout settings
  useEffect(() => {
    let active = true;
    (async () => {
      if (user) {
        try {
          const res = await apiClient.get("/addresses");
          if (!active) return;
          const addrs = res.data.data ?? [];
          setSavedAddresses(addrs);
          const defaultAddr = addrs.find((a: SavedAddress) => a.is_default) || addrs[0];
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
            applyAddress(defaultAddr);
          } else {
            setUseNewAddress(true);
          }
        } catch {
          if (active) setUseNewAddress(true);
        }
      }

      try {
        const res = await apiClient.get("/settings/checkout");
        if (!active) return;
        const settings = res.data.data ?? {};
        setCheckoutSettings({
          ...settings,
          razorpay_key: settings.razorpay_key || process.env.NEXT_PUBLIC_RAZORPAY_KEY || "",
        });
        if (!settings.razorpay_enabled && form.payment_method === "razorpay") {
          setForm((prev) => ({ ...prev, payment_method: "cod" }));
        }
      } catch {
        // ignore
      }
    })();
    return () => { active = false; };
  }, [user, form.payment_method]);

  const handleSelectAddress = (addr: SavedAddress) => {
    setSelectedAddressId(addr.id);
    setUseNewAddress(false);
    applyAddress(addr);
  };

  const subtotal = totalPrice;
  const discount = appliedCoupon?.discount ?? 0;
  const shipping = subtotal >= checkoutSettings.shipping_free_threshold ? 0 : checkoutSettings.shipping_flat_rate;
  const tax = Math.round((subtotal - discount) * (checkoutSettings.tax_rate / 100) * 100) / 100;
  const total = subtotal - discount + shipping + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApplyCoupon = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await apiClient.post("/coupon/validate", {
        code,
        subtotal,
      });
      const data = res.data.data;
      setAppliedCoupon({
        code: data.code,
        discount: data.discount,
        final_total: data.final_total,
      });
      setCouponCode("");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message ??
            "Invalid coupon.")
          : "Invalid coupon.";
      setCouponError(msg);
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
    setCouponCode("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setError("");

    try {
      const payload = {
        ...form,
        coupon_code: appliedCoupon?.code ?? null,
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          size: item.size ?? null,
          color: item.color ?? null,
        })),
      };

      const res = await apiClient.post("/orders", payload);
      const orderData = res.data.data;
      const razorpay = res.data.razorpay;

      if (form.payment_method === "razorpay") {
        if (!razorpay?.enabled || !razorpay?.order) {
          throw new Error("Razorpay checkout is not available right now. Please try again.");
        }

        const loaded = await loadRazorpayScript();
        if (!loaded) {
          throw new Error("Failed to load Razorpay checkout. Please try again.");
        }

        const Razorpay = window.Razorpay;
        if (!Razorpay) {
          throw new Error("Razorpay checkout is not available right now. Please try again.");
        }
        const options: RazorpayOptions = {
          key: razorpay.key,
          amount: razorpay.order.amount,
          currency: razorpay.order.currency,
          name: "Ecommerce",
          description: `Order ${orderData.order_number}`,
          order_id: razorpay.order.id,
          handler: async (response: RazorpayResponse) => {
            try {
              await apiClient.post("/razorpay/verify", {
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              });
              clearCart();
              router.push(
                `/order-success?order_id=${orderData.id}&order_number=${orderData.order_number}`
              );
            } catch (err: unknown) {
              const msg =
                err && typeof err === "object" && "response" in err
                  ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message ??
                    "Payment verification failed.")
                  : "Payment verification failed.";
              router.push(
                `/order-failed?order_number=${orderData.order_number}&error=${encodeURIComponent(msg)}`
              );
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: user ? `${user.first_name} ${user.last_name ?? ""}`.trim() : "",
            email: user?.email_id ?? "",
            contact: form.shipping_phone,
          },
          theme: { color: "#111827" },
          modal: {
            ondismiss: () => {
              setLoading(false);
              router.push(
                `/order-failed?order_number=${orderData.order_number}&error=${encodeURIComponent("Payment was cancelled.")}`
              );
            },
          },
        };

        const rzp = new Razorpay(options);
        rzp.on("payment.failed", (response: RazorpayResponse) => {
          const msg = response?.error?.description || "Payment failed.";
          router.push(
            `/order-failed?order_number=${orderData.order_number}&error=${encodeURIComponent(msg)}`
          );
          setLoading(false);
        });
        rzp.open();

        // Loading stays true until the modal is dismissed or a handler runs
        return;
      }

      // COD path
      clearCart();
      router.push(`/order-success?order_id=${orderData.id}&order_number=${orderData.order_number}`);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? ((err as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ??
            (err as { message?: string }).message ??
            "Failed to place order. Please try again.")
          : "Failed to place order. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
        <EcomNavbar />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center space-y-4">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-gray-500">Please log in to checkout.</p>
            <Link href="/login" className="inline-block px-6 py-2 bg-gray-900 text-white rounded-lg text-sm">
              Log In
            </Link>
          </div>
        </main>
        <EcomFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <EcomNavbar />

      <main className="flex-1 pt-16">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

          {items.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="text-gray-400">Your cart is empty.</p>
              <Link href="/products" className="text-sm text-gray-900 underline">Continue Shopping</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
              {/* Left — Form */}
              <div className="flex-1 space-y-6">
                {/* Shipping */}
                <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-5">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Truck className="w-4 h-4" /> Shipping Address
                  </h3>

                  {/* Saved Addresses */}
                  {savedAddresses.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {savedAddresses.map((addr) => (
                        <label
                          key={addr.id}
                          onClick={() => handleSelectAddress(addr)}
                          className={`flex items-start gap-3 border rounded-lg p-3 cursor-pointer transition-colors ${
                            selectedAddressId === addr.id && !useNewAddress
                              ? "border-gray-900 bg-gray-50 dark:border-white dark:bg-gray-900"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <input
                            type="radio"
                            name="address_select"
                            checked={selectedAddressId === addr.id && !useNewAddress}
                            onChange={() => handleSelectAddress(addr)}
                            className="mt-1 accent-gray-900"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{addr.name}</span>
                              <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded">{addr.label}</span>
                              {addr.is_default && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Default</span>}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{addr.address_line}, {addr.city}, {addr.state} - {addr.pincode}</p>
                            <p className="text-xs text-gray-400">{addr.phone}</p>
                          </div>
                        </label>
                      ))}

                      {/* Use new address option */}
                      <label
                        onClick={() => { setUseNewAddress(true); setSelectedAddressId(null); setForm((p) => ({ ...p, shipping_name: "", shipping_phone: "", shipping_address: "", shipping_city: "", shipping_state: "", shipping_pincode: "" })); }}
                        className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer transition-colors ${
                          useNewAddress
                            ? "border-gray-900 bg-gray-50 dark:border-white dark:bg-gray-900"
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <input type="radio" name="address_select" checked={useNewAddress} onChange={() => {}} className="accent-gray-900" />
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Use a new address</span>
                        </div>
                      </label>
                    </div>
                  )}

                  {/* Manual Address Form (shown if no saved or new selected) */}
                  {(useNewAddress || savedAddresses.length === 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input name="shipping_name" value={form.shipping_name} onChange={handleChange} required
                        placeholder="Full Name" className="col-span-2 border border-gray-200 dark:border-gray-700 rounded px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 outline-none" />
                      <input name="shipping_phone" value={form.shipping_phone} onChange={handleChange} required
                        placeholder="Phone Number" className="border border-gray-200 dark:border-gray-700 rounded px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 outline-none" />
                      <input name="shipping_pincode" value={form.shipping_pincode} onChange={handleChange} required
                        placeholder="Pincode" className="border border-gray-200 dark:border-gray-700 rounded px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 outline-none" />
                      <textarea name="shipping_address" value={form.shipping_address} onChange={handleChange} required
                        placeholder="Full Address" rows={2} className="col-span-2 border border-gray-200 dark:border-gray-700 rounded px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 outline-none resize-none" />
                      <input name="shipping_city" value={form.shipping_city} onChange={handleChange} required
                        placeholder="City" className="border border-gray-200 dark:border-gray-700 rounded px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 outline-none" />
                      <input name="shipping_state" value={form.shipping_state} onChange={handleChange} required
                        placeholder="State" className="border border-gray-200 dark:border-gray-700 rounded px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 outline-none" />
                    </div>
                  )}
                </div>

                {/* Payment */}
                <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-5">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Payment Method
                  </h3>
                  <div className="space-y-2">
                    {[
                      { value: "cod", label: "Cash on Delivery" },
                      ...(checkoutSettings.razorpay_enabled
                        ? [{ value: "razorpay", label: "Razorpay (UPI/Card/Netbanking)" }]
                        : []),
                    ].map((opt) => (
                      <label key={opt.value} className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer transition-colors ${form.payment_method === opt.value ? "border-gray-900 bg-gray-50 dark:border-white dark:bg-gray-900" : "border-gray-200 dark:border-gray-700"}`}>
                        <input type="radio" name="payment_method" value={opt.value} checked={form.payment_method === opt.value} onChange={handleChange} className="accent-gray-900" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-5">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Order Notes (optional)</h3>
                  <textarea name="notes" value={form.notes} onChange={handleChange}
                    placeholder="Any special instructions..." rows={2}
                    className="w-full border border-gray-200 dark:border-gray-700 rounded px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 outline-none resize-none" />
                </div>
              </div>

              {/* Right — Order Summary */}
              <div className="lg:w-80">
                <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-5 sticky top-24">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>

                  <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3">
                        <div className="relative w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded flex-shrink-0 overflow-hidden">
                          {item.image && <Image src={item.image} alt="" fill sizes="48px" className="object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-700 dark:text-gray-300 truncate">{item.name}</p>
                          <p className="text-xs text-gray-400">Qty: {item.quantity} {item.size && `• ${item.size}`}</p>
                        </div>
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                          {formatPrice(item.price * item.quantity, currency)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Coupon */}
                  {!appliedCoupon ? (
                    <div className="mb-4">
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Coupon Code</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              e.stopPropagation();
                              handleApplyCoupon();
                            }
                          }}
                          placeholder="Enter code"
                          className="flex-1 border border-gray-200 dark:border-gray-700 rounded px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 outline-none uppercase"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={couponLoading}
                          className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white text-sm font-medium px-4 py-2 rounded hover:bg-gray-700 dark:hover:bg-gray-200 disabled:opacity-50 transition-colors"
                        >
                          {couponLoading ? "..." : "Apply"}
                        </button>
                      </div>
                      {couponError && <p className="text-xs text-red-500 mt-1.5">{couponError}</p>}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mb-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded px-3 py-2">
                      <div>
                        <p className="text-xs text-green-700 dark:text-green-300 font-medium">Coupon applied</p>
                        <p className="text-sm font-semibold text-green-800 dark:text-green-200">{appliedCoupon.code}</p>
                      </div>
                      <button onClick={handleRemoveCoupon} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                    </div>
                  )}

                  <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span><span>{formatPrice(subtotal, currency)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span><span>-{formatPrice(discount, currency)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-500">
                      <span>Shipping</span><span>{shipping === 0 ? "FREE" : formatPrice(shipping, currency)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Tax ({checkoutSettings.tax_rate}%)</span><span>{formatPrice(tax, currency)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-800">
                      <span>Total</span><span>{formatPrice(total, currency)}</span>
                    </div>
                  </div>

                  {error && <p className="text-xs text-red-500 mt-3">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Placing Order..." : "Place Order"}
                  </button>

                  <p className="text-xs text-gray-400 mt-2 text-center">Free shipping on orders over {formatPrice(checkoutSettings.shipping_free_threshold, currency)}</p>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>

      <EcomFooter />
    </div>
  );
}
