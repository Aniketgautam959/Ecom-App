"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, Minus, Plus, Truck, ChevronDown, ChevronUp, ShoppingCart, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCurrency, formatPrice } from "@/context/CurrencyContext";
import ProductReviews from "@/components/Products/ProductReviews";

interface GalleryImage {
  id: number;
  url: string;
}

interface ProductColor {
  name: string | null;
  hex: string;
}

interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  status: boolean;
  image: string | null;
  main_image?: string | null;
  gallery?: GalleryImage[];
  video?: string | null;
  sizes?: string[];
  colors?: ProductColor[];
  category: { id: number; name: string; slug?: string } | null;
  brand: { id: number; name: string; slug?: string } | null;
}

type GalleryItem =
  | { type: "image"; url: string }
  | { type: "video"; url: string };

/**
 * Detect YouTube / Vimeo URLs and return an embeddable URL.
 * Returns null for direct video files (use <video> tag instead).
 */
function getEmbedUrl(url: string): string | null {
  // YouTube: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?.*v=|embed\/)|youtu\.be\/)([\w-]+)/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;

  // Vimeo: vimeo.com/ID
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;

  return null;
}

const FALLBACK_SIZES = ["S", "M", "L", "XL", "XXL"];
const FALLBACK_COLORS: ProductColor[] = [
  { name: "Gray", hex: "#94a3b8" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Green", hex: "#22c55e" },
];

export default function ProductDetailClient({ product }: { product: ApiProduct }) {
  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : FALLBACK_SIZES;
  const colors = product.colors && product.colors.length > 0 ? product.colors : FALLBACK_COLORS;

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? "M");
  const [quantity, setQuantity] = useState(1);
  const { toggleItem, isInWishlist } = useWishlist();
  const wishlist = isInWishlist(product.id);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const currency = useCurrency();

  // Build the media gallery: main image first, then gallery images, then video.
  const galleryItems = useMemo<GalleryItem[]>(() => {
    const items: GalleryItem[] = [];
    const seen = new Set<string>();

    const pushImage = (url?: string | null) => {
      if (url && !seen.has(url)) {
        seen.add(url);
        items.push({ type: "image", url });
      }
    };

    pushImage(product.image ?? product.main_image);
    (product.gallery ?? []).forEach((img) => pushImage(img.url));

    if (product.video) {
      items.push({ type: "video", url: product.video });
    }

    return items;
  }, [product.image, product.main_image, product.gallery, product.video]);

  const firstImageIndex = galleryItems.findIndex((i) => i.type === "image");
  const [activeIndex, setActiveIndex] = useState(firstImageIndex >= 0 ? firstImageIndex : 0);
  const activeItem = galleryItems[activeIndex];

  const goPrev = () =>
    setActiveIndex((i) => (i - 1 + galleryItems.length) % galleryItems.length);
  const goNext = () =>
    setActiveIndex((i) => (i + 1) % galleryItems.length);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      size: selectedSize,
      color: colors[selectedColor]?.hex ?? "#000000",
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-10">

        {/* Left — Product Media Gallery */}
        <div className="lg:w-1/2">
          <div className="relative group bg-gray-100 dark:bg-gray-800 rounded aspect-square flex items-center justify-center overflow-hidden">
            {activeItem?.type === "video" ? (
              (() => {
                const embedUrl = getEmbedUrl(activeItem.url);
                return embedUrl ? (
                  <iframe
                    key={activeItem.url}
                    src={embedUrl}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                    style={{ border: 0 }}
                  />
                ) : (
                  <video
                    key={activeItem.url}
                    src={activeItem.url}
                    controls
                    autoPlay
                    className="w-full h-full object-contain bg-black"
                  />
                );
              })()
            ) : activeItem?.type === "image" ? (
              <Image
                src={activeItem.url}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-2/3 h-3/4 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                <span className="text-xs text-gray-400 dark:text-gray-500 text-center px-4">{product.name}</span>
              </div>
            )}

            {/* Prev / Next arrows */}
            {galleryItems.length > 1 && (
              <>
                <button
                  onClick={goPrev}
                  aria-label="Previous"
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur flex items-center justify-center text-gray-700 dark:text-gray-200 shadow hover:bg-white dark:hover:bg-gray-900 transition-opacity opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goNext}
                  aria-label="Next"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur flex items-center justify-center text-gray-700 dark:text-gray-200 shadow hover:bg-white dark:hover:bg-gray-900 transition-opacity opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Dots indicator */}
          {galleryItems.length > 1 && (
            <div className="flex justify-center gap-2 mt-3">
              {galleryItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Go to item ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === activeIndex
                      ? "w-5 bg-gray-900 dark:bg-white"
                      : "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Thumbnails */}
          {galleryItems.length > 1 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {galleryItems.map((item, i) => (
                <button
                  key={`${item.type}-${i}`}
                  onClick={() => setActiveIndex(i)}
                  className={`relative w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                    i === activeIndex
                      ? "border-gray-900 dark:border-white"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  aria-label={item.type === "video" ? "Play product video" : `View image ${i + 1}`}
                >
                  {item.type === "video" ? (
                    <span className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <Play className="w-5 h-5 text-white" fill="currentColor" />
                    </span>
                  ) : (
                    <Image src={item.url} alt="" fill sizes="64px" className="object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right — Product Info */}
        <div className="lg:w-1/2">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
            <button
              onClick={() => toggleItem({ id: product.id, slug: product.slug, name: product.name, price: Number(product.price), image: product.image })}
              className={`p-1 transition-colors ${wishlist ? "text-red-500" : "text-gray-300 hover:text-gray-500"}`}
            >
              <Heart className="w-5 h-5" fill={wishlist ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Brand */}
          {product.brand && (
            <p className="text-xs text-gray-400 mb-2">
              Brand:{" "}
              {product.brand.slug ? (
                <Link href={`/brands/${product.brand.slug}`} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline">
                  {product.brand.name}
                </Link>
              ) : (
                <span className="text-gray-600 dark:text-gray-300">{product.brand.name}</span>
              )}
            </p>
          )}

          {/* Rating + Stock */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`w-3.5 h-3.5 ${s <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
              ))}
              <span className="text-xs text-gray-400 ml-1">Reviews</span>
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${product.status ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}>
              {product.status ? "IN STOCK" : "OUT OF STOCK"}
            </span>
          </div>

          {/* Price */}
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
            {formatPrice(Number(product.price), currency)}
          </div>

          {/* Colors */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Available Colors</p>
            <div className="flex gap-2">
              {colors.map((color: ProductColor, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedColor(i)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${selectedColor === i ? "border-gray-900 scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name || undefined}
                />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Select Size</p>
            <div className="flex gap-2">
              {sizes.map((size: string) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-9 h-9 text-xs font-medium border rounded transition-all ${
                    selectedSize === size
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Quantity</p>
            <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 rounded w-fit px-3 py-2">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-gray-700">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-medium text-gray-900 dark:text-white w-6 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-gray-700">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={handleAddToCart}
              disabled={!product.status}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors rounded ${
                added
                  ? "bg-green-600 text-white"
                  : product.status
                  ? "bg-gray-900 text-white hover:bg-gray-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {added ? "Added to cart!" : product.status ? "Add to cart" : "Out of Stock"}
            </button>
            <button
              onClick={() => toggleItem({ id: product.id, slug: product.slug, name: product.name, price: Number(product.price), image: product.image })}
              className={`w-12 h-12 border rounded flex items-center justify-center transition-colors ${
                wishlist ? "border-red-300 text-red-500" : "border-gray-200 dark:border-gray-700 text-gray-400 hover:border-gray-400"
              }`}
            >
              <Heart className="w-4 h-4" fill={wishlist ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Go to Cart — shows after adding */}
          {added && (
            <Link href="/cart" className="block text-center text-sm text-gray-600 underline mb-3 hover:text-gray-900">
              View cart →
            </Link>
          )}

          {/* Free Shipping */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Truck className="w-4 h-4" />
            <span>FREE SHIPPING ON ORDERS {formatPrice(50, currency)}+</span>
          </div>
        </div>
      </div>

      {/* Details / Reviews Accordion */}
      <div className="mt-12 border-t border-gray-100 dark:border-gray-800">
        <div className="border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setDetailsOpen(!detailsOpen)}
            className="flex items-center justify-between w-full py-4 text-sm font-medium text-gray-900 dark:text-white"
          >
            <span>Details</span>
            {detailsOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          {detailsOpen && (
            <div className="pb-5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed space-y-1">
              {product.category && <p>Category: <span className="text-gray-700 dark:text-gray-300">{product.category.name}</span></p>}
              {product.brand && <p>Brand: <span className="text-gray-700 dark:text-gray-300">{product.brand.name}</span></p>}
              <p>Price: <span className="text-gray-700 dark:text-gray-300">{formatPrice(Number(product.price), currency)}</span></p>
            </div>
          )}
        </div>

        <div className="border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setReviewsOpen(!reviewsOpen)}
            className="flex items-center justify-between w-full py-4 text-sm font-medium text-gray-900 dark:text-white"
          >
            <span>Reviews</span>
            {reviewsOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          {reviewsOpen && <ProductReviews productId={product.id} />}
        </div>
      </div>
    </div>
  );
}
