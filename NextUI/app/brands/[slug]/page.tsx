import { Suspense } from "react";
import { notFound } from "next/navigation";
import EcomNavbar from "@/components/Layout/EcomNavbar";
import EcomFooter from "@/components/Layout/EcomFooter";
import NewsletterSection from "@/components/Home/NewsletterSection";
import ProductsListing from "@/components/Products/ProductsListing";
import Link from "next/link";

const API = process.env.LARAVEL_INTERNAL_URL ?? "http://127.0.0.1:8000";

interface BrandData {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

async function getBrandAndProducts(slug: string) {
  try {
    const brandRes = await fetch(`${API}/api/brands/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!brandRes.ok) return null;

    const brandJson = await brandRes.json();
    const brand: BrandData = brandJson.data;

    const productsRes = await fetch(
      `${API}/api/products?brand_id=${brand.id}`,
      { next: { revalidate: 30 } }
    );
    const products = productsRes.ok ? (await productsRes.json()).data ?? [] : [];

    const [categoriesRes, brandsRes] = await Promise.all([
      fetch(`${API}/api/categories?per_page=100`, { next: { revalidate: 60 } }),
      fetch(`${API}/api/brands`, { next: { revalidate: 60 } }),
    ]);

    const allCatJson = categoriesRes.ok ? await categoriesRes.json() : {};
    const categories = allCatJson.data?.data ?? allCatJson.data ?? [];
    const brands = brandsRes.ok ? (await brandsRes.json()).data ?? [] : [];

    return { brand, products, categories, brands };
  } catch {
    return null;
  }
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getBrandAndProducts(slug);

  if (!data) notFound();

  const { brand, products, categories, brands } = data;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      {/* Promo Banner */}
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{brand.name}</h1>
            <nav className="text-sm text-gray-400">
              <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">Home</Link>
              <span className="mx-2">›</span>
              <Link href="/products" className="hover:text-gray-700 dark:hover:text-gray-200">Products</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-700 dark:text-gray-300">{brand.name}</span>
            </nav>
            {brand.description && (
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">{brand.description}</p>
            )}
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
