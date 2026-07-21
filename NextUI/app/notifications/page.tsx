"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, BellOff, Check, Loader2 } from "lucide-react";
import EcomNavbar from "@/components/Layout/EcomNavbar";
import EcomFooter from "@/components/Layout/EcomFooter";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api-client";

interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      apiClient
        .get("/notifications")
        .then((res) => setNotifications(res.data.notifications ?? []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  const markAsRead = async (id: number) => {
    try {
      await apiClient.post(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.post("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {}
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
        <EcomNavbar />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-900 dark:text-white" />
        </main>
        <EcomFooter />
      </div>
    );
  }

  if (!user) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <EcomNavbar />

      <main className="flex-1 pt-16">
        <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Notifications</h1>
              <p className="text-sm text-gray-400">{unreadCount} unread</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-10">
          {notifications.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <BellOff className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="text-gray-400">No notifications yet.</p>
              <Link href="/products" className="text-sm text-gray-900 dark:text-white underline">Start Shopping</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border rounded-lg p-4 flex gap-4 items-start ${
                    notification.read
                      ? "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
                      : "border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-900"
                  }`}
                >
                  <div className="mt-0.5">
                    <Bell className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{notification.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{new Date(notification.created_at).toLocaleString()}</p>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs flex items-center gap-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                      <Check className="w-3 h-3" /> Mark read
                    </button>
                  )}
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
