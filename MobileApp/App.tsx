import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView } from "react-native";
import { api, messageFrom, unwrap } from "./src/api";
import { AppProvider, useApp } from "./src/context/AppContext";
import { About } from "./src/screens/About";
import { Account } from "./src/screens/Account";
import { Addresses } from "./src/screens/Addresses";
import { Auth } from "./src/screens/Auth";
import { BrandProducts } from "./src/screens/BrandProducts";
import { Brands } from "./src/screens/Brands";
import { Cart } from "./src/screens/Cart";
import { Categories } from "./src/screens/Categories";
import { CategoryProducts } from "./src/screens/CategoryProducts";
import { Checkout } from "./src/screens/Checkout";
import { Contact } from "./src/screens/Contact";
import { Faq } from "./src/screens/Faq";
import { Home } from "./src/screens/Home";
import { Notifications } from "./src/screens/Notifications";
import { Onboarding } from "./src/screens/Onboarding";
import { OrderDetails } from "./src/screens/OrderDetails";
import { OrderFailed } from "./src/screens/OrderFailed";
import { Orders } from "./src/screens/Orders";
import { OrderSuccess } from "./src/screens/OrderSuccess";
import { Payment } from "./src/screens/Payment";
import { PrivacyPolicy } from "./src/screens/PrivacyPolicy";
import { ProductDetail } from "./src/screens/ProductDetail";
import { Profile } from "./src/screens/Profile";
import { Search } from "./src/screens/Search";
import { Settings } from "./src/screens/Settings";
import { Shop } from "./src/screens/Shop";
import { Support } from "./src/screens/Support";
import { TermsConditions } from "./src/screens/TermsConditions";
import { Track } from "./src/screens/Track";
import { Wishlist } from "./src/screens/Wishlist";
import type { Brand, CartItem, Category, Product, User } from "./src/types";

function Router() {
  const { screen, go, back, setUser, user, setProducts, setCategories, setBrands, setFeatured, setLatest, setWishlist, setCart } = useApp();
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Onboarding + persisted auth
  useEffect(() => {
    (async () => {
      const [seen, savedUser] = await Promise.all([
        AsyncStorage.getItem("onboarding_seen"),
        AsyncStorage.getItem("user"),
      ]);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser) as User);
        } catch {
          // ignore
        }
      }
      // initial screen handled by AppProvider prop
      setHydrated(true);
    })();
  }, [setUser]);

  // Fetch catalog
  useEffect(() => {
    if (!hydrated) return;
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
        const brands = unwrap(bRes);
        setCategories((Array.isArray(cats) ? cats : (cats as { data?: Category[] })?.data) ?? []);
        setBrands((Array.isArray(brands) ? brands : (brands as { data?: Brand[] })?.data) ?? []);
      } catch (err) {
        Alert.alert("Connection error", messageFrom(err));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [hydrated, setProducts, setCategories, setBrands, setFeatured, setLatest]);

  // Sync account data
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
  }, [user, setWishlist, setCart]);

  const common = { back: screen === "home" || screen === "onboarding" ? undefined : back };

  switch (screen) {
    case "onboarding":
      return (
        <Onboarding
          done={async () => {
            await AsyncStorage.setItem("onboarding_seen", "true");
            go("login");
          }}
        />
      );
    case "login":
      return <Auth mode="login" />;
    case "register":
      return <Auth mode="register" />;
    case "forgot-password":
      return <Auth mode="forgot-password" />;
    case "reset-password":
      return <Auth mode="reset-password" />;
    case "home":
      return <Home loading={loading} />;
    case "shop":
      return <Shop back={common.back!} />;
    case "categories":
      return <Categories back={common.back!} />;
    case "category-products":
      return <CategoryProducts back={common.back!} />;
    case "brands":
      return <Brands back={common.back!} />;
    case "brand-products":
      return <BrandProducts back={common.back!} />;
    case "search":
      return <Search back={common.back!} />;
    case "product":
      return <ProductDetail back={common.back!} />;
    case "wishlist":
      return <Wishlist back={common.back!} />;
    case "cart":
      return <Cart back={common.back!} />;
    case "checkout":
      return <Checkout back={common.back!} />;
    case "payment":
      return <Payment back={common.back!} />;
    case "order-success":
      return <OrderSuccess back={common.back!} />;
    case "order-failed":
      return <OrderFailed back={common.back!} />;
    case "orders":
      return <Orders back={common.back!} />;
    case "order":
      return <OrderDetails back={common.back!} />;
    case "track":
      return <Track back={common.back!} />;
    case "profile":
      return <Profile back={common.back!} />;
    case "account":
      return <Account back={common.back!} />;
    case "addresses":
      return <Addresses back={common.back!} />;
    case "notifications":
      return <Notifications back={common.back!} />;
    case "settings":
      return <Settings back={common.back!} />;
    case "about":
      return <About back={common.back!} />;
    case "contact":
      return <Contact back={common.back!} />;
    case "faq":
      return <Faq back={common.back!} />;
    case "privacy-policy":
      return <PrivacyPolicy back={common.back!} />;
    case "terms-conditions":
      return <TermsConditions back={common.back!} />;
    case "support":
    default:
      return <Support back={common.back!} />;
  }
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [startScreen, setStartScreen] = useState<"onboarding" | "login" | "home">("onboarding");

  useEffect(() => {
    (async () => {
      const [seen, savedUser] = await Promise.all([
        AsyncStorage.getItem("onboarding_seen"),
        AsyncStorage.getItem("user"),
      ]);
      if (!seen) setStartScreen("onboarding");
      else if (savedUser) setStartScreen("home");
      else setStartScreen("login");
      setReady(true);
    })();
  }, []);

  if (!ready) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <AppProvider initialScreen={startScreen}>
      <Router />
    </AppProvider>
  );
}
