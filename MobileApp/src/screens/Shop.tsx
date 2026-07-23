import { ReactNode, useEffect, useMemo, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { ActivityIndicator, FlatList, Modal, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { api, unwrap } from "../api";
import { Header } from "../components/Header";
import { ProductCard } from "../components/ProductCard";
import { useApp } from "../context/AppContext";
import { colors, styles } from "../styles";
import type { Brand, Category, Product } from "../types";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Name A-Z", value: "name_asc" },
];

function FilterSection({
  label,
  open,
  setOpen,
  children,
}: {
  label: string;
  open: boolean;
  setOpen: (v: boolean) => void;
  children: ReactNode;
}) {
  return (
    <View style={{ borderBottomWidth: 1, borderBottomColor: colors.mutedDark, paddingVertical: 12 }}>
      <Pressable onPress={() => setOpen(!open)} style={[styles.row, { justifyContent: "space-between" }]}>
        <Text style={{ fontSize: 13, fontWeight: "700", color: colors.text }}>{label}</Text>
        <Feather name={open ? "chevron-up" : "chevron-down"} size={16} color={colors.textLight} />
      </Pressable>
      {open && <View style={{ marginTop: 8 }}>{children}</View>}
    </View>
  );
}

export function Shop({
  back,
  initialCategoryId,
  initialBrandId,
  title,
}: {
  back: () => void;
  initialCategoryId?: number | null;
  initialBrandId?: number | null;
  title?: string;
}) {
  const { go, cartCount, products, setProducts, setSelectedProduct, toggleWishlist, wishlist, addToCart } = useApp();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(initialCategoryId ?? null);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(initialBrandId ?? null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(true);
  const [brandOpen, setBrandOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [pRes, cRes, bRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories?status=1"),
          api.get("/brands?status=1"),
        ]);
        if (!active) return;
        const prods = unwrap(pRes) as Product[];
        const catsRaw = unwrap(cRes);
        const brandsRaw = unwrap(bRes);
        const allProds = prods ?? [];
        setProducts(allProds);
        setMaxPrice(Math.max(5000, ...allProds.map((p) => Number(p.sale_price ?? p.price))));
        setCategories((Array.isArray(catsRaw) ? catsRaw : (catsRaw as { data?: Category[] })?.data) ?? []);
        setBrands((Array.isArray(brandsRaw) ? brandsRaw : (brandsRaw as { data?: Brand[] })?.data) ?? []);
      } catch {
        // ignore
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [setProducts]);

  const allMax = useMemo(() => Math.max(5000, ...products.map((p) => Number(p.sale_price ?? p.price))), [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search.trim()) {
      list = list.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()));
    }
    if (selectedCategory) list = list.filter((p) => p.category?.id === selectedCategory);
    if (selectedBrand) list = list.filter((p) => p.brand?.id === selectedBrand);
    list = list.filter((p) => Number(p.sale_price ?? p.price) <= maxPrice);
    switch (sort) {
      case "price_asc":
        list.sort((a, b) => Number(a.sale_price ?? a.price) - Number(b.sale_price ?? b.price));
        break;
      case "price_desc":
        list.sort((a, b) => Number(b.sale_price ?? b.price) - Number(a.sale_price ?? a.price));
        break;
      case "name_asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return list;
  }, [products, search, selectedCategory, selectedBrand, maxPrice, sort]);

  const activeFilters = [
    ...(selectedCategory
      ? [{ label: categories.find((c) => c.id === selectedCategory)?.name ?? "", onRemove: () => setSelectedCategory(null) }]
      : []),
    ...(selectedBrand
      ? [{ label: brands.find((b) => b.id === selectedBrand)?.name ?? "", onRemove: () => setSelectedBrand(null) }]
      : []),
  ];

  const select = (product: Product) => {
    setSelectedProduct(product);
    go("product");
  };

  const handleAddToCart = (product: Product) => {
    if (!product.status) return;
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory(null);
    setSelectedBrand(null);
    setMaxPrice(allMax);
  };

  return (
    <SafeAreaView style={styles.flex}>
      <Header title={title ?? "Shop"} back={back} go={go} cartCount={cartCount} />

      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, gap: 10 }}>
        <View style={[styles.row, { gap: 10 }]}>
          <Pressable
            onPress={() => setSidebarOpen(true)}
            style={{ borderWidth: 1, borderColor: colors.mutedDark, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, flexDirection: "row", alignItems: "center", gap: 6 }}
          >
            <Feather name="sliders" size={14} color={colors.text} />
            <Text style={{ fontSize: 13, color: colors.text }}>Filters</Text>
          </Pressable>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.mutedDark,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
          >
            <Feather name="search" size={16} color={colors.textLight} style={{ marginRight: 6 }} />
            <TextInput
              style={{ flex: 1, fontSize: 14, color: colors.text }}
              placeholder="Search products..."
              placeholderTextColor={colors.textLight}
              value={search}
              onChangeText={setSearch}
            />
            {search ? (
              <Pressable onPress={() => setSearch("")}>
                <Feather name="x" size={16} color={colors.textLight} />
              </Pressable>
            ) : null}
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={[styles.row, { gap: 8 }]}>
            {SORT_OPTIONS.map((o) => (
              <Pressable
                key={o.value}
                onPress={() => setSort(o.value)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  backgroundColor: sort === o.value ? colors.primary : colors.muted,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: sort === o.value ? "#fff" : colors.text,
                    fontWeight: sort === o.value ? "700" : "400",
                  }}
                >
                  {o.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {activeFilters.length > 0 && (
          <View style={[styles.row, { flexWrap: "wrap", gap: 8 }]}>
            <Text style={{ fontSize: 11, color: colors.textLight, alignSelf: "center" }}>Applied:</Text>
            {activeFilters.map((f, i) => (
              <View
                key={i}
                style={[
                  styles.row,
                  { backgroundColor: colors.muted, borderRadius: 16, paddingHorizontal: 10, paddingVertical: 4, gap: 4 },
                ]}
              >
                <Text style={{ fontSize: 11, color: colors.text }}>{f.label}</Text>
                <Pressable onPress={f.onRemove}>
                  <Feather name="x" size={12} color={colors.textLight} />
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </View>

      <Modal visible={sidebarOpen} transparent animationType="none" onRequestClose={() => setSidebarOpen(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }}>
          <Pressable style={{ flex: 1 }} onPress={() => setSidebarOpen(false)} />
          <View
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 280,
              backgroundColor: colors.background,
              padding: 20,
            }}
          >
            <View style={[styles.row, { justifyContent: "space-between", marginBottom: 16 }]}>
              <Text style={{ fontSize: 16, fontWeight: "700" }}>Filters</Text>
              <Pressable onPress={() => setSidebarOpen(false)}>
                <Feather name="x" size={20} color={colors.textLight} />
              </Pressable>
            </View>
            <ScrollView>
              <FilterSection label="Categories" open={catOpen} setOpen={setCatOpen}>
                <Pressable onPress={() => setSelectedCategory(null)} style={{ paddingVertical: 6 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: !selectedCategory ? colors.text : colors.textLight,
                      fontWeight: !selectedCategory ? "700" : "400",
                    }}
                  >
                    All
                  </Text>
                </Pressable>
                {categories.map((c) => (
                  <Pressable
                    key={c.id}
                    onPress={() => setSelectedCategory(selectedCategory === c.id ? null : c.id)}
                    style={{ paddingVertical: 6 }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        color: selectedCategory === c.id ? colors.text : colors.textLight,
                        fontWeight: selectedCategory === c.id ? "700" : "400",
                      }}
                    >
                      {c.name}
                    </Text>
                  </Pressable>
                ))}
              </FilterSection>
              <FilterSection label="Brands" open={brandOpen} setOpen={setBrandOpen}>
                <Pressable onPress={() => setSelectedBrand(null)} style={{ paddingVertical: 6 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: !selectedBrand ? colors.text : colors.textLight,
                      fontWeight: !selectedBrand ? "700" : "400",
                    }}
                  >
                    All
                  </Text>
                </Pressable>
                {brands.map((b) => (
                  <Pressable
                    key={b.id}
                    onPress={() => setSelectedBrand(selectedBrand === b.id ? null : b.id)}
                    style={{ paddingVertical: 6 }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        color: selectedBrand === b.id ? colors.text : colors.textLight,
                        fontWeight: selectedBrand === b.id ? "700" : "400",
                      }}
                    >
                      {b.name}
                    </Text>
                  </Pressable>
                ))}
              </FilterSection>
              <FilterSection label="Price" open={priceOpen} setOpen={setPriceOpen}>
                <Text style={{ fontSize: 12, color: colors.textLight, marginBottom: 8 }}>Max price: ₹{maxPrice}</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: colors.mutedDark,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    fontSize: 14,
                    color: colors.text,
                  }}
                  keyboardType="numeric"
                  value={String(maxPrice)}
                  onChangeText={(t) => setMaxPrice(Number(t) || 0)}
                />
                <Pressable onPress={() => setMaxPrice(allMax)} style={{ marginTop: 8 }}>
                  <Text style={{ fontSize: 12, color: colors.primary, textDecorationLine: "underline" }}>Reset price</Text>
                </Pressable>
              </FilterSection>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {loading ? (
        <ActivityIndicator style={{ margin: 24 }} />
      ) : (
        <FlatList
          data={filtered}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 28 }}
          keyExtractor={(item) => String(item.id)}
          ListHeaderComponent={
            <Text style={{ fontSize: 13, color: colors.textLight, marginBottom: 12 }}>
              Showing <Text style={{ color: colors.text, fontWeight: "700" }}>{filtered.length}</Text> products
            </Text>
          }
          ListEmptyComponent={
            <View style={{ alignItems: "center", paddingVertical: 40 }}>
              <Text style={{ fontSize: 32, marginBottom: 12 }}>🛍️</Text>
              <Text style={{ color: colors.textLight, marginBottom: 12 }}>No products found.</Text>
              <Pressable onPress={clearFilters}>
                <Text style={{ color: colors.primary, textDecorationLine: "underline" }}>Clear filters</Text>
              </Pressable>
            </View>
          }
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              onPress={() => select(item)}
              onWish={() => toggleWishlist(item)}
              wished={wishlist.some((w) => w.id === item.id)}
              onAddToCart={() => handleAddToCart(item)}
              added={addedId === item.id}
              variant="listing"
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
