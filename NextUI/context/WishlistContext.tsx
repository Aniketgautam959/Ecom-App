"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api-client";

export interface WishlistItem {
  id: number;
  slug: string;
  name: string;
  price: number;
  image: string | null;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: number) => void;
  toggleItem: (item: WishlistItem) => void;
  isInWishlist: (id: number) => boolean;
  totalItems: number;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};

const GUEST_KEY = "ecom_wishlist_guest";

function getGuestItems(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(GUEST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setGuestItems(items: WishlistItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_KEY, JSON.stringify(items));
}

function mergeItems(a: WishlistItem[], b: WishlistItem[]): WishlistItem[] {
  const map = new Map<number, WishlistItem>();
  [...a, ...b].forEach((item) => map.set(item.id, item));
  return Array.from(map.values());
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  const isAuthenticated = !!user;

  // Load wishlist on mount or when auth state changes
  useEffect(() => {
    if (authLoading) return;

    const load = async () => {
      setLoading(true);
      try {
        if (isAuthenticated) {
          const res = await apiClient.get("/wishlist");
          const serverItems: WishlistItem[] = res.data.data ?? [];
          const guestItems = getGuestItems();

          // If guest had items, sync them to server then clear guest storage
          if (guestItems.length > 0) {
            const merged = mergeItems(serverItems, guestItems);
            await Promise.all(
              merged.map((item) => apiClient.post("/wishlist", { product_id: item.id }))
            );
            setGuestItems([]);
            // Re-fetch after merge
            const refreshed = await apiClient.get("/wishlist");
            setItems(refreshed.data.data ?? []);
          } else {
            setItems(serverItems);
          }
        } else {
          setItems(getGuestItems());
        }
      } catch {
        // Fallback to guest/local items on error
        setItems(isAuthenticated ? [] : getGuestItems());
      } finally {
        setLoading(false);
        setHydrated(true);
      }
    };

    load();
  }, [isAuthenticated, authLoading]);

  // Persist guest items to localStorage
  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      setGuestItems(items);
    }
  }, [items, hydrated, isAuthenticated]);

  const addItem = useCallback(
    async (item: WishlistItem) => {
      setItems((prev) => (prev.find((i) => i.id === item.id) ? prev : [...prev, item]));
      if (isAuthenticated) {
        try {
          await apiClient.post("/wishlist", { product_id: item.id });
        } catch {}
      }
    },
    [isAuthenticated]
  );

  const removeItem = useCallback(
    async (id: number) => {
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (isAuthenticated) {
        try {
          await apiClient.delete(`/wishlist/${id}`);
        } catch {}
      }
    },
    [isAuthenticated]
  );

  const toggleItem = useCallback(
    async (item: WishlistItem) => {
      const exists = items.some((i) => i.id === item.id);
      if (exists) {
        await removeItem(item.id);
      } else {
        await addItem(item);
      }
    },
    [items, addItem, removeItem]
  );

  const isInWishlist = useCallback((id: number) => items.some((i) => i.id === id), [items]);

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        toggleItem,
        isInWishlist,
        totalItems: items.length,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
