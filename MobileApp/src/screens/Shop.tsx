import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, SafeAreaView, Text, View } from "react-native";
import { api, unwrap } from "../api";
import { Header } from "../components/Header";
import { ProductCard } from "../components/ProductCard";
import { useApp } from "../context/AppContext";
import { styles } from "../styles";
import type { Brand, Category, Product } from "../types";

export function Shop({ back }: { back: () => void }) {
  const { go, cartCount, products, setProducts, setSelectedProduct, toggleWishlist, wishlist } = useApp();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
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
        setProducts(prods ?? []);
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

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory && p.category?.id !== selectedCategory) return false;
      if (selectedBrand && p.brand?.id !== selectedBrand) return false;
      return true;
    });
  }, [products, selectedCategory, selectedBrand]);

  const select = (product: Product) => {
    setSelectedProduct(product);
    go("product");
  };

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="Shop" back={back} go={go} cartCount={cartCount} />
      <View style={styles.content}>
        <Text style={styles.caption}>Categories</Text>
        <View style={[styles.row, { flexWrap: "wrap", marginBottom: 12 }]}>
          {categories.map((c) => (
            <Pressable
              key={c.id}
              style={[styles.chip, selectedCategory === c.id && styles.chipActive]}
              onPress={() => setSelectedCategory(selectedCategory === c.id ? null : c.id)}
            >
              <Text style={[styles.chipText, selectedCategory === c.id && styles.chipActiveText]}>{c.name}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.caption}>Brands</Text>
        <View style={[styles.row, { flexWrap: "wrap", marginBottom: 12 }]}>
          {brands.map((b) => (
            <Pressable
              key={b.id}
              style={[styles.chip, selectedBrand === b.id && styles.chipActive]}
              onPress={() => setSelectedBrand(selectedBrand === b.id ? null : b.id)}
            >
              <Text style={[styles.chipText, selectedBrand === b.id && styles.chipActiveText]}>{b.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
        <Pressable style={styles.secondaryButton} onPress={() => go("brands")}>
          <Text style={styles.secondaryButtonText}>Browse by Brand</Text>
        </Pressable>
      </View>
      {loading ? (
        <ActivityIndicator style={{ margin: 24 }} />
      ) : (
        <FlatList
          data={filtered}
          numColumns={2}
          contentContainerStyle={styles.grid}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={<Text style={{ textAlign: "center", margin: 24, color: "#6B7280" }}>No products found.</Text>}
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              onPress={() => select(item)}
              onWish={() => toggleWishlist(item)}
              wished={wishlist.some((w) => w.id === item.id)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
