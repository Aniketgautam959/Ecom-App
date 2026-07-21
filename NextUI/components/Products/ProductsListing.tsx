"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCurrency, formatPrice } from "@/context/CurrencyContext";

interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  status: boolean;
  category: { id: number; name: string } | null;
  brand: { id: number; name: string } | null;
}

interface Category { id: number; name: string; slug: string; }
interface Brand { id: number; name: string; slug: string; }

interface Props {
  initialProducts: ApiProduct[];
  categories: Category[];
  brands: Brand[];
}

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Name A-Z", value: "name_asc" },
];

interface SidebarProps {
  categories: Category[];
  brands: Brand[];
  selectedCategory: number | null;
  setSelectedCategory: (id: number | null) => void;
  selectedBrand: number | null;
  setSelectedBrand: (id: number | null) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  allMax: number;
  catOpen: boolean;
  setCatOpen: (open: boolean) => void;
  brandOpen: boolean;
  setBrandOpen: (open: boolean) => void;
  priceOpen: boolean;
  setPriceOpen: (open: boolean) => void;
}

function Sidebar({
  categories,
  brands,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  maxPrice,
  setMaxPrice,
  allMax,
  catOpen,
  setCatOpen,
  brandOpen,
  setBrandOpen,
  priceOpen,
  setPriceOpen,
}: SidebarProps) {
  const currency = useCurrency();

  return (
    <aside className="w-full">
      {/* Categories */}
      <div className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
        <button onClick={() => setCatOpen(!catOpen)} className="flex items-center justify-between w-full mb-3 text-sm font-semibold text-gray-900 dark:text-white">
          Categories
          {catOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {catOpen && (
          <div className="space-y-1.5">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`block w-full text-left text-sm px-2 py-1 rounded transition-colors ${!selectedCategory ? "text-gray-900 dark:text-white font-medium bg-gray-100 dark:bg-gray-800" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`block w-full text-left text-sm px-2 py-1 rounded transition-colors ${selectedCategory === cat.id ? "text-gray-900 dark:text-white font-medium bg-gray-100 dark:bg-gray-800" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div className="border-b border-gray-100 pb-4 mb-4">
          <button onClick={() => setBrandOpen(!brandOpen)} className="flex items-center justify-between w-full mb-3 text-sm font-semibold text-gray-900 dark:text-white">
            Brand
            {brandOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          {brandOpen && (
            <div className="space-y-1.5">
              <button
                onClick={() => setSelectedBrand(null)}
                className={`block w-full text-left text-sm px-2 py-1 rounded transition-colors ${!selectedBrand ? "text-gray-900 dark:text-white font-medium bg-gray-100 dark:bg-gray-800" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
              >
                All
              </button>
              {brands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => setSelectedBrand(selectedBrand === brand.id ? null : brand.id)}
                  className={`block w-full text-left text-sm px-2 py-1 rounded transition-colors ${selectedBrand === brand.id ? "text-gray-900 dark:text-white font-medium bg-gray-100 dark:bg-gray-800" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
                >
                  {brand.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Price Range */}
      <div className="mb-4">
        <button onClick={() => setPriceOpen(!priceOpen)} className="flex items-center justify-between w-full mb-3 text-sm font-semibold text-gray-900 dark:text-white">
          Price
          {priceOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {priceOpen && (
          <div>
            <input
              type="range" min={0} max={allMax} step={10} value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-gray-900"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>{formatPrice(0, currency)}</span>
              <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(maxPrice, currency)}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default function ProductsListing({ initialProducts, categories, brands }: Props) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [sort, setSort] = useState("newest");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(true);
  const [brandOpen, setBrandOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const currency = useCurrency();
  const [addedId, setAddedId] = useState<number | null>(null);

  const allMax = useMemo(() =>
    Math.max(5000, ...initialProducts.map((p) => Number(p.price))),
    [initialProducts]
  );

  const filtered = useMemo(() => {
    let list = [...initialProducts];
    if (search.trim()) {
      list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (selectedCategory) list = list.filter((p) => p.category?.id === selectedCategory);
    if (selectedBrand) list = list.filter((p) => p.brand?.id === selectedBrand);
    list = list.filter((p) => Number(p.price) <= maxPrice);

    switch (sort) {
      case "price_asc":  list.sort((a, b) => Number(a.price) - Number(b.price)); break;
      case "price_desc": list.sort((a, b) => Number(b.price) - Number(a.price)); break;
      case "name_asc":   list.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
  }, [initialProducts, search, selectedCategory, selectedBrand, sort, maxPrice]);

  const activeFilters = [
    ...(selectedCategory ? [{ label: categories.find((c) => c.id === selectedCategory)?.name ?? "", onRemove: () => setSelectedCategory(null) }] : []),
    ...(selectedBrand ? [{ label: brands.find((b) => b.id === selectedBrand)?.name ?? "", onRemove: () => setSelectedBrand(null) }] : []),
  ];

  const handleAddToCart = (product: ApiProduct) => {
    addItem({ id: product.id, slug: product.slug, name: product.name, price: Number(product.price), image: product.image, size: "M", color: "#94a3b8" });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const sidebarProps: SidebarProps = {
    categories,
    brands,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    maxPrice,
    setMaxPrice,
    allMax,
    catOpen,
    setCatOpen,
    brandOpen,
    setBrandOpen,
    priceOpen,
    setPriceOpen,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Mobile filter toggle + search bar row */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900"
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>

        <div className="flex-1 flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text" placeholder="Search products..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 outline-none w-full bg-transparent"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-700">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <select
            value={sort} onChange={(e) => setSort(e.target.value)}
            className="border border-gray-200 dark:border-gray-700 rounded px-3 py-2 text-sm text-gray-700 dark:text-gray-200 outline-none bg-white dark:bg-gray-900"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="text-xs text-gray-500 self-center">Applied Filters:</span>
          {activeFilters.map((f, i) => (
            <span key={i} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
              {f.label}
              <button onClick={f.onRemove} className="ml-1 text-gray-400 hover:text-gray-700"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-8">
        {/* Sidebar — Desktop */}
        <div className="hidden lg:block w-52 flex-shrink-0">
          <Sidebar {...sidebarProps} />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
            <div className="relative bg-white dark:bg-gray-950 w-64 h-full shadow-xl p-5 overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <span className="font-semibold text-gray-900">Filters</span>
                <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
              </div>
              <Sidebar {...sidebarProps} />
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-4">
            Showing <span className="text-gray-700 font-medium">{filtered.length}</span> products
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center gap-3">
              <ShoppingBag className="w-12 h-12 text-gray-200" />
              <p className="text-gray-400">No products found.</p>
              <button
                onClick={() => { setSearch(""); setSelectedCategory(null); setSelectedBrand(null); setMaxPrice(allMax); }}
                className="text-sm text-gray-900 underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((product) => (
                <div key={product.id} className="group relative">
                  {/* Image box */}
                  <Link href={`/products/${product.slug}`} className="block">
                    <div className="relative bg-gray-100 dark:bg-gray-800 rounded overflow-hidden aspect-[3/4]">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-10 h-10 text-gray-300" />
                        </div>
                      )}
                      {/* Status badge */}
                      {!product.status && (
                        <span className="absolute top-2 left-2 bg-gray-900 text-white text-xs px-2 py-0.5 rounded">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Wishlist */}
                  <button
                    onClick={(e) => { e.preventDefault(); toggleItem({ id: product.id, slug: product.slug, name: product.name, price: Number(product.price), image: product.image }); }}
                    className={`absolute top-2 right-2 w-7 h-7 rounded-full shadow flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ${
                      isInWishlist(product.id)
                        ? "bg-red-500 text-white opacity-100"
                        : "bg-white dark:bg-gray-800 text-gray-500"
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5" fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                  </button>

                  {/* Info */}
                  <div className="mt-3">
                    <Link href={`/products/${product.slug}`}>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{product.brand?.name ?? product.category?.name ?? ""}</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white leading-snug line-clamp-2 hover:underline">{product.name}</p>
                    </Link>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{formatPrice(Number(product.price), currency)}</span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.status}
                        className={`text-xs px-2.5 py-1 rounded transition-colors ${
                          addedId === product.id
                            ? "bg-green-600 text-white"
                            : product.status
                            ? "bg-gray-900 text-white hover:bg-gray-700"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {addedId === product.id ? "Added!" : "+ Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
