import { Image, Pressable, Text, View } from "react-native";
import { assetUrl } from "../api";
import { styles } from "../styles";
import type { Product } from "../types";

export function ProductCard({
  item,
  onPress,
  onWish,
  wished,
}: {
  item: Product;
  onPress: () => void;
  onWish?: () => void;
  wished?: boolean;
}) {
  const image = assetUrl(item.image ?? item.main_image ?? item.images?.[0]);
  return (
    <Pressable style={styles.grid2Col} onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.cardImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
          ) : (
            <Text style={styles.placeholder}>Product</Text>
          )}
          {onWish && (
            <Pressable style={styles.heart} onPress={onWish}>
              <Text style={{ color: wished ? "#EF4444" : "#9CA3AF", fontSize: 16 }}>
                {wished ? "♥" : "♡"}
              </Text>
            </Pressable>
          )}
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.row}>
            <View style={styles.stockBadge}>
              <Text style={styles.stockBadgeText}>{item.status === false ? "Out of stock" : "In stock"}</Text>
            </View>
            <Text style={styles.cardPrice}>
              {`₹${Number(item.sale_price ?? item.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
