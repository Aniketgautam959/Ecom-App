import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, SafeAreaView, Text, View } from "react-native";
import { api, unwrap } from "../api";
import { Header } from "../components/Header";
import { ProductCard } from "../components/ProductCard";
import { useApp } from "../context/AppContext";
import { styles } from "../styles";
import type { Product } from "../types";

export function BrandProducts({ back }: { back: () => void }) {
  const { go, cartCount, selectedBrand, setSelectedProduct, toggleWishlist, wishlist } = useApp();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedBrand) return;
    let active = true;
    api
      .get(`/products?brand_id=${selectedBrand.id}`)
      .then((res) => {
        if (active) setItems((unwrap(res) as Product[]) ?? []);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [selectedBrand]);

  const select = (product: Product) => {
    setSelectedProduct(product);
    go("product");
  };

  if (!selectedBrand) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No brand selected.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.flex}>
      <Header title={selectedBrand.name} back={back} go={go} cartCount={cartCount} />
      {loading ? (
        <ActivityIndicator style={{ margin: 24 }} />
      ) : (
        <FlatList
          data={items}
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
