import { useEffect, useState } from "react";
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

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="Notifications" back={back} go={go} cartCount={cartCount} />
      {loading ? (
        <ActivityIndicator style={{ margin: 24 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.form}>
          <Pressable onPress={markAllRead}>
            <Text style={[styles.link, { alignSelf: "flex-end", marginBottom: 12 }]}>Mark all read</Text>
          </Pressable>
          {items.length === 0 ? (
            <Text style={{ textAlign: "center", margin: 24, color: "#6B7280" }}>No notifications.</Text>
          ) : (
            items.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.webCard,
                  { marginBottom: 12, borderLeftWidth: 4, borderLeftColor: item.read ? "#E5E7EB" : colors.primary },
                ]}
              >
                <Text style={styles.subheading}>{item.title}</Text>
                <Text style={styles.body}>{item.message}</Text>
                <Text style={styles.small}>{new Date(item.created_at).toLocaleString()}</Text>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
