import Link from "next/link";
import { Suspense } from "react";
import { Search, X } from "lucide-react";
import EcomNavbar from "@/components/Layout/EcomNavbar";
import EcomFooter from "@/components/Layout/EcomFooter";
import NewsletterSection from "@/components/Home/NewsletterSection";
import SearchResults from "@/components/Products/SearchResults";

const API = process.env.LARAVEL_INTERNAL_URL ?? "http://127.0.0.1:8000";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

async function fetchSearchResults(query: string) {
  try {
    const res = await fetch(
      `${API}/api/products/search?q=${encodeURIComponent(query)}`,
      { next: { revalidate: 0 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <EcomNavbar />

      <main className="flex-1 pt-16">
        {/* Page Header */}
        <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Search Products</h1>
            <nav className="text-sm text-gray-400">
              <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">Home</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-700 dark:text-gray-300">Search</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Search form */}
          <form action="/search" method="GET" className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-900 mb-6 max-w-2xl">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search products..."
              className="flex-1 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none bg-transparent"
            />
            {query && (
              <a href="/search" className="text-gray-400 hover:text-gray-700">
                <X className="w-4 h-4" />
              </a>
            )}
            <button
              type="submit"
              className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white text-sm font-medium px-4 py-2 rounded hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
            >
              Search
            </button>
          </form>

          {!query ? (
            <div className="text-center py-20 flex flex-col items-center gap-3">
              <Search className="w-12 h-12 text-gray-200 dark:text-gray-700" />
              <p className="text-gray-400">Enter a keyword to search products.</p>
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-20">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                </div>
              }
            >
              <SearchResults initialProducts={await fetchSearchResults(query)} query={query} />
            </Suspense>
          )}
        </div>
      </main>

      <NewsletterSection />
      <EcomFooter />
    </div>
  );
}

export const metadata = {
  title: "Search Products",
};
