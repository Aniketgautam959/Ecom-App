import { Image, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { assetUrl } from "../api";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { colors, money, styles } from "../styles";

export function OrderSuccess({ back }: { back: () => void }) {
  const { go, cartCount, selectedOrder } = useApp();

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="Order Placed" back={back} go={go} cartCount={cartCount} showCart={false} />
      <ScrollView contentContainerStyle={[styles.center, styles.form]}>
        <Feather name="check-circle" size={64} color={colors.success} style={{ marginBottom: 16 }} />
        <Text style={styles.heading}>Order Placed Successfully!</Text>
        <Text style={[styles.body, { textAlign: "center", marginBottom: 16 }]}>
          Thank you for your purchase. Your order{" "}
          <Text style={{ fontWeight: "700", color: colors.text }}>{selectedOrder?.order_number || "..."}</Text> has been confirmed.
        </Text>

        {selectedOrder && (
          <View style={[styles.webCard, { width: "100%", marginTop: 16 }]}>
            <View style={[styles.row, { alignItems: "center", gap: 8, marginBottom: 12 }]}>
              <Feather name="package" size={16} color={colors.text} />
              <Text style={styles.subheading}>Order Summary</Text>
            </View>
            {selectedOrder.items?.map((item) => (
              <View key={item.id} style={[styles.row, { alignItems: "center", gap: 12, marginBottom: 12 }]}>
                <View style={{ width: 48, height: 48, backgroundColor: colors.muted, borderRadius: 4, overflow: "hidden", justifyContent: "center", alignItems: "center" }}>
                  {item.product_image ? (
                    <Image source={{ uri: assetUrl(item.product_image) }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                  ) : (
                    <Feather name="shopping-bag" size={20} color={colors.textLight} />
                  )}
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ fontSize: 13, fontWeight: "500", color: colors.text }} numberOfLines={1}>{item.product_name}</Text>
                  <Text style={{ fontSize: 11, color: colors.textLight }}>Qty: {item.quantity}{item.size ? ` • ${item.size}` : ""}{item.color ? ` • ${item.color}` : ""}</Text>
                </View>
                <Text style={{ fontSize: 13, fontWeight: "600", color: colors.text }}>{money(item.total)}</Text>
              </View>
            ))}
            <View style={[styles.summaryRow, styles.summaryTotal, { marginTop: 8 }]}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={[styles.summaryValue, { fontSize: 16, fontWeight: "800" }]}>{money(selectedOrder.total)}</Text>
            </View>
            <Text style={{ fontSize: 12, color: colors.textLight, marginTop: 12 }}>Payment: {selectedOrder.payment_method?.toUpperCase()}</Text>
            <Text style={{ fontSize: 12, color: colors.textLight }}>Status: {selectedOrder.payment_status ? selectedOrder.payment_status.charAt(0).toUpperCase() + selectedOrder.payment_status.slice(1) : ""}</Text>
            <Text style={{ fontSize: 12, color: colors.textLight }}>Shipping to: {selectedOrder.shipping?.name}, {selectedOrder.shipping?.city}</Text>
          </View>
        )}

        <Pressable style={[styles.primaryButton, { marginTop: 24 }]} onPress={() => go("orders")}>
          <Text style={styles.primaryButtonText}>View My Orders</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => go("home")}>
          <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
