import Link from "next/link";
import { notFound } from "next/navigation";
import EcomNavbar from "@/components/Layout/EcomNavbar";
import EcomFooter from "@/components/Layout/EcomFooter";
import NewsletterSection from "@/components/Home/NewsletterSection";
import ProductCard from "@/components/Home/ProductCard";
import ProductDetailClient from "@/components/Home/ProductDetailClient";

interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  status: boolean;
  image: string | null;
  main_image?: string | null;
  gallery?: { id: number; url: string }[];
  video?: string | null;
  sizes?: string[];
  colors?: { name: string | null; hex: string }[];
  category: { id: number; name: string } | null;
  brand: { id: number; name: string } | null;
}

const LARAVEL_ORIGIN = (process.env.LARAVEL_INTERNAL_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");

function rewriteStorageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith(LARAVEL_ORIGIN + "/storage/")) {
    return url.slice(LARAVEL_ORIGIN.length);
  }
  if (/^https?:\/\/(127\.0\.0\.1|localhost):\d+\/storage\//.test(url)) {
    return url.replace(/^https?:\/\/(127\.0\.0\.1|localhost):\d+/, "");
  }
  return url;
}

function rewriteProduct(p: ApiProduct): ApiProduct {
  return {
    ...p,
    image: rewriteStorageUrl(p.image),
    main_image: rewriteStorageUrl(p.main_image),
    gallery: (p.gallery ?? []).map((g) => ({ ...g, url: rewriteStorageUrl(g.url) ?? g.url })),
    video: rewriteStorageUrl(p.video),
  };
}

async function getProduct(slug: string): Promise<ApiProduct | null> {
  try {
    const res = await fetch(
      `${LARAVEL_ORIGIN}/api/products/${slug}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const product = json.data ?? null;
    return product ? rewriteProduct(product) : null;
  } catch {
    return null;
  }
}

async function getRelated(): Promise<ApiProduct[]> {
  try {
    const res = await fetch(
      `${process.env.LARAVEL_INTERNAL_URL}/api/products/latest`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;
  const [product, related] = await Promise.all([getProduct(slug), getRelated()]);

  if (!product) notFound();

  const relatedFiltered = related
    .filter((p) => p.slug !== slug)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <div className="bg-gray-900 text-white text-center text-xs py-2 px-4">
        Get 25% OFF on your first order.{" "}
        <Link href="/" className="underline font-semibold hover:text-gray-300">Order Now</Link>
      </div>

      <EcomNavbar />

      <main className="flex-1 pt-16">
        {/* Breadcrumb */}
        <div className="bg-gray-50 dark:bg-gray-900 py-4 px-4 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-6xl mx-auto text-sm text-gray-400">
            <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">Ecommerce</Link>
            <span className="mx-2">›</span>
            {product.category && (
              <>
                <span>{product.category.name}</span>
                <span className="mx-2">›</span>
              </>
            )}
            <span className="text-gray-700 dark:text-gray-300">{product.name}</span>
          </div>
        </div>

        {/* Product Detail — interactive parts in client component */}
        <ProductDetailClient product={product} />

        {/* You might also like */}
        {relatedFiltered.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 pb-12">
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">SIMILAR PRODUCTS</p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">You might also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedFiltered.map((p) => (
                <ProductCard
                  key={p.id}
                  product={{
                    id: p.id,
                    name: p.name,
                    price: Number(p.price),
                    inStock: p.status,
                    image: p.image ?? "",
                    bgColor: "bg-gray-100",
                    slug: p.slug,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <NewsletterSection />
      </main>

      <EcomFooter />
    </div>
  );
}
