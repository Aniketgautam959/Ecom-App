import { useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { api, messageFrom, unwrap } from "../api";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { colors, styles } from "../styles";
import type { Notification } from "../types";

export function Notifications({ back }: { back: () => void }) {
  const { go, cartCount } = useApp();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/notifications")
      .then((res) => setItems((unwrap(res) as Notification[]) ?? []))
      .catch((err) => alert(messageFrom(err)))
      .finally(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    try {
      await api.post("/notifications/read-all");
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      alert(messageFrom(err));
    }
  };

  const markRead = async (id: number) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      alert(messageFrom(err));
    }
  };

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="Notifications" back={back} go={go} cartCount={cartCount} />
      {loading ? (
        <ActivityIndicator style={{ margin: 24 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.form}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ fontSize: 13, color: colors.textLight }}>{items.filter((n) => !n.read).length} unread</Text>
            {items.some((n) => !n.read) && (
              <Pressable onPress={markAllRead} style={{ backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 }}>
                <Text style={{ color: "#fff", fontSize: 12, fontWeight: "500" }}>Mark all as read</Text>
              </Pressable>
            )}
          </View>
          {items.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 60 }}>
              <Feather name="bell-off" size={48} color={colors.mutedDark} style={{ marginBottom: 16 }} />
              <Text style={{ color: colors.textLight, marginBottom: 16 }}>No notifications yet.</Text>
              <Pressable style={styles.primaryButton} onPress={() => go("shop")}>
                <Text style={styles.primaryButtonText}>Start Shopping</Text>
              </Pressable>
            </View>
          ) : (
            items.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.webCard,
                  { marginBottom: 12, flexDirection: "row", alignItems: "flex-start", gap: 12, borderLeftWidth: 4, borderLeftColor: item.read ? colors.muted : colors.primary },
                ]}
              >
                <Feather name="bell" size={20} color={colors.textLight} style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.subheading}>{item.title}</Text>
                  <Text style={styles.body}>{item.message}</Text>
                  <Text style={styles.small}>{new Date(item.created_at).toLocaleString()}</Text>
                </View>
                {!item.read && (
                  <Pressable onPress={() => markRead(item.id)} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Feather name="check" size={12} color={colors.textLight} />
                    <Text style={{ fontSize: 11, color: colors.textLight }}>Mark read</Text>
                  </Pressable>
                )}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
