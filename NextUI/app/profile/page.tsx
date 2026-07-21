"use client";

import { useState } from "react";
import Link from "next/link";
import { User as UserIcon, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import EcomNavbar from "@/components/Layout/EcomNavbar";
import EcomFooter from "@/components/Layout/EcomFooter";
import { useAuth, type User } from "@/context/AuthContext";
import { apiClient } from "@/lib/api-client";

interface ProfileFormProps {
  user: User;
  updateUser: (user: User) => void;
}

function ProfileForm({ user, updateUser }: ProfileFormProps) {
  const [firstName, setFirstName] = useState(user.first_name ?? "");
  const [lastName, setLastName] = useState(user.last_name ?? "");
  const [email, setEmail] = useState(user.email_id ?? "");
  const [phone, setPhone] = useState(user.phone_number ?? "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <EcomNavbar />

      <main className="flex-1 pt-16">
        {/* Header */}
        <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">My Profile</h1>
            <nav className="text-sm text-gray-400">
              <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">Ecommerce</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-700 dark:text-gray-300">Profile</span>
            </nav>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-10">
          {/* Profile card */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center">
              <UserIcon className="w-7 h-7 text-white dark:text-gray-900" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email_id}</p>
            </div>
          </div>

          {msg?.type === "success" && (
            <div className="flex items-center gap-2 text-sm px-4 py-3 rounded mb-5 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              {msg.text}
            </div>
          )}

          {msg?.type === "error" && (
            <div className="flex items-center gap-2 text-sm px-4 py-3 rounded mb-5 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">First Name</label>
                <input
                  type="text" required value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3.5 py-2.5 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:border-gray-900 dark:focus:border-gray-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Last Name</label>
                <input
                  type="text" value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3.5 py-2.5 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:border-gray-900 dark:focus:border-gray-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3.5 py-2.5 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:border-gray-900 dark:focus:border-gray-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
              <input
                type="tel" value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3.5 py-2.5 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:border-gray-900 dark:focus:border-gray-400 transition-colors"
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
      </main>

      <EcomFooter />
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateUser, isLoading } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-900 dark:text-white" />
      </div>
    );
  }

  return <ProfileForm user={user} updateUser={updateUser} />;
}
