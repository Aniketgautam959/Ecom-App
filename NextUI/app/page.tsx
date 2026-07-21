import EcomNavbar from "@/components/Layout/EcomNavbar";
import HeroSection from "@/components/Home/HeroSection";
import FeaturesStrip from "@/components/Home/FeaturesStrip";
import CategoryGrid from "@/components/Home/CategoryGrid";
import BestSellingSection from "@/components/Home/BestSellingSection";
import BrowseBanner from "@/components/Home/BrowseBanner";
import FeaturedProductsSection from "@/components/Home/FeaturedProductsSection";
import OffersSection from "@/components/Home/OffersSection";
import BrandGrid from "@/components/Home/BrandGrid";
import NewsletterSection from "@/components/Home/NewsletterSection";
import EcomFooter from "@/components/Layout/EcomFooter";

async function getProducts(endpoint: string) {
  try {
    const res = await fetch(
      `${process.env.LARAVEL_INTERNAL_URL}/api/products/${endpoint}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(
      `${process.env.LARAVEL_INTERNAL_URL}/api/categories?status=1`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data?.data ?? json.data ?? [];
  } catch {
    return [];
  }
}

async function getBrands() {
  try {
    const res = await fetch(
      `${process.env.LARAVEL_INTERNAL_URL}/api/brands?status=1`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data?.data ?? json.data ?? [];
  } catch {
    return [];
  }
}

async function getBanners(position: string) {
  try {
    const res = await fetch(
      `${process.env.LARAVEL_INTERNAL_URL}/api/banners/${position}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featured, latest, categories, brands, heroBanners] = await Promise.all([
    getProducts("featured"),
    getProducts("latest"),
    getCategories(),
    getBrands(),
    getBanners("home_hero"),
  ]);

  const heroBanner = heroBanners[0];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <EcomNavbar />
      <main className="pt-16">
        <HeroSection banner={heroBanner} />
        <FeaturesStrip />
        <CategoryGrid categories={categories} />
        <BestSellingSection products={featured} />
        <BrowseBanner />
        <FeaturedProductsSection featured={featured} latest={latest} />
        <OffersSection />
        <BrandGrid brands={brands} />
        <NewsletterSection />
      </main>
      <EcomFooter />
    </div>
  );
}
