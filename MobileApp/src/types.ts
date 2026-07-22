export type Screen =
  | "onboarding"
  | "login"
  | "register"
  | "forgot-password"
  | "reset-password"
  | "home"
  | "shop"
  | "categories"
  | "category-products"
  | "brands"
  | "brand-products"
  | "search"
  | "product"
  | "wishlist"
  | "cart"
  | "checkout"
  | "payment"
  | "order-success"
  | "order-failed"
  | "orders"
  | "order"
  | "track"
  | "profile"
  | "account"
  | "addresses"
  | "notifications"
  | "settings"
  | "about"
  | "contact"
  | "faq"
  | "privacy-policy"
  | "terms-conditions"
  | "support";

export type User = {
  id: number;
  first_name: string;
  last_name?: string;
  email_id: string;
  phone_number?: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
};

export type Brand = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  logo?: string | null;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  price: number | string;
  sale_price?: number | string | null;
  image?: string | null;
  images?: string[];
  main_image?: string | null;
  gallery?: { id: number; url: string }[];
  video?: string | null;
  sizes?: string[];
  colors?: { name: string | null; hex: string }[];
  category?: Category | null;
  brand?: Brand | null;
  short_description?: string | null;
  description?: string | null;
  status?: boolean;
  inStock?: boolean;
};

export type CartItem = Product & {
  quantity: number;
  size?: string;
  color?: string;
};

export type Address = {
  id: number;
  label: string;
  name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default: boolean;
};

export type AddressFormData = {
  label: string;
  name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default: boolean;
};

export type OrderItem = {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string | null;
  size: string | null;
  color: string | null;
  price: number;
  quantity: number;
  total: number;
};

export type Order = {
  id: number;
  order_number: string;
  status: string;
  subtotal: number;
  discount: number;
  shipping_cost: number;
  tax: number;
  total: number;
  payment_method: string;
  payment_status: string;
  coupon_code: string | null;
  notes: string | null;
  date: string;
  created_at: string;
  shipping: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items: OrderItem[];
};

export type Notification = {
  id: number;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
};

export type CheckoutSettings = {
  shipping_flat_rate: number;
  shipping_free_threshold: number;
  tax_rate: number;
  razorpay_enabled: boolean;
  razorpay_key: string;
};
