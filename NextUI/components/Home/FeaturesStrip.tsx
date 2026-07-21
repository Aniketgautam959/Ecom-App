import { Truck, Award, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "Upgrade your style today and get FREE shipping on all orders! Don't miss out.",
  },
  {
    icon: Award,
    title: "Satisfaction Guarantee",
    desc: "Shop confidently with our Satisfaction Guarantee: Love it or we'll refund.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    desc: "Your security is our priority. Your payments are with us.",
  },
];

export default function FeaturesStrip() {
  return (
    <section className="py-16 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="flex flex-col items-start gap-3">
                <Icon className="w-7 h-7 text-gray-700 dark:text-gray-300" strokeWidth={1.5} />
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
