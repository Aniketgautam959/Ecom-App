import type { Screen } from "../types";

export type AuthMode = Extract<
  Screen,
  "login" | "register" | "forgot-password" | "reset-password"
>;

export type RootStackParamList = {
  Onboarding: undefined;
  Auth: { mode: AuthMode };
  Home: undefined;
  Shop: undefined;
  Categories: undefined;
  CategoryProducts: undefined;
  Brands: undefined;
  BrandProducts: undefined;
  Search: undefined;
  Product: undefined;
  Wishlist: undefined;
  Cart: undefined;
  Checkout: undefined;
  Payment: undefined;
  OrderSuccess: undefined;
  OrderFailed: undefined;
  Orders: undefined;
  OrderDetails: undefined;
  Track: undefined;
  Profile: undefined;
  Account: undefined;
  Addresses: undefined;
  Notifications: undefined;
  Settings: undefined;
  About: undefined;
  Contact: undefined;
  Faq: undefined;
  PrivacyPolicy: undefined;
  TermsConditions: undefined;
  Support: undefined;
};
