import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { api, messageFrom, unwrap } from "../api";
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

          <Text style={styles.subheading}>Items</Text>
          {order.items?.map((item) => (
            <View key={item.id} style={[styles.cartItem, { borderBottomColor: colors.mutedDark }]}>
              <View style={styles.cartInfo}>
                <Text style={styles.cartName}>{item.product_name}</Text>
                <Text style={styles.cartVariant}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.cartPrice}>{money(item.total)}</Text>
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
            <Text style={styles.subheading}>Shipping</Text>
            <Text style={styles.body}>{order.shipping.name}</Text>
            <Text style={styles.body}>{order.shipping.phone}</Text>
            <Text style={styles.body}>{order.shipping.address}</Text>
            <Text style={styles.body}>{order.shipping.city}, {order.shipping.state} - {order.shipping.pincode}</Text>
          </View>

          {["pending", "confirmed", "processing"].includes(order.status.toLowerCase()) && (
            <Pressable style={[styles.secondaryButton, { borderColor: colors.error }]} onPress={cancel}>
              <Text style={{ color: colors.error }}>Cancel Order</Text>
            </Pressable>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
