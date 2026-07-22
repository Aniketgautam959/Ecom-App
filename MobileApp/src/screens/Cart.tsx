import { Alert, FlatList, Image, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { api, assetUrl } from "../api";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { colors, money, styles } from "../styles";
import type { CartItem } from "../types";

export function Cart({ back }: { back: () => void }) {
  const { go, cartCount, cart, updateCartQuantity, removeFromCart, cartTotal, user } = useApp();

  const shipping = 0;
  const tax = parseFloat((cartTotal * 0.03).toFixed(2));
  const total = cartTotal + shipping + tax;

  const changeQuantity = async (item: CartItem, quantity: number) => {
    updateCartQuantity(item.id, quantity, item.size, item.color);
    if (user) {
      if (quantity < 1) {
        await api.delete(`/cart/${item.id}`, { data: { size: item.size ?? "", color: item.color ?? "" } }).catch(() => undefined);
      } else {
        await api.put(`/cart/${item.id}`, { quantity, size: item.size ?? "", color: item.color ?? "" }).catch(() => undefined);
      }
    }
  };

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="Cart" back={back} go={go} cartCount={cartCount} />
      {cart.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>▢</Text>
          <Text style={styles.emptyText}>Your cart is empty.</Text>
          <Pressable style={styles.primaryButton} onPress={() => go("home")}>
            <Text style={styles.primaryButtonText}>Continue Shopping</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView style={styles.flex}>
            <Text style={[styles.caption, { margin: 16 }]}>YOUR CART</Text>
            <FlatList
              data={cart}
              scrollEnabled={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              keyExtractor={(item) => `${item.id}-${item.size ?? ""}-${item.color ?? ""}`}
              renderItem={({ item }) => {
                const image = assetUrl(item.image ?? item.main_image ?? item.images?.[0]);
                return (
                  <View style={styles.cartItem}>
                    <View style={styles.cartImage}>
                      {image ? (
                        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
                      ) : (
                        <Text style={styles.placeholder}>Product</Text>
                      )}
                    </View>
                    <View style={styles.cartInfo}>
                      <Text style={styles.cartName} numberOfLines={2}>{item.name}</Text>
                      <Text style={styles.cartVariant}>Size: {item.size || "Standard"}</Text>
                      <Text style={styles.cartPrice}>{money(item.sale_price ?? item.price)}</Text>
                    </View>
                    <View style={styles.quantityRow}>
                      <Pressable style={styles.quantityButton} onPress={() => changeQuantity(item, item.quantity - 1)}>
                        <Text style={{ color: colors.textMuted }}>-</Text>
                      </Pressable>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <Pressable style={styles.quantityButton} onPress={() => changeQuantity(item, item.quantity + 1)}>
                        <Text style={{ color: colors.textMuted }}>+</Text>
                      </Pressable>
                    </View>
                    <Pressable onPress={() => removeFromCart(item.id, item.size, item.color)}>
                      <Text style={{ color: colors.error, fontSize: 20 }}>×</Text>
                    </Pressable>
                  </View>
                );
              }}
            />
            <View style={[styles.webCard, { margin: 16 }]}>
              <Text style={styles.subheading}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>{money(cartTotal)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>Free</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax</Text>
                <Text style={styles.summaryValue}>{money(tax)}</Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryTotal]}>
                <Text style={styles.summaryLabel}>Total</Text>
                <Text style={[styles.summaryValue, { fontSize: 16, fontWeight: "800" }]}>{money(total)}</Text>
              </View>
              <Pressable style={styles.primaryButton} onPress={() => go("checkout")}>
                <Text style={styles.primaryButtonText}>Checkout</Text>
              </Pressable>
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}
