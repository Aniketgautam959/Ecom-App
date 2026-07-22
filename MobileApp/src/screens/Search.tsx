import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, SafeAreaView, Text, TextInput, View } from "react-native";
import { api, messageFrom, unwrap } from "../api";
import { Header } from "../components/Header";
import { ProductCard } from "../components/ProductCard";
import { useApp } from "../context/AppContext";
import { styles } from "../styles";
import type { Product } from "../types";

let globalPrefill = "";

export function setSearchPrefill(value: string) {
  globalPrefill = value;
}

export function Search({ back }: { back: () => void }) {
  const { go, cartCount, setSelectedProduct, toggleWishlist, wishlist } = useApp();
  const [query, setQuery] = useState(globalPrefill);
  const [items, setItems] = useState<Product[]>([]);
  const [busy, setBusy] = useState(false);

  const find = async (value = query) => {
    if (!value.trim()) {
      setItems([]);
      return;
    }
    setBusy(true);
    try {
      const res = await api.get("/products/search", { params: { q: value } });
      const data = unwrap(res);
      const list = (Array.isArray(data) ? data : (data as { data?: Product[] })?.data) ?? [];
      setItems(list as Product[]);
    } catch (err) {
      alert(messageFrom(err));
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (query) find(query);
  }, []);

  const select = (product: Product) => {
    setSelectedProduct(product);
    go("product");
  };

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="Search" back={back} go={go} cartCount={cartCount} />
      <View style={styles.form}>
        <View style={[styles.row, styles.input]}>
          <TextInput
            style={styles.flex}
            value={query}
            placeholder="Search products..."
            onChangeText={setQuery}
            onSubmitEditing={() => find()}
          />
          <Pressable onPress={() => find()}>
            <Text style={{ color: "#6B7280" }}>Search</Text>
          </Pressable>
        </View>
      </View>
      {busy ? (
        <ActivityIndicator style={{ margin: 24 }} />
      ) : (
        <FlatList
          data={items}
          numColumns={2}
          contentContainerStyle={styles.grid}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", margin: 24, color: "#6B7280" }}>
              {query ? "No products found." : "Enter a keyword to search."}
            </Text>
          }
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
