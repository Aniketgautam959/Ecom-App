import { useState } from "react";
import { Alert, Image, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { api, assetUrl } from "../api";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { colors, money, styles } from "../styles";

export function ProductDetail({ back }: { back: () => void }) {
  const { go, cartCount, selectedProduct: product, addToCart, toggleWishlist, wishlist } = useApp();
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product?.sizes?.[0]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product?.colors?.[0]?.hex);
  const [adding, setAdding] = useState(false);

  if (!product) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No product selected.</Text>
      </SafeAreaView>
    );
  }

  const image = assetUrl(product.image ?? product.main_image ?? product.images?.[0]);
  const wished = wishlist.some((w) => w.id === product.id);

  const add = async () => {
    setAdding(true);
    addToCart(product, 1, selectedSize, selectedColor);
    try {
      await api.post("/cart", {
        product_id: product.id,
        quantity: 1,
        size: selectedSize ?? "",
        color: selectedColor ?? "",
      });
    } catch {
      // local state already updated
    } finally {
      setAdding(false);
      Alert.alert("Cart", "Added to cart");
    }
  };

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="Product" back={back} go={go} cartCount={cartCount} />
      <ScrollView>
        <View style={{ height: 320, backgroundColor: colors.muted }}>
          {image ? <Image source={{ uri: image }} style={styles.image} resizeMode="cover" /> : <Text style={styles.placeholder}>Product image</Text>}
        </View>
        <View style={styles.form}>
          <Text style={styles.cardMuted}>{product.category?.name ?? "Featured"}</Text>
          <Text style={styles.heading}>{product.name}</Text>
          <Text style={[styles.heading, { marginTop: -8 }]}>{money(product.sale_price ?? product.price)}</Text>
          <Text style={styles.body}>{product.short_description ?? "Quality products selected especially for you."}</Text>

          {product.sizes && product.sizes.length > 0 && (
            <>
              <Text style={styles.inputLabel}>Size</Text>
              <View style={[styles.row, { flexWrap: "wrap" }]}>
                {product.sizes.map((s) => (
                  <Pressable
                    key={s}
                    style={[styles.chip, selectedSize === s && styles.chipActive]}
                    onPress={() => setSelectedSize(s)}
                  >
                    <Text style={[styles.chipText, selectedSize === s && styles.chipActiveText]}>{s}</Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}

          {product.colors && product.colors.length > 0 && (
            <>
              <Text style={styles.inputLabel}>Color</Text>
              <View style={[styles.row, { flexWrap: "wrap" }]}>
                {product.colors.map((c) => (
                  <Pressable
                    key={c.hex}
                    style={[
                      { width: 32, height: 32, borderRadius: 16, marginRight: 8, marginBottom: 8, borderWidth: selectedColor === c.hex ? 2 : 0, borderColor: colors.text },
                      { backgroundColor: c.hex },
                    ]}
                    onPress={() => setSelectedColor(c.hex)}
                  />
                ))}
              </View>
            </>
          )}

          <View style={[styles.row, styles.gapMd, { marginTop: 8 }]}>
            <Pressable
              style={[styles.secondaryButton, styles.flex]}
              onPress={() => toggleWishlist(product)}
            >
              <Text style={styles.secondaryButtonText}>{wished ? "♥ Saved" : "♡ Wishlist"}</Text>
            </Pressable>
            <Pressable style={[styles.primaryButton, styles.flex]} onPress={add} disabled={adding}>
              <Text style={styles.primaryButtonText}>{adding ? "Adding..." : "Add to cart"}</Text>
            </Pressable>
          </View>

          {product.description && (
            <View style={{ marginTop: 24 }}>
              <Text style={styles.subheading}>Description</Text>
              <Text style={styles.body}>{product.description}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
