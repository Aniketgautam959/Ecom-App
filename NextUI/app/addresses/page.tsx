import EcomNavbar from "@/components/Layout/EcomNavbar";
import EcomFooter from "@/components/Layout/EcomFooter";
import NewsletterSection from "@/components/Home/NewsletterSection";
import AccountClient from "@/components/Account/AccountClient";
import Link from "next/link";

export default function AddressesPage() {
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
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">My Addresses</h1>
            <nav className="text-sm text-gray-400">
              <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">Ecommerce</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-700 dark:text-gray-300">My Addresses</span>
            </nav>
          </div>
        </div>

        <AccountClient defaultTab="address" />
      </main>

      <NewsletterSection />
      <EcomFooter />
    </div>
  );
}

export const metadata = {
  title: "My Addresses",
};
