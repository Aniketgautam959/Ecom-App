"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, User, ChevronDown, Menu, X, LogOut, Heart, Bell, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api-client";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface NavCategory {
  id: number;
  name: string;
  slug: string;
}

interface NavMenu {
  id: number;
  label: string;
  url: string;
  children?: NavMenu[];
}

export default function EcomNavbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  const [categories, setCategories] = useState<NavCategory[]>([]);
  const [headerMenus, setHeaderMenus] = useState<NavMenu[]>([]);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<Array<{ id: number; title: string; message: string | null; link: string | null; read: boolean; type: string; created_at: string }>>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  const catDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/categories?per_page=100&status=1")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((json) => {
        const cats = json.data?.data ?? json.data ?? [];
        setCategories(cats);
      })
      .catch(() => {});

    fetch("/api/menus/header")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((json) => setHeaderMenus(json.data ?? []))
      .catch(() => {});
  }, []);

  const fetchNotifications = useCallback(() => {
    if (!user) return;
    apiClient
      .get("/notifications")
      .then((res) => {
        const list = res.data.notifications ?? [];
        setNotifications(list);
      })
      .catch(() => {});
  }, [user]);

  // Fetch notifications for logged-in user
  useEffect(() => {
    fetchNotifications();
  }, [user, fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await apiClient.post(`/notifications/${id}/read`);
    } catch {
      // silently fail
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await apiClient.post("/notifications/read-all");
    } catch {
      // silently fail
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (catDropdownRef.current && !catDropdownRef.current.contains(e.target as Node)) {
        setIsCategoriesOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (isCategoriesOpen || notifOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCategoriesOpen, notifOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center">
              <span className="text-white dark:text-gray-900 text-xs font-bold">E</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Ecommerce</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              Home
            </Link>

            <div className="relative" ref={catDropdownRef}>
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Categories
                <ChevronDown className="w-4 h-4" />
              </button>
              {isCategoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => setIsCategoriesOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                  {categories.length === 0 && (
                    <span className="block px-4 py-2 text-sm text-gray-400 italic">No categories</span>
                  )}
                </div>
              )}
            </div>

            {headerMenus.map((menu) =>
              menu.children && menu.children.length > 0 ? (
                <div key={menu.id} className="relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === menu.id ? null : menu.id)}
                    className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {menu.label}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {openMenuId === menu.id && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50">
                      {menu.children.map((child) => (
                        <Link
                          key={child.id}
                          href={child.url}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                          onClick={() => setOpenMenuId(null)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={menu.id}
                  href={menu.url}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {menu.label}
                </Link>
              )
            )}
          </nav>

          {/* Search + Icons */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-full px-4 py-2 bg-white dark:bg-gray-900 w-52">
              <button type="submit" className="p-0 bg-transparent border-0 flex-shrink-0">
                <Search className="w-4 h-4 text-gray-400" />
              </button>
              <input
                type="text"
                placeholder="Search products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 outline-none w-full bg-transparent"
              />
            </form>

            <ThemeToggle />

            {/* Notifications */}
            {user && (
              <div className="relative" ref={notifDropdownRef}>
                <button
                  onClick={() => {
                    const next = !notifOpen;
                    setNotifOpen(next);
                    if (next) fetchNotifications();
                  }}
                  className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50 max-h-[400px] overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="overflow-y-auto flex-1">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-sm text-gray-500">No notifications</div>
                      ) : (
                        notifications.map((n) => {
                          const content = (
                            <div
                              className={`px-4 py-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                                n.read ? "opacity-60" : "bg-gray-50 dark:bg-gray-800/50"
                              }`}
                              onClick={() => markAsRead(n.id)}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</p>
                                {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />}
                              </div>
                              {n.message && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{n.message}</p>}
                              <p className="text-[10px] text-gray-400 mt-1">
                                {new Date(n.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          );
                          return n.link ? (
                            <Link key={n.id} href={n.link} onClick={() => markAsRead(n.id)} className="block">
                              {content}
                            </Link>
                          ) : (
                            <div key={n.id}>{content}</div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cart Icon */}
            <Link href="/cart" className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center px-1">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserOpen(!isUserOpen)}
                  className="flex items-center gap-1.5 p-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <div className="w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {user.first_name?.[0]?.toUpperCase() ?? "U"}
                    </span>
                  </div>
                  <span className="hidden md:block text-sm font-medium">{user.first_name}</span>
                  <ChevronDown className="w-3.5 h-3.5 hidden md:block" />
                </button>
                {isUserOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.email_id}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setIsUserOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    <Link
                      href="/account"
                      onClick={() => setIsUserOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <ShoppingBag className="w-4 h-4" /> My Account
                    </Link>
                    <Link
                      href="/wishlist"
                      onClick={() => setIsUserOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <Heart className="w-4 h-4" /> My Wishlist
                    </Link>
                    <button
                      onClick={() => { logout(); setIsUserOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="p-2 text-gray-700 hover:text-gray-900 transition-colors">
                <User className="w-5 h-5" />
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-4 space-y-3">
          <form onSubmit={handleSearch} className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2">
            <button type="submit" className="p-0 bg-transparent border-0">
              <Search className="w-4 h-4 text-gray-400" />
            </button>
            <input
              type="text"
              placeholder="Search products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm text-gray-700 outline-none w-full bg-transparent"
            />
          </form>
          <Link href="/" className="block text-sm font-medium text-gray-900 py-1" onClick={() => setIsMobileOpen(false)}>Home</Link>
          {categories.length > 0 && (
            <div className="pl-2 space-y-1">
              <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wide">Categories</span>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="block text-sm text-gray-700 dark:text-gray-300 py-1"
                  onClick={() => setIsMobileOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
          {headerMenus.map((menu) => (
            <div key={menu.id}>
              {menu.children && menu.children.length > 0 ? (
                <div className="pl-2 space-y-1">
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wide">{menu.label}</span>
                  {menu.children.map((child) => (
                    <Link
                      key={child.id}
                      href={child.url}
                      className="block text-sm text-gray-700 dark:text-gray-300 py-1"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  href={menu.url}
                  className="block text-sm font-medium text-gray-700 py-1"
                  onClick={() => setIsMobileOpen(false)}
                >
                  {menu.label}
                </Link>
              )}
            </div>
          ))}
          <Link href="/login" className="block text-sm font-medium text-gray-700 py-1" onClick={() => setIsMobileOpen(false)}>Login</Link>
        </div>
      )}
    </header>
  );
}
