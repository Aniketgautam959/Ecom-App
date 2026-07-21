import { Suspense } from "react";
import Link from "next/link";
import EcomNavbar from "@/components/Layout/EcomNavbar";
import EcomFooter from "@/components/Layout/EcomFooter";
import NewsletterSection from "@/components/Home/NewsletterSection";
import ProductsListing from "@/components/Products/ProductsListing";

const API = process.env.LARAVEL_INTERNAL_URL ?? "http://127.0.0.1:8000";

async function fetchAll() {
  try {
    const [productsRes, categoriesRes, brandsRes] = await Promise.all([
      fetch(`${API}/api/products`, { next: { revalidate: 30 } }),
      fetch(`${API}/api/categories?per_page=100`, { next: { revalidate: 60 } }),
      fetch(`${API}/api/brands`, { next: { revalidate: 60 } }),
    ]);

    const products = productsRes.ok ? (await productsRes.json()).data ?? [] : [];
    const catJson = categoriesRes.ok ? await categoriesRes.json() : {};
    const categories = catJson.data?.data ?? catJson.data ?? [];
    const brands = brandsRes.ok ? (await brandsRes.json()).data ?? [] : [];

    return { products, categories, brands };
  } catch {
    return { products: [], categories: [], brands: [] };
  }
}

export default async function ShopPage() {
  const { products, categories, brands } = await fetchAll();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <div className="bg-gray-900 text-white text-center text-xs py-2 px-4">
        Get 25% OFF on your first order.{" "}
        <Link href="/products" className="underline font-semibold hover:text-gray-300">
          Order Now
        </Link>
      </div>

      <EcomNavbar />

      <main className="flex-1 pt-16">
        <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Shop</h1>
            <nav className="text-sm text-gray-400">
              <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">Home</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-700 dark:text-gray-300">Shop</span>
            </nav>
          </div>
        </div>

        <Suspense fallback={<p className="text-center py-20 text-gray-400">Loading...</p>}>
          <ProductsListing
            initialProducts={products}
            categories={categories}
            brands={brands}
          />
        </Suspense>
      </main>

      <NewsletterSection />
      <EcomFooter />
    </div>
  );
}

export const metadata = {
  title: "Shop",
};
