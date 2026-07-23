import { useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { ActivityIndicator, FlatList, Pressable, SafeAreaView, Text, TextInput, View } from "react-native";
import { api, messageFrom, unwrap } from "../api";
import { Header } from "../components/Header";
import { ProductCard } from "../components/ProductCard";
import { useApp } from "../context/AppContext";
import { colors, styles } from "../styles";
import type { Product } from "../types";

let globalPrefill = "";

export function setSearchPrefill(value: string) {
  globalPrefill = value;
}

export function Search({ back }: { back: () => void }) {
  const { go, cartCount, setSelectedProduct, toggleWishlist, wishlist, addToCart } = useApp();
  const [query, setQuery] = useState(globalPrefill);
  const [items, setItems] = useState<Product[]>([]);
  const [busy, setBusy] = useState(false);
  const [addedId, setAddedId] = useState<number | null>(null);

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

  const handleAddToCart = (product: Product) => {
    if (!product.status) return;
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="Search" back={back} go={go} cartCount={cartCount} />
      <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
        <View
          style={[
            styles.row,
            {
              borderWidth: 1,
              borderColor: colors.mutedDark,
              borderRadius: 8,
              paddingHorizontal: 12,
              alignItems: "center",
            },
          ]}
        >
          <Feather name="search" size={18} color={colors.textLight} />
          <TextInput
            style={{ flex: 1, marginLeft: 8, fontSize: 14, color: colors.text }}
            value={query}
            placeholder="Search products..."
            placeholderTextColor={colors.textLight}
            onChangeText={setQuery}
            onSubmitEditing={() => find()}
          />
          {query ? (
            <Pressable onPress={() => { setQuery(""); setItems([]); }} style={{ marginRight: 8 }}>
              <Feather name="x" size={18} color={colors.textLight} />
            </Pressable>
          ) : null}
          <Pressable
            onPress={() => find()}
            style={{ backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 6 }}
          >
            <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>Search</Text>
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
          ListHeaderComponent={
            query ? (
              <Text style={{ fontSize: 13, color: colors.textLight, marginBottom: 12 }}>
                Found <Text style={{ color: colors.text, fontWeight: "700" }}>{items.length}</Text> result{items.length !== 1 ? "s" : ""} for "{query}"
              </Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={{ alignItems: "center", paddingVertical: 40 }}>
              <Feather name="search" size={48} color={colors.mutedDark} style={{ marginBottom: 16 }} />
              <Text style={{ color: colors.textLight, marginBottom: 12, textAlign: "center" }}>
                {query ? `No products found for "${query}".` : "Enter a keyword to search."}
              </Text>
              {query ? (
                <Pressable onPress={() => go("shop")}>
                  <Text style={{ color: colors.primary, textDecorationLine: "underline" }}>Browse all products</Text>
                </Pressable>
              ) : null}
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
