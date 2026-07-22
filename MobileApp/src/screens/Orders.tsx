import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { api, messageFrom, unwrap } from "../api";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { colors, money, statusColors, styles } from "../styles";
import type { Order } from "../types";

export function Orders({ back }: { back: () => void }) {
  const { go, cartCount, user, setSelectedOrder } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    api
      .get("/orders")
      .then((res) => setOrders((unwrap(res) as Order[]) ?? []))
      .catch((err) => alert(messageFrom(err)))
      .finally(() => setLoading(false));
  }, [user]);

  const open = (order: Order) => {
    setSelectedOrder(order);
    go("order");
  };

  const statusStyle = (status: string) => statusColors[status.toLowerCase()] ?? { bg: "#F3F4F6", text: "#374151" };

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="My Orders" back={back} go={go} cartCount={cartCount} />
      {loading ? (
        <ActivityIndicator style={{ margin: 24 }} />
      ) : orders.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>▢</Text>
          <Text style={styles.emptyText}>No orders yet.</Text>
          <Pressable style={styles.primaryButton} onPress={() => go("home")}>
            <Text style={styles.primaryButtonText}>Start Shopping</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.form}>
          {orders.map((order) => {
            const s = statusStyle(order.status);
            return (
              <Pressable key={order.id} style={styles.webCard} onPress={() => open(order)}>
                <View style={styles.spaceBetween}>
                  <Text style={styles.subheading}>#{order.order_number}</Text>
                  <View style={[styles.badge, { backgroundColor: s.bg }]}>
                    <Text style={[styles.badgeText, { color: s.text }]}>{order.status}</Text>
                  </View>
                </View>
                <Text style={styles.small}>Placed on {new Date(order.created_at ?? order.date).toLocaleDateString()}</Text>
                <View style={[styles.summaryRow, { marginTop: 8 }]}>
                  <Text style={styles.summaryLabel}>Total</Text>
                  <Text style={styles.summaryValue}>{money(order.total)}</Text>
                </View>
                <Text style={[styles.link, { marginTop: 8 }]}>View details →</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
