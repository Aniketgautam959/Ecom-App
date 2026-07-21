import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  image?: string;
  image_url?: string;
  link?: string;
  button_text?: string;
}

export default function HeroSection({ banner }: { banner?: Banner }) {
  const title = banner?.title ?? "Fresh Arrivals Online";
  const subtitle = banner?.subtitle ?? "Discover Our Newest Collection Today.";
  const link = banner?.link ?? "/products";
  const buttonText = banner?.button_text ?? "View Collection";
  const SAMPLE_IMAGE =
    "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80";
  const laravelBase =
    process.env.LARAVEL_INTERNAL_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000";
  const rawImageSrc = banner?.image_url ?? banner?.image ?? SAMPLE_IMAGE;
  const imageSrc =
    typeof rawImageSrc === "string" && rawImageSrc.startsWith("/storage/")
      ? `${laravelBase}${rawImageSrc}`
      : rawImageSrc;

  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-950 min-h-[560px] flex items-stretch">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gray-100 dark:bg-gray-900" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row items-center gap-0">

        {/* Left — Text */}
        <div className="flex-1 flex flex-col justify-center py-16 pr-0 md:pr-12 z-10">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-gray-400 dark:text-gray-500 mb-4">
            New Collection 2025
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
            {title}
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400 mb-10 max-w-md">
            {subtitle}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href={link}
              className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-8 py-4 font-semibold tracking-wide hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors"
            >
              {buttonText}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/products"
              className="text-sm text-gray-500 dark:text-gray-400 underline underline-offset-4 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Browse all
            </Link>
          </div>
        </div>

        {/* Right — Full portrait image */}
        <div className="flex-1 flex justify-center md:justify-end items-end relative min-h-[420px] md:min-h-[560px]">
          {/* Decorative tag */}
          <div className="absolute top-8 left-4 md:left-8 z-20 bg-white dark:bg-gray-900 shadow-lg px-3 py-2 rounded-sm">
            <p className="text-[10px] uppercase tracking-widest text-gray-400">Season</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">SS 2025</p>
          </div>

          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="max-w-sm md:max-w-md h-[420px] md:h-[560px] object-cover object-top"
          />

          {/* Price badge */}
          <div className="absolute bottom-8 right-4 md:right-8 z-20 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-3 rounded-sm shadow-xl">
            <p className="text-[10px] uppercase tracking-widest opacity-60">Starting from</p>
            <p className="text-xl font-bold">₹999</p>
          </div>
        </div>

      </div>
    </section>
  );
}
