import { useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { api, messageFrom, unwrap } from "../api";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { colors, money, spacing, statusColors, styles } from "../styles";
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
          <Feather name="shopping-bag" size={48} color={colors.mutedDark} style={{ marginBottom: 16 }} />
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
                <View style={[styles.row, { alignItems: "center", gap: spacing.md }]}>
                  <Feather name="package" size={28} color={colors.textLight} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={{ fontSize: 13, fontWeight: "600", color: colors.text }}>{order.order_number}</Text>
                    <Text style={{ fontSize: 11, color: colors.textLight, marginTop: 2 }}>
                      {new Date(order.created_at ?? order.date).toLocaleDateString()} • {(order.items?.length ?? 0)} item{(order.items?.length ?? 0) !== 1 ? "s" : ""}
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ fontSize: 13, fontWeight: "700", color: colors.text }}>{money(order.total)}</Text>
                    <View style={[styles.badge, { backgroundColor: s.bg, marginTop: 4 }]}>
                      <Text style={[styles.badgeText, { color: s.text }]}>{order.status}</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
