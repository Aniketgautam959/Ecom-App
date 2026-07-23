import { useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { ActivityIndicator, Alert, FlatList, Image, Pressable, SafeAreaView, Text, View } from "react-native";
import { api, assetUrl, unwrap } from "../api";
import { Header } from "../components/Header";
import { Nav } from "../components/Nav";
import { useApp } from "../context/AppContext";
import { colors, money, styles } from "../styles";
import type { Product } from "../types";

export function Wishlist({ back }: { back: () => void }) {
  const { go, cartCount, user, wishlist, setWishlist, addToCart, toggleWishlist } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api
      .get("/wishlist")
      .then((res) => setWishlist((unwrap(res) as Product[]) ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, setWishlist]);

  const add = (product: Product) => {
    addToCart(product, 1);
    Alert.alert("Cart", "Added to cart");
  };

  const remove = async (product: Product) => {
    toggleWishlist(product);
    if (user) {
      try {
        await api.delete(`/wishlist/${product.id}`);
      } catch {
        Alert.alert("Wishlist", "Could not remove item.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="My Wishlist" back={back} go={go} cartCount={cartCount} />
      {loading ? (
        <ActivityIndicator style={{ margin: 24 }} />
      ) : (
        <FlatList
          data={wishlist}
          numColumns={2}
          contentContainerStyle={styles.grid}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={
            <View style={{ alignItems: "center", paddingVertical: 60 }}>
              <Feather name="heart" size={48} color={colors.mutedDark} style={{ marginBottom: 16 }} />
              <Text style={{ fontSize: 16, fontWeight: "500", color: colors.text, marginBottom: 4 }}>Your wishlist is empty</Text>
              <Text style={{ fontSize: 13, color: colors.textLight, marginBottom: 16, textAlign: "center" }}>Save items you love and find them here anytime.</Text>
              <Pressable style={styles.primaryButton} onPress={() => go("shop")}>
                <Text style={styles.primaryButtonText}>Explore Products</Text>
              </Pressable>
            </View>
          }
          renderItem={({ item }) => {
            const image = assetUrl(item.image ?? item.main_image ?? item.images?.[0]);
            return (
              <View style={styles.grid2Col}>
                <View style={styles.card}>
                  <Pressable
                    style={styles.cardImage}
                    onPress={() => {
                      // setSelectedProduct(item); go('product');
                    }}
                  >
                    {image ? (
                      <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
                    ) : (
                      <Feather name="package" size={40} color={colors.textLight} />
                    )}
                  </Pressable>
                  <View style={styles.cardBody}>
                    <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.cardPrice}>{money(item.sale_price ?? item.price)}</Text>
                    <View style={[styles.row, styles.gapSm, { marginTop: 8 }]}>
                      <Pressable style={[styles.primaryButton, { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }]} onPress={() => add(item)}>
                        <Feather name="shopping-bag" size={14} color="#fff" />
                        <Text style={styles.primaryButtonText}>Add to Cart</Text>
                      </Pressable>
                      <Pressable style={[styles.secondaryButton, { paddingHorizontal: 10, alignItems: "center", justifyContent: "center" }]} onPress={() => remove(item)}>
                        <Feather name="trash-2" size={18} color={colors.error} />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}
      <Nav go={go} active="wishlist" />
    </SafeAreaView>
  );
}
