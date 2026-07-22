import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Brand, CartItem, Category, Order, Product, Screen, User } from "../types";

interface AppContextValue {
  // Navigation
  screen: Screen;
  history: Screen[];
  go: (screen: Screen) => void;
  back: () => void;
  replace: (screen: Screen) => void;

  // Catalog
  products: Product[];
  setProducts: (products: Product[]) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  brands: Brand[];
  setBrands: (brands: Brand[]) => void;
  featured: Product[];
  setFeatured: (products: Product[]) => void;
  latest: Product[];
  setLatest: (products: Product[]) => void;

  // Selection
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void;
  selectedBrand: Brand | null;
  setSelectedBrand: (brand: Brand | null) => void;
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;

  // Auth
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;

  // Cart
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (id: number, size?: string, color?: string) => void;
  updateCartQuantity: (id: number, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Wishlist
  wishlist: Product[];
  setWishlist: (items: Product[]) => void;
  toggleWishlist: (product: Product) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children, initialScreen }: { children: ReactNode; initialScreen: Screen }) {
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [history, setHistory] = useState<Screen[]>([]);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [latest, setLatest] = useState<Product[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  const go = (next: Screen) => {
    setHistory((old) => [...old, screen]);
    setScreen(next);
  };

  const back = () => {
    setHistory((old) => {
      const previous = old[old.length - 1] ?? "home";
      setScreen(previous);
      return old.slice(0, -1);
    });
  };

  const replace = (next: Screen) => {
    setScreen(next);
  };

  const addToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
    setCart((items) => {
      const key = `${product.id}-${size ?? ""}-${color ?? ""}`;
      const existing = items.find(
        (item) => item.id === product.id && (item.size ?? "") === (size ?? "") && (item.color ?? "") === (color ?? "")
      );
      if (existing) {
        return items.map((item) =>
          item.id === product.id && (item.size ?? "") === (size ?? "") && (item.color ?? "") === (color ?? "")
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...items, { ...product, quantity, size, color }];
    });
  };

  const removeFromCart = (id: number, size?: string, color?: string) => {
    setCart((items) =>
      items.filter(
        (item) => !(item.id === id && (item.size ?? "") === (size ?? "") && (item.color ?? "") === (color ?? ""))
      )
    );
  };

  const updateCartQuantity = (id: number, quantity: number, size?: string, color?: string) => {
    if (quantity < 1) {
      removeFromCart(id, size, color);
      return;
    }
    setCart((items) =>
      items.map((item) =>
        item.id === id && (item.size ?? "") === (size ?? "") && (item.color ?? "") === (color ?? "")
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (product: Product) => {
    setWishlist((items) => {
      const exists = items.some((item) => item.id === product.id);
      return exists ? items.filter((item) => item.id !== product.id) : [...items, product];
    });
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["auth_token", "user"]);
    setUser(null);
    setCart([]);
    setWishlist([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + Number(item.sale_price ?? item.price) * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const value: AppContextValue = {
    screen,
    history,
    go,
    back,
    replace,
    products,
    setProducts,
    categories,
    setCategories,
    brands,
    setBrands,
    featured,
    setFeatured,
    latest,
    setLatest,
    selectedProduct,
    setSelectedProduct,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    selectedOrder,
    setSelectedOrder,
    user,
    setUser,
    logout,
    cart,
    setCart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    cartCount,
    wishlist,
    setWishlist,
    toggleWishlist,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
