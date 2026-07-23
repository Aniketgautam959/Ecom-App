import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo, useState } from "react";
import { Alert, Image, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { api, assetUrl } from "../api";
import { Header } from "../components/Header";
import { ProductCard } from "../components/ProductCard";
import { ProductReviews } from "../components/ProductReviews";
import { useApp } from "../context/AppContext";
import { colors, money, spacing, styles } from "../styles";

type GalleryItem =
  | { type: "image"; url: string }
  | { type: "video"; url: string };

const FALLBACK_SIZES = ["S", "M", "L", "XL", "XXL"];
const FALLBACK_COLORS = [
  { name: "Gray", hex: "#94a3b8" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Green", hex: "#22c55e" },
];

export function ProductDetail({ back }: { back: () => void }) {
  const {
    go,
    cartCount,
    selectedProduct: product,
    addToCart,
    toggleWishlist,
    wishlist,
    latest,
    setSelectedProduct,
  } = useApp();

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.sizes?.[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [reviewsOpen, setReviewsOpen] = useState(false);

  if (!product) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No product selected.</Text>
      </SafeAreaView>
    );
  }

  const sizes =
    product.sizes && product.sizes.length > 0 ? product.sizes : FALLBACK_SIZES;
  const colorsData =
    product.colors && product.colors.length > 0
      ? product.colors
      : FALLBACK_COLORS;

  const galleryItems = useMemo<GalleryItem[]>(() => {
    const items: GalleryItem[] = [];
    const seen = new Set<string>();
    const push = (url?: string | null) => {
      if (url && !seen.has(url)) {
        seen.add(url);
        items.push({ type: "image", url });
      }
    };
    push(product.image ?? product.main_image);
    (product.gallery ?? []).forEach((g) => push(g.url));
    if (product.video) items.push({ type: "video", url: product.video });
    return items;
  }, [product.image, product.main_image, product.gallery, product.video]);

  const firstImageIndex = galleryItems.findIndex((i) => i.type === "image");
  const [activeIndex, setActiveIndex] = useState(
    firstImageIndex >= 0 ? firstImageIndex : 0
  );
  const activeItem = galleryItems[activeIndex];

  const wished = wishlist.some((w) => w.id === product.id);
  const related = latest.filter((p) => p.id !== product.id).slice(0, 4);

  const handleAddToCart = async () => {
    if (!product.status) return;
    const selectedColor = colorsData[selectedColorIndex]?.hex ?? "#000000";
    setAdding(true);
    addToCart(product, quantity, selectedSize, selectedColor);
    try {
      await api.post("/cart", {
        product_id: product.id,
        quantity,
        size: selectedSize ?? "",
        color: selectedColor,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      Alert.alert("Cart", "Could not add to cart. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Header title="Product" back={back} go={go} cartCount={cartCount} />
      <ScrollView>
        {/* Media gallery */}
        <View
          style={{
            aspectRatio: 1,
            backgroundColor: colors.muted,
            position: "relative",
          }}
        >
          {activeItem?.type === "image" ? (
            <Image
              source={{ uri: assetUrl(activeItem.url) }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.center, { backgroundColor: colors.muted }]}>
              <Text style={styles.placeholder}>{product.name}</Text>
            </View>
          )}
          {galleryItems.length > 1 && (
            <View
              style={{
                position: "absolute",
                bottom: 12,
                left: 0,
                right: 0,
                flexDirection: "row",
                justifyContent: "center",
                gap: 6,
              }}
            >
              {galleryItems.map((_, i) => (
                <Pressable
                  key={i}
                  onPress={() => setActiveIndex(i)}
                  style={{
                    height: 8,
                    borderRadius: 4,
                    width: activeIndex === i ? 20 : 8,
                    backgroundColor:
                      activeIndex === i ? colors.primary : colors.mutedDark,
                  }}
                />
              ))}
            </View>
          )}
        </View>

        {/* Info */}
        <View style={{ padding: spacing.lg }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: spacing.xs,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: colors.text,
                flex: 1,
              }}
            >
              {product.name}
            </Text>
            <Pressable onPress={() => toggleWishlist(product)} style={{ padding: 4 }}>
              <Ionicons
                name={wished ? "heart" : "heart-outline"}
                size={22}
                color={wished ? colors.error : colors.textLight}
              />
            </Pressable>
          </View>

          {product.brand && (
            <Text
              style={{
                fontSize: 12,
                color: colors.textLight,
                marginBottom: spacing.sm,
              }}
            >
              Brand: {product.brand.name}
            </Text>
          )}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.sm,
              marginBottom: spacing.md,
              flexWrap: "wrap",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Ionicons
                  key={s}
                  name={s <= 4 ? "star" : "star-outline"}
                  size={14}
                  color="#FACC15"
                  style={{ marginRight: 2 }}
                />
              ))}
            </View>
            <Text style={{ fontSize: 12, color: colors.textLight }}>Reviews</Text>
            <View
              style={{
                backgroundColor: product.status
                  ? colors.successLight
                  : "#FEF2F2",
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "700",
                  color: product.status ? colors.success : colors.error,
                }}
              >
                {product.status ? "IN STOCK" : "OUT OF STOCK"}
              </Text>
            </View>
          </View>

          <Text
            style={{
              fontSize: 26,
              fontWeight: "700",
              color: colors.text,
              marginBottom: spacing.md,
            }}
          >
            {money(product.sale_price ?? product.price)}
          </Text>

          {/* Colors */}
          <View style={{ marginBottom: spacing.md }}>
            <Text
              style={{
                fontSize: 11,
                fontWeight: "700",
                color: colors.textLight,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: spacing.sm,
              }}
            >
              Available Colors
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {colorsData.map((c, i) => (
                <Pressable
                  key={i}
                  onPress={() => setSelectedColorIndex(i)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: c.hex,
                    borderWidth: selectedColorIndex === i ? 2 : 0,
                    borderColor: colors.text,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {selectedColorIndex === i && (
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        borderWidth: 2,
                        borderColor: "#fff",
                      }}
                    />
                  )}
                </Pressable>
              ))}
            </View>
          </View>

          {/* Sizes */}
          <View style={{ marginBottom: spacing.md }}>
            <Text
              style={{
                fontSize: 11,
                fontWeight: "700",
                color: colors.textLight,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: spacing.sm,
              }}
            >
              Select Size
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {sizes.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setSelectedSize(s)}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor:
                      selectedSize === s ? colors.primary : colors.mutedDark,
                    backgroundColor:
                      selectedSize === s ? colors.primary : colors.background,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: selectedSize === s ? "#fff" : colors.text,
                    }}
                  >
                    {s}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Quantity */}
          <View style={{ marginBottom: spacing.md }}>
            <Text
              style={{
                fontSize: 11,
                fontWeight: "700",
                color: colors.textLight,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: spacing.sm,
              }}
            >
              Quantity
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.mutedDark,
                borderRadius: 6,
                paddingHorizontal: spacing.sm,
                alignSelf: "flex-start",
              }}
            >
              <Pressable
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{ padding: spacing.sm }}
              >
                <Feather name="minus" size={14} color={colors.textLight} />
              </Pressable>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.text,
                  width: 30,
                  textAlign: "center",
                }}
              >
                {quantity}
              </Text>
              <Pressable
                onPress={() => setQuantity((q) => q + 1)}
                style={{ padding: spacing.sm }}
              >
                <Feather name="plus" size={14} color={colors.textLight} />
              </Pressable>
            </View>
          </View>

          {/* Add to cart */}
          <View
            style={{
              flexDirection: "row",
              gap: spacing.md,
              marginBottom: spacing.md,
            }}
          >
            <Pressable
              onPress={handleAddToCart}
              disabled={!product.status || adding}
              style={{
                flex: 1,
                backgroundColor: added
                  ? colors.success
                  : product.status
                  ? colors.primary
                  : colors.mutedDark,
                paddingVertical: spacing.md,
                borderRadius: 6,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: spacing.sm,
                opacity: adding ? 0.7 : 1,
              }}
            >
              <Feather
                name="shopping-cart"
                size={16}
                color={added || product.status ? "#fff" : colors.textLight}
              />
              <Text
                style={{
                  color: added || product.status ? "#fff" : colors.textLight,
                  fontSize: 14,
                  fontWeight: "700",
                }}
              >
                {added
                  ? "Added to cart!"
                  : product.status
                  ? "Add to cart"
                  : "Out of Stock"}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => toggleWishlist(product)}
              style={{
                width: 48,
                height: 48,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: wished ? colors.error : colors.mutedDark,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={wished ? "heart" : "heart-outline"}
                size={18}
                color={wished ? colors.error : colors.textLight}
              />
            </Pressable>
          </View>

          {added && (
            <Pressable
              onPress={() => go("cart")}
              style={{ marginBottom: spacing.sm }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: colors.textMuted,
                  textAlign: "center",
                  textDecorationLine: "underline",
                }}
              >
                View cart →
              </Text>
            </Pressable>
          )}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.sm,
              marginBottom: spacing.lg,
            }}
          >
            <Feather name="truck" size={16} color={colors.textLight} />
            <Text style={{ fontSize: 12, color: colors.textMuted }}>
              FREE SHIPPING ON ORDERS {money(50)}+
            </Text>
          </View>

          {/* Details */}
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: colors.muted,
              borderBottomWidth: 1,
              borderBottomColor: colors.muted,
            }}
          >
            <Pressable
              onPress={() => setDetailsOpen(!detailsOpen)}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: spacing.md,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.text,
                }}
              >
                Details
              </Text>
              <Feather
                name={detailsOpen ? "chevron-up" : "chevron-down"}
                size={18}
                color={colors.textLight}
              />
            </Pressable>
            {detailsOpen && (
              <View style={{ paddingBottom: spacing.md, gap: spacing.xs }}>
                {product.category && (
                  <Text style={{ fontSize: 13, color: colors.textMuted }}>
                    Category:{" "}
                    <Text style={{ color: colors.text }}>
                      {product.category.name}
                    </Text>
                  </Text>
                )}
                {product.brand && (
                  <Text style={{ fontSize: 13, color: colors.textMuted }}>
                    Brand:{" "}
                    <Text style={{ color: colors.text }}>
                      {product.brand.name}
                    </Text>
                  </Text>
                )}
                <Text style={{ fontSize: 13, color: colors.textMuted }}>
                  Price:{" "}
                  <Text style={{ color: colors.text }}>
                    {money(product.sale_price ?? product.price)}
                  </Text>
                </Text>
              </View>
            )}
          </View>

          {/* Reviews */}
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: colors.muted,
              marginBottom: spacing.lg,
            }}
          >
            <Pressable
              onPress={() => setReviewsOpen(!reviewsOpen)}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: spacing.md,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.text,
                }}
              >
                Reviews
              </Text>
              <Feather
                name={reviewsOpen ? "chevron-up" : "chevron-down"}
                size={18}
                color={colors.textLight}
              />
            </Pressable>
            {reviewsOpen && <ProductReviews productId={product.id} />}
          </View>

          {/* Similar products */}
          {related.length > 0 && (
            <View>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "700",
                  color: colors.textLight,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: spacing.xs,
                }}
              >
                SIMILAR PRODUCTS
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: colors.text,
                  marginBottom: spacing.md,
                }}
              >
                You might also like
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {related.map((item) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    onPress={() => {
                      setSelectedProduct(item);
                      go("product");
                    }}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
