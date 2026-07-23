import Feather from "@expo/vector-icons/Feather";
import { Image, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { api, assetUrl } from "../api";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { colors, money, spacing, styles } from "../styles";
import type { CartItem } from "../types";

export function Cart({ back }: { back: () => void }) {
  const { go, cartCount, cart, updateCartQuantity, removeFromCart, cartTotal, user } = useApp();

  const shipping = 0;
  const tax = parseFloat((cartTotal * 0.03).toFixed(2));
  const total = cartTotal + shipping + tax;

  const changeQuantity = async (item: CartItem, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(item.id, item.size, item.color);
      if (user) {
        await api.delete(`/cart/${item.id}`, { data: { size: item.size ?? "", color: item.color ?? "" } }).catch(() => undefined);
      }
      return;
    }
    updateCartQuantity(item.id, quantity, item.size, item.color);
    if (user) {
      await api.put(`/cart/${item.id}`, { quantity, size: item.size ?? "", color: item.color ?? "" }).catch(() => undefined);
    }
  };

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="Cart" back={back} go={go} cartCount={cartCount} />
      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
        {/* Promo Banner */}
        <View style={{ backgroundColor: colors.primary, paddingVertical: 8, paddingHorizontal: spacing.lg }}>
          <Text style={{ color: "#fff", fontSize: 11, textAlign: "center" }}>
            Get 25% OFF on your first order.{" "}
            <Text style={{ textDecorationLine: "underline", fontWeight: "700" }} onPress={() => go("shop")}>
              Order Now
            </Text>
          </Text>
        </View>

        {/* Page Header */}
        <View style={{ backgroundColor: colors.muted, paddingHorizontal: spacing.lg, paddingVertical: spacing.xl }}>
          <Text style={{ fontSize: 22, fontWeight: "800", color: colors.text, marginBottom: spacing.xs }}>Cart</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Pressable onPress={() => go("home")}>
              <Text style={{ fontSize: 13, color: colors.textLight }}>Ecommerce</Text>
            </Pressable>
            <Text style={{ fontSize: 13, color: colors.textLight, marginHorizontal: spacing.sm }}>›</Text>
            <Text style={{ fontSize: 13, color: colors.textMuted }}>Cart</Text>
          </View>
        </View>

        {cart.length === 0 ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 80, gap: spacing.lg }}>
            <Feather name="shopping-bag" size={48} color={colors.mutedDark} />
            <Text style={{ fontSize: 16, color: colors.textMuted }}>Your cart is empty.</Text>
            <Pressable style={{ backgroundColor: colors.primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 4 }} onPress={() => go("shop")}>
              <Text style={{ color: "#fff", fontSize: 14, fontWeight: "500" }}>Continue Shopping</Text>
            </Pressable>
          </View>
        ) : (
          <View style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.xxl, gap: spacing.xl }}>
            {/* Cart Items */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: colors.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: spacing.md,
                }}
              >
                Your cart
              </Text>

              <View style={{ borderTopWidth: 1, borderTopColor: colors.muted }}>
                {cart.map((item) => {
                  const image = assetUrl(item.image ?? item.main_image ?? item.images?.[0]);
                  const itemTotal = Number(item.sale_price ?? item.price) * item.quantity;
                  return (
                    <View
                      key={`${item.id}-${item.size ?? ""}-${item.color ?? ""}`}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.md,
                        paddingVertical: spacing.lg,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.muted,
                      }}
                    >
                      {/* Product Image */}
                      <View
                        style={{
                          width: 64,
                          height: 64,
                          backgroundColor: colors.muted,
                          borderRadius: 4,
                          overflow: "hidden",
                          justifyContent: "center",
                          alignItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        {image ? (
                          <Image source={{ uri: image }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                        ) : (
                          <View style={{ width: 40, height: 48, backgroundColor: "#D1D5DB", borderRadius: 4 }} />
                        )}
                      </View>

                      {/* Product Info */}
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Text style={{ fontSize: 13, fontWeight: "500", color: colors.text, marginBottom: 2 }} numberOfLines={2}>
                          {item.name}
                        </Text>
                        <Text style={{ fontSize: 11, color: colors.textLight }}>
                          Size:{" "}
                          <Text style={{ color: colors.textMuted }}>{item.size || "Standard"}</Text>
                        </Text>
                      </View>

                      {/* Price */}
                      <Text style={{ fontSize: 13, fontWeight: "600", color: colors.text, width: 70, textAlign: "right" }}>
                        {money(itemTotal)}
                      </Text>

                      {/* Quantity */}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: spacing.sm,
                          borderWidth: 1,
                          borderColor: colors.mutedDark,
                          borderRadius: 4,
                          paddingHorizontal: spacing.sm,
                          paddingVertical: 4,
                        }}
                      >
                        <Pressable onPress={() => changeQuantity(item, item.quantity - 1)}>
                          <Feather name="minus" size={14} color={colors.textLight} style={{ paddingHorizontal: 4 }} />
                        </Pressable>
                        <Text style={{ fontSize: 13, color: colors.text, width: 20, textAlign: "center" }}>{item.quantity}</Text>
                        <Pressable onPress={() => changeQuantity(item, item.quantity + 1)}>
                          <Feather name="plus" size={14} color={colors.textLight} style={{ paddingHorizontal: 4 }} />
                        </Pressable>
                      </View>

                      {/* Remove */}
                      <Pressable onPress={() => removeFromCart(item.id, item.size, item.color)}>
                        <Feather name="x" size={18} color={colors.textLight} />
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Order Summary */}
            <View
              style={{
                borderWidth: 1,
                borderColor: colors.mutedDark,
                borderRadius: 8,
                padding: spacing.xl,
                backgroundColor: colors.background,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "700", color: colors.text, marginBottom: spacing.lg }}>Order Summary</Text>

              <View style={{ gap: spacing.md, marginBottom: spacing.lg }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 13, color: colors.textMuted }}>Subtotal</Text>
                  <Text style={{ fontSize: 13, fontWeight: "500", color: colors.text }}>{money(cartTotal)}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 13, color: colors.textMuted }}>Shipping</Text>
                  <Text style={{ fontSize: 13, fontWeight: "500", color: colors.text }}>Free</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 13, color: colors.textMuted }}>Tax</Text>
                  <Text style={{ fontSize: 13, fontWeight: "500", color: colors.text }}>{money(tax)}</Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderTopWidth: 1,
                    borderTopColor: colors.muted,
                    paddingTop: spacing.md,
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: "700", color: colors.text }}>Total</Text>
                  <Text style={{ fontSize: 13, fontWeight: "800", color: colors.text }}>{money(total)}</Text>
                </View>
              </View>

              <Pressable
                style={{ backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 4, alignItems: "center" }}
                onPress={() => go("checkout")}
              >
                <Text style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}>Checkout</Text>
              </Pressable>

              <Pressable onPress={() => go("shop")} style={{ marginTop: spacing.md, alignSelf: "center" }}>
                <Text style={{ fontSize: 12, color: colors.textMuted, textDecorationLine: "underline" }}>Continue Shopping</Text>
              </Pressable>
            </View>
          </View>
        )}

        <Footer go={go} />
      </ScrollView>
    </SafeAreaView>
  );
}
