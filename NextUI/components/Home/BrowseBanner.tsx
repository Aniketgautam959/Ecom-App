import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function BrowseBanner() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left content */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Browse Our Fashion Paradise!
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
              Step into a world of style and explore our diverse collection of clothing categories.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-6 py-3 font-medium hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
            >
              Start Browsing
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right — decorative clothing image */}
          <div className="flex-1 flex justify-end">
            <div className="relative w-56 h-64 md:w-72 md:h-80">
              {/* Hanger stick */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-gray-400" />
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-16 h-px bg-gray-400" />
              {/* Poncho / clothing placeholder */}
              <div className="absolute top-8 inset-x-0 bottom-0 bg-amber-50 rounded-lg flex items-center justify-center shadow-sm">
                <div className="text-center text-gray-400">
                  <div className="w-32 h-40 mx-auto bg-amber-100 rounded" style={{ clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
