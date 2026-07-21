import Link from "next/link";
import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

export default function OffersSection() {
  const offers = [
    { icon: Truck, title: "Free Shipping", desc: "On orders above ₹500" },
    { icon: RotateCcw, title: "Easy Returns", desc: "7-day return policy" },
    { icon: ShieldCheck, title: "Secure Payment", desc: "100% secure checkout" },
    { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Promo Banner 1 */}
          <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-8 md:p-10 flex flex-col justify-center items-start text-white min-h-[220px]">
            <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">Summer Sale</p>
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Up to 50% Off</h3>
            <p className="text-sm text-gray-300 mb-6">On selected styles and new arrivals.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 text-sm font-medium hover:bg-gray-100 transition-colors rounded"
            >
              Shop Now
            </Link>
          </div>

          {/* Promo Banner 2 */}
          <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-8 md:p-10 flex flex-col justify-center items-start min-h-[220px] border border-gray-200 dark:border-gray-800">
            <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">New Arrivals</p>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">Fresh Collection</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Discover the latest trends this season.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors rounded"
            >
              Explore
            </Link>
          </div>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-gray-100 dark:border-gray-800 pt-12">
          {offers.map((offer) => (
            <div key={offer.title} className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                <offer.icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{offer.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{offer.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
