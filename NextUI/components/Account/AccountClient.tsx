"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  MapPin,
  Lock,
  User as UserIcon,
  LogOut,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  X,
  Package,
} from "lucide-react";
import { useAuth, type User } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCurrency, formatPrice } from "@/context/CurrencyContext";
import { apiClient } from "@/lib/api-client";

type Tab = "orders" | "wishlist" | "address" | "password" | "account";

interface Order {
  id: number;
  order_number: string;
  date: string;
  items_count: number;
  total: number;
  status: string;
}

interface AddressItem {
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

const NAV_ITEMS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "orders",   label: "Orders",         icon: ShoppingBag },
  { key: "wishlist", label: "Wishlist",        icon: Heart },
  { key: "address",  label: "Address",         icon: MapPin },
  { key: "password", label: "Password",        icon: Lock },
  { key: "account",  label: "Account Detail",  icon: UserIcon },
];

export default function AccountClient({ defaultTab = "orders" }: { defaultTab?: Tab }) {
  const { user, logout, updateUser, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Sidebar */}
        <aside className="lg:w-56 flex-shrink-0">
          <nav className="space-y-1">
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors text-left ${
                  activeTab === key
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </button>
            ))}

            <button
              onClick={() => { logout(); router.push("/"); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors text-left"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {activeTab === "account"  && <AccountDetails user={user} updateUser={updateUser} />}
          {activeTab === "password" && <ChangePassword />}
          {activeTab === "orders"   && <OrdersTab />}
          {activeTab === "wishlist" && <WishlistTab />}
          {activeTab === "address"  && <AddressTab />}
        </div>
      </div>
    </div>
  );
}

/* ─── Account Details ─────────────────────────────────────────── */
function AccountDetails({
  user,
  updateUser,
}: {
  user: User;
  updateUser: (u: User) => void;
}) {
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName]   = useState(user.last_name ?? "");
  const [email, setEmail]         = useState(user.email_id);
  const [phone, setPhone]         = useState(user.phone_number ?? "");
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const res = await apiClient.put("/me", {
        first_name: firstName,
        last_name: lastName || null,
        email_id: email,
        phone_number: phone || null,
      });
      const updated = res.data.data;
      updateUser(updated);
      setMsg({ type: "success", text: "Profile updated successfully!" });
    } catch {
      setMsg({ type: "error", text: "Failed to update profile. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Account Details</h2>

      {msg && (
        <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded mb-5 ${
          msg.type === "success"
            ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
            : "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
        }`}>
          {msg.type === "success"
            ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
            : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5 max-w-md">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">First Name</label>
            <input
              required value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-900 outline-none focus:border-gray-900 dark:focus:border-gray-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Last Name</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-900 outline-none focus:border-gray-900 dark:focus:border-gray-400 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Email</label>
          <input
            type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-900 outline-none focus:border-gray-900 dark:focus:border-gray-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Phone Number</label>
          <input
            type="tel" value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 234 567 8900"
            className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-900 outline-none focus:border-gray-900 dark:focus:border-gray-400 transition-colors"
          />
        </div>

        <button
          type="submit" disabled={saving}
          className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-6 py-2.5 text-sm font-semibold rounded hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

/* ─── Change Password ─────────────────────────────────────────── */
function ChangePassword() {
  const [newPw, setNewPw]         = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showNew, setShowNew]     = useState(false);
  const [showConf, setShowConf]   = useState(false);
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      setMsg({ type: "error", text: "Passwords do not match." });
      return;
    }
    if (newPw.length < 8) {
      setMsg({ type: "error", text: "Password must be at least 8 characters." });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      await apiClient.post("/me/change-password", {
        new_password: newPw,
        new_password_confirmation: confirmPw,
      });
      setMsg({ type: "success", text: "Password changed successfully!" });
      setNewPw("");
      setConfirmPw("");
    } catch {
      setMsg({ type: "error", text: "Failed to change password. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Change Password</h2>

      {msg && (
        <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded mb-5 ${
          msg.type === "success"
            ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
            : "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
        }`}>
          {msg.type === "success"
            ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
            : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">New Password</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              required minLength={8}
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full px-3 py-2.5 pr-10 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-900 outline-none focus:border-gray-900 dark:focus:border-gray-400 transition-colors"
            />
            <button type="button" onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Confirm Password</label>
          <div className="relative">
            <input
              type={showConf ? "text" : "password"}
              required minLength={8}
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="Repeat new password"
              className="w-full px-3 py-2.5 pr-10 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-900 outline-none focus:border-gray-900 dark:focus:border-gray-400 transition-colors"
            />
            <button type="button" onClick={() => setShowConf(!showConf)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showConf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit" disabled={saving}
          className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-6 py-2.5 text-sm font-semibold rounded hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          {saving ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}

/* ─── Orders Tab ─────────────────────────────────────────────── */
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
};

function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const currency = useCurrency();

  useEffect(() => {
    apiClient
      .get("/orders")
      .then((res) => setOrders(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Orders</h2>
        <p className="text-sm text-gray-400">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Orders</h2>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingBag className="w-14 h-14 text-gray-200 dark:text-gray-700 mb-4" strokeWidth={1} />
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">
            Your order history is waiting to be filled.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-6 py-2.5 text-sm font-medium rounded hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
          >
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Orders</h2>
      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="flex items-center justify-between gap-4 border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
          >
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
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─── Wishlist Tab ────────────────────────────────────────────── */
function WishlistTab() {
  const { items, removeItem } = useWishlist();
  const currency = useCurrency();

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Wishlist</h2>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart className="w-14 h-14 text-gray-200 dark:text-gray-700 mb-4" strokeWidth={1} />
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">
            Your wishlist is empty.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-6 py-2.5 text-sm font-medium rounded hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
          >
            Browse Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="group relative">
              <Link href={`/products/${item.slug}`} className="block">
                <div className="relative bg-gray-100 dark:bg-gray-800 rounded aspect-[3/4] overflow-hidden mb-3 flex items-center justify-center">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <ShoppingBag className="w-8 h-8 text-gray-300 dark:text-gray-600" strokeWidth={1} />
                  )}
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                  {item.name}
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatPrice(Number(item.price), currency)}
                </p>
              </Link>
              <button
                onClick={() => removeItem(item.id)}
                className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Remove from wishlist"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Address Tab ────────────────────────────────────────────── */
interface AddressData {
  id?: number;
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

const EMPTY_ADDRESS: AddressData = {
  label: "Home",
  name: "",
  phone: "",
  address_line: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  is_default: false,
};

function AddressTab() {
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AddressData>(EMPTY_ADDRESS);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await apiClient.get("/addresses");
        if (!active) return;
        setAddresses(res.data.data ?? []);
      } catch {
        // silently fail
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const fetchAddresses = () => {
    apiClient
      .get("/addresses")
      .then((res) => setAddresses(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_ADDRESS);
    setShowForm(true);
    setMsg("");
  };

  const openEdit = (addr: AddressItem) => {
    setEditingId(addr.id);
    setForm({
      label: addr.label,
      name: addr.name,
      phone: addr.phone,
      address_line: addr.address_line,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      country: addr.country ?? "India",
      is_default: addr.is_default,
    });
    setShowForm(true);
    setMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      if (editingId) {
        const res = await apiClient.put(`/addresses/${editingId}`, form);
        setAddresses((prev) => prev.map((a: AddressItem) => (a.id === editingId ? res.data.data : a)));
        setMsg("Address updated.");
      } else {
        const res = await apiClient.post("/addresses", form);
        setAddresses((prev) => [...prev, res.data.data]);
        setMsg("Address added.");
      }
      setShowForm(false);
      setForm(EMPTY_ADDRESS);
      setEditingId(null);
      fetchAddresses();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message ??
            "Failed to save address.")
          : "Failed to save address.";
      setMsg(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this address?")) return;
    try {
      await apiClient.delete(`/addresses/${id}`);
      setAddresses((prev) => prev.filter((a: AddressItem) => a.id !== id));
      fetchAddresses();
    } catch {
      alert("Failed to delete address.");
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await apiClient.patch(`/addresses/${id}/default`);
      fetchAddresses();
    } catch {}
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Address</h2>
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Address</h2>
        {!showForm && (
          <button
            onClick={openAdd}
            className="text-sm bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
          >
            + Add Address
          </button>
        )}
      </div>

      {msg && (
        <div className="mb-4 text-sm text-green-600 bg-green-50 px-3 py-2 rounded">{msg}</div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border border-gray-200 dark:border-gray-800 rounded-lg p-5 mb-6 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {editingId ? "Edit Address" : "New Address"}
            </h3>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-700">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select name="label" value={form.label} onChange={handleChange}
              className="border border-gray-200 dark:border-gray-700 rounded px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 outline-none">
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Full Name"
              className="border border-gray-200 dark:border-gray-700 rounded px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 outline-none" />
            <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Phone"
              className="border border-gray-200 dark:border-gray-700 rounded px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 outline-none" />
            <input name="pincode" value={form.pincode} onChange={handleChange} required placeholder="Pincode"
              className="border border-gray-200 dark:border-gray-700 rounded px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 outline-none" />
          </div>
          <textarea name="address_line" value={form.address_line} onChange={handleChange} required placeholder="Full Address"
            rows={2} className="w-full border border-gray-200 dark:border-gray-700 rounded px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 outline-none resize-none" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input name="city" value={form.city} onChange={handleChange} required placeholder="City"
              className="border border-gray-200 dark:border-gray-700 rounded px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 outline-none" />
            <input name="state" value={form.state} onChange={handleChange} required placeholder="State"
              className="border border-gray-200 dark:border-gray-700 rounded px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 outline-none" />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <input type="checkbox" checked={form.is_default} onChange={(e) => setForm((p) => ({ ...p, is_default: e.target.checked }))} className="accent-gray-900" />
            Set as default address
          </label>

          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={saving}
              className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-5 py-2 text-sm font-medium rounded hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors disabled:opacity-50">
              {saving ? "Saving..." : editingId ? "Update" : "Add Address"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }}
              className="px-5 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Address List */}
      {addresses.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <MapPin className="w-14 h-14 text-gray-200 dark:text-gray-700 mb-4" strokeWidth={1} />
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">No saved addresses yet.</p>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-6 py-2.5 text-sm font-medium rounded hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
          >
            Add Your First Address
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr: AddressItem) => (
            <div key={addr.id} className={`relative border rounded-lg p-4 ${addr.is_default ? "border-gray-900 dark:border-white" : "border-gray-200 dark:border-gray-800"}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
                    {addr.label}
                  </span>
                  {addr.is_default && (
                    <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded">Default</span>
                  )}
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{addr.name}</p>
              <p className="text-xs text-gray-500 mt-1">{addr.address_line}</p>
              <p className="text-xs text-gray-500">{addr.city}, {addr.state} - {addr.pincode}</p>
              <p className="text-xs text-gray-500">{addr.phone}</p>

              <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button onClick={() => openEdit(addr)} className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium">
                  Edit
                </button>
                <button onClick={() => handleDelete(addr.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">
                  Delete
                </button>
                {!addr.is_default && (
                  <button onClick={() => handleSetDefault(addr.id)} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                    Set Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
