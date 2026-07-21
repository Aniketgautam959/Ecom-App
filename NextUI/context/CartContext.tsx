"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api-client";

export interface CartItem {
  id: number;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  size: string;
  color: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: number, size: string, color: string) => void;
  updateQuantity: (id: number, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

const GUEST_KEY = "ecom_cart_guest";

function getGuestItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(GUEST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setGuestItems(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_KEY, JSON.stringify(items));
}

function sameItem(i: CartItem, id: number, size: string, color: string) {
  return i.id === id && i.size === size && i.color === color;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  const isAuthenticated = !!user;

  // Load cart on mount / auth change
  useEffect(() => {
    if (authLoading) return;

    const load = async () => {
      setLoading(true);
      try {
        if (isAuthenticated) {
          const res = await apiClient.get("/cart");
          const serverItems: CartItem[] = res.data?.data?.items ?? [];
          const guestItems = getGuestItems();

          if (guestItems.length > 0) {
            // Only add guest quantities; backend increments existing server rows.
            await Promise.all(
              guestItems.map((item) =>
                apiClient.post("/cart", {
                  product_id: item.id,
                  quantity: item.quantity,
                  size: item.size,
                  color: item.color,
                })
              )
            );
            setGuestItems([]);
            const refreshed = await apiClient.get("/cart");
            setItems(refreshed.data?.data?.items ?? []);
          } else {
            setItems(serverItems);
          }
        } else {
          setItems(getGuestItems());
        }
      } catch {
        setItems(isAuthenticated ? [] : getGuestItems());
      } finally {
        setLoading(false);
        setHydrated(true);
      }
    };

    load();
  }, [isAuthenticated, authLoading]);

  // Persist guest cart to localStorage
  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      setGuestItems(items);
    }
  }, [items, hydrated, isAuthenticated]);

  const addItem = useCallback(
    async (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      const qty = newItem.quantity ?? 1;
      setItems((prev) => {
        const exists = prev.find((i) => sameItem(i, newItem.id, newItem.size, newItem.color));
        if (exists) {
          return prev.map((i) =>
            sameItem(i, newItem.id, newItem.size, newItem.color)
              ? { ...i, quantity: i.quantity + qty }
              : i
          );
        }
        return [...prev, { ...newItem, quantity: qty }];
      });

      if (isAuthenticated) {
        try {
          await apiClient.post("/cart", {
            product_id: newItem.id,
            quantity: qty,
            size: newItem.size,
            color: newItem.color,
          });
        } catch {}
      }
    },
    [isAuthenticated]
  );

  const removeItem = useCallback(
    async (id: number, size: string, color: string) => {
      setItems((prev) => prev.filter((i) => !sameItem(i, id, size, color)));
      if (isAuthenticated) {
        try {
          await apiClient.delete(`/cart/${id}`, { data: { size, color } });
        } catch {}
      }
    },
    [isAuthenticated]
  );

  const updateQuantity = useCallback(
    async (id: number, size: string, color: string, quantity: number) => {
      if (quantity < 1) return;
      setItems((prev) =>
        prev.map((i) => (sameItem(i, id, size, color) ? { ...i, quantity } : i))
      );
      if (isAuthenticated) {
        try {
          await apiClient.put(`/cart/${id}`, { quantity, size, color });
        } catch {}
      }
    },
    [isAuthenticated]
  );

  const clearCart = useCallback(async () => {
    setItems([]);
    if (isAuthenticated) {
      try {
        await apiClient.delete("/cart");
      } catch {}
    }
  }, [isAuthenticated]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
