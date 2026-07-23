import type { Screen } from "../types";
import type { RootStackParamList } from "./types";

const screenToRouteMap: Record<Screen, keyof RootStackParamList> = {
  onboarding: "Onboarding",
  login: "Auth",
  register: "Auth",
  "forgot-password": "Auth",
  "reset-password": "Auth",
  home: "Home",
  shop: "Shop",
  categories: "Categories",
  "category-products": "CategoryProducts",
  brands: "Brands",
  "brand-products": "BrandProducts",
  search: "Search",
  product: "Product",
  wishlist: "Wishlist",
  cart: "Cart",
  checkout: "Checkout",
  payment: "Payment",
  "order-success": "OrderSuccess",
  "order-failed": "OrderFailed",
  orders: "Orders",
  order: "OrderDetails",
  track: "Track",
  profile: "Profile",
  account: "Account",
  addresses: "Addresses",
  notifications: "Notifications",
  settings: "Settings",
  about: "About",
  contact: "Contact",
  faq: "Faq",
  "privacy-policy": "PrivacyPolicy",
  "terms-conditions": "TermsConditions",
  support: "Support",
};

export function screenToRoute(screen: Screen): keyof RootStackParamList {
  return screenToRouteMap[screen];
}

export function isAuthScreen(
  screen: Screen
): screen is "login" | "register" | "forgot-password" | "reset-password" {
  return ["login", "register", "forgot-password", "reset-password"].includes(screen);
}
