import { useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { ActivityIndicator, Alert, Image, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { api, assetUrl, messageFrom, unwrap } from "../api";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { colors, money, statusColors, styles } from "../styles";
import type { Order } from "../types";

export function OrderDetails({ back }: { back: () => void }) {
  const { go, cartCount, selectedOrder } = useApp();
  const [order, setOrder] = useState<Order | null>(selectedOrder);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedOrder && !order) {
      setLoading(true);
      api
        .get(`/orders/${selectedOrder.id}`)
        .then((res) => setOrder(unwrap(res) as Order))
        .catch((err) => Alert.alert("Error", messageFrom(err)))
        .finally(() => setLoading(false));
    }
  }, [selectedOrder, order]);

  const cancel = async () => {
    if (!order) return;
    try {
      await api.post(`/orders/${order.id}/cancel`);
      setOrder({ ...order, status: "cancelled" });
      Alert.alert("Cancelled", "Order cancelled successfully.");
    } catch (err) {
      Alert.alert("Error", messageFrom(err));
    }
  };

  if (!order) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No order selected.</Text>
      </SafeAreaView>
    );
  }

  const status = statusColors[order.status.toLowerCase()] ?? { bg: "#F3F4F6", text: "#374151" };

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="Order Details" back={back} go={go} cartCount={cartCount} showCart={false} />
      {loading ? (
        <ActivityIndicator style={{ margin: 24 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.form}>
          <View style={[styles.webCard, { marginBottom: 16 }]}>
            <View style={styles.spaceBetween}>
              <Text style={styles.subheading}>Order #{order.order_number}</Text>
              <View style={[styles.badge, { backgroundColor: status.bg }]}>
                <Text style={[styles.badgeText, { color: status.text }]}>{order.status}</Text>
              </View>
            </View>
            <Text style={styles.small}>Placed on {new Date(order.created_at ?? order.date).toLocaleDateString()}</Text>
          </View>

          <View style={[styles.row, { alignItems: "center", gap: 8, marginBottom: 8 }]}>
            <Feather name="package" size={16} color={colors.text} />
            <Text style={styles.subheading}>Items ({order.items?.length ?? 0})</Text>
          </View>
          {order.items?.map((item) => (
            <View key={item.id} style={[styles.row, { alignItems: "center", gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.muted }]}>
              <View style={{ width: 56, height: 56, backgroundColor: colors.muted, borderRadius: 4, overflow: "hidden", justifyContent: "center", alignItems: "center" }}>
                {item.product_image ? (
                  <Image source={{ uri: assetUrl(item.product_image) }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                ) : (
                  <Feather name="package" size={20} color={colors.textLight} />
                )}
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ fontSize: 13, fontWeight: "500", color: colors.text }} numberOfLines={1}>{item.product_name}</Text>
                <Text style={{ fontSize: 11, color: colors.textLight, marginTop: 2 }}>
                  Qty: {item.quantity}{item.size ? ` • Size: ${item.size}` : ""}{item.color ? ` • Color: ${item.color}` : ""}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ fontSize: 13, fontWeight: "600", color: colors.text }}>{money(item.total)}</Text>
                <Text style={{ fontSize: 11, color: colors.textLight }}>{money(item.price)} each</Text>
              </View>
            </View>
          ))}

          <View style={[styles.webCard, { marginTop: 16 }]}>
            <Text style={styles.subheading}>Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{money(order.subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>{money(order.shipping_cost)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>{money(order.tax)}</Text>
            </View>
            {order.discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount</Text>
                <Text style={[styles.summaryValue, { color: colors.success }]}>-{money(order.discount)}</Text>
              </View>
            )}
            <View style={[styles.summaryRow, styles.summaryTotal]}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={[styles.summaryValue, { fontSize: 16, fontWeight: "800" }]}>{money(order.total)}</Text>
            </View>
          </View>

          <View style={[styles.webCard, { marginTop: 16 }]}>
            <View style={[styles.row, { alignItems: "center", gap: 8, marginBottom: 8 }]}>
              <Feather name="truck" size={16} color={colors.text} />
              <Text style={styles.subheading}>Shipping</Text>
            </View>
            <Text style={styles.body}>{order.shipping.name}</Text>
            <Text style={styles.body}>{order.shipping.phone}</Text>
            <Text style={styles.body}>{order.shipping.address}</Text>
            <Text style={styles.body}>{order.shipping.city}, {order.shipping.state} - {order.shipping.pincode}</Text>
          </View>

          <View style={[styles.webCard, { marginTop: 16 }]}>
            <View style={[styles.row, { alignItems: "center", gap: 8, marginBottom: 8 }]}>
              <Feather name="credit-card" size={16} color={colors.text} />
              <Text style={styles.subheading}>Payment</Text>
            </View>
            <Text style={styles.body}>{order.payment_method?.toUpperCase()}</Text>
            <Text style={styles.body}>Status: <Text style={{ fontWeight: "600" }}>{order.payment_status ? order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1) : ""}</Text></Text>
          </View>

          {["pending", "confirmed"].includes(order.status.toLowerCase()) && (
            <Pressable style={[styles.secondaryButton, { borderColor: colors.error }]} onPress={cancel}>
              <Text style={{ color: colors.error }}>Cancel Order</Text>
            </Pressable>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
