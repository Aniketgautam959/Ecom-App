import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackActions } from "@react-navigation/native";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api, unwrap } from "../api";
import { isAuthScreen, screenToRoute } from "../navigation/helpers";
import { navigationRef } from "../navigation/ref";
import type {
  Brand,
  CartItem,
  Category,
  Order,
  Product,
  Screen,
  User,
} from "../types";

interface AppContextValue {
  // Navigation
  go: (screen: Screen) => void;
  back: () => void;
  replace: (screen: Screen) => void;

  // Loading
  loading: boolean;

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

export function AppProvider({ children }: { children: ReactNode }) {
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
  const [loading, setLoading] = useState(true);

  // Restore persisted session
  useEffect(() => {
    (async () => {
      const [savedUser, savedToken] = await Promise.all([
        AsyncStorage.getItem("user"),
        AsyncStorage.getItem("auth_token"),
      ]);
      if (savedUser && savedToken) {
        try {
          setUser(JSON.parse(savedUser) as User);
        } catch {
          // ignore corrupt storage
        }
      }
    })();
  }, []);

  // Fetch public catalog
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [pRes, fRes, lRes, cRes, bRes] = await Promise.all([
          api.get("/products"),
          api.get("/products/featured"),
          api.get("/products/latest"),
          api.get("/categories?status=1"),
          api.get("/brands?status=1"),
        ]);
        if (!active) return;
        setProducts((unwrap(pRes) as Product[]) ?? []);
        setFeatured((unwrap(fRes) as Product[]) ?? []);
        setLatest((unwrap(lRes) as Product[]) ?? []);
        const cats = unwrap(cRes);
        const brandsData = unwrap(bRes);
        setCategories(
          Array.isArray(cats) ? cats : (cats as { data?: Category[] })?.data ?? []
        );
        setBrands(
          Array.isArray(brandsData) ? brandsData : (brandsData as { data?: Brand[] })?.data ?? []
        );
      } catch {
        // ignore; empty catalog will show empty states
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Sync account data on auth change
  useEffect(() => {
    if (!user) {
      setWishlist([]);
      setCart([]);
      return;
    }
    let active = true;
    (async () => {
      try {
        const [wRes, cRes] = await Promise.all([api.get("/wishlist"), api.get("/cart")]);
        if (!active) return;
        setWishlist((unwrap(wRes) as Product[]) ?? []);
        const cartData = unwrap(cRes) as { items?: CartItem[] };
        setCart(cartData?.items ?? []);
      } catch {
        // ignore
      }
    })();
    return () => {
      active = false;
    };
  }, [user]);

  const go = useCallback((screen: Screen) => {
    if (!navigationRef.isReady()) return;
    if (isAuthScreen(screen)) {
      navigationRef.navigate("Auth", { mode: screen });
      return;
    }
    navigationRef.navigate(screenToRoute(screen) as any);
  }, []);

  const back = useCallback(() => {
    if (!navigationRef.isReady()) return;
    if (navigationRef.canGoBack()) {
      navigationRef.goBack();
    } else {
      navigationRef.navigate("Home");
    }
  }, []);

  const replace = useCallback((screen: Screen) => {
    if (!navigationRef.isReady()) return;
    if (isAuthScreen(screen)) {
      navigationRef.dispatch(StackActions.replace("Auth", { mode: screen }));
      return;
    }
    navigationRef.dispatch(StackActions.replace(screenToRoute(screen) as any));
  }, []);

  const addToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
    setCart((items) => {
      const existing = items.find(
        (item) =>
          item.id === product.id &&
          (item.size ?? "") === (size ?? "") &&
          (item.color ?? "") === (color ?? "")
      );
      if (existing) {
        return items.map((item) =>
          item.id === product.id &&
          (item.size ?? "") === (size ?? "") &&
          (item.color ?? "") === (color ?? "")
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
        (item) =>
          !(item.id === id && (item.size ?? "") === (size ?? "") && (item.color ?? "") === (color ?? ""))
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
    try {
      await api.post("/auth/logout");
    } catch {
      // still clear local session
    }
    await AsyncStorage.multiRemove(["auth_token", "user"]);
    setUser(null);
    setCart([]);
    setWishlist([]);
    replace("login");
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + Number(item.sale_price ?? item.price) * item.quantity,
    0
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const value: AppContextValue = {
    go,
    back,
    replace,
    loading,
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
