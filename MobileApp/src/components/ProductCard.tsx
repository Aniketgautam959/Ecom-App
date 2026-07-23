import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, Pressable, Text, View } from "react-native";
import { assetUrl } from "../api";
import { colors, money, styles } from "../styles";
import type { Product } from "../types";

export function ProductCard({
  item,
  onPress,
  onWish,
  wished,
  onAddToCart,
  added,
  variant = "home",
}: {
  item: Product;
  onPress: () => void;
  onWish?: () => void;
  wished?: boolean;
  onAddToCart?: () => void;
  added?: boolean;
  variant?: "home" | "listing";
}) {
  const image = assetUrl(item.image ?? item.main_image ?? item.images?.[0]);
  const brand = item.brand?.name ?? item.category?.name ?? "";
  const isListing = variant === "listing";
  const inStock = item.status !== false;

  return (
    <Pressable style={styles.grid2Col} onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.cardImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={[styles.center, { width: "100%", height: "100%" }]}>
              {isListing ? (
                <Feather name="shopping-bag" size={32} color={colors.textLight} />
              ) : (
                <Text style={styles.placeholder}>{item.name}</Text>
              )}
            </View>
          )}
          {!inStock && isListing && (
            <View
              style={{
                position: "absolute",
                top: 8,
                left: 8,
                backgroundColor: colors.primary,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 2,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 10 }}>Out of Stock</Text>
            </View>
          )}
          {isListing && onWish && (
            <Pressable style={styles.heart} onPress={onWish}>
              <Ionicons
                name={wished ? "heart" : "heart-outline"}
                size={16}
                color={wished ? colors.error : colors.textLight}
              />
            </Pressable>
          )}
        </View>
        <View style={styles.cardBody}>
          {isListing && brand ? (
            <Text style={{ fontSize: 11, color: colors.textLight, marginBottom: 2 }}>{brand}</Text>
          ) : null}
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={[styles.row, { justifyContent: "space-between", alignItems: "center", marginTop: 8 }]}>
            <Text style={[styles.cardPrice, { fontWeight: "700" }]}>
              {money(item.sale_price ?? item.price)}
            </Text>
            {isListing && onAddToCart ? (
              <Pressable
                onPress={onAddToCart}
                disabled={!inStock}
                style={{
                  backgroundColor: added ? colors.success : inStock ? colors.primary : colors.muted,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: added || inStock ? "#fff" : colors.textLight, fontSize: 11, fontWeight: "700" }}>
                  {added ? "Added!" : "+ Cart"}
                </Text>
              </Pressable>
            ) : (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: colors.mutedDark,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                }}
              >
                <Text style={{ fontSize: 10, color: colors.text }}>
                  {inStock ? "IN STOCK" : "OUT OF STOCK"}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
