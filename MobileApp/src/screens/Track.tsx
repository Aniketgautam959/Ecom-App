import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { statusColors, styles } from "../styles";

export function Track({ back }: { back: () => void }) {
  const { go, cartCount, selectedOrder } = useApp();
  const stages = ["pending", "confirmed", "processing", "shipped", "delivered"];
  const current = selectedOrder ? stages.indexOf(selectedOrder.status.toLowerCase()) : -1;

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="Track Order" back={back} go={go} cartCount={cartCount} />
      <ScrollView contentContainerStyle={styles.form}>
        {selectedOrder ? (
          <View style={styles.webCard}>
            <Text style={styles.subheading}>Order #{selectedOrder.order_number}</Text>
            <Text style={styles.body}>Status: {selectedOrder.status}</Text>
            {stages.map((stage, idx) => {
              const active = idx <= current;
              const color = active ? statusColors[stage] ?? { bg: "#111827", text: "#fff" } : { bg: "#E5E7EB", text: "#9CA3AF" };
              return (
                <View key={stage} style={styles.timelineItem}>
                  <View style={[styles.timelineDot, active ? styles.timelineActive : styles.timelineInactive, { backgroundColor: color.bg }]} />
                  <Text style={active ? styles.timelineText : styles.timelineTextMuted}>{stage.charAt(0).toUpperCase() + stage.slice(1)}</Text>
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={{ textAlign: "center", margin: 24, color: "#6B7280" }}>No order selected for tracking.</Text>
        )}
        <Pressable style={styles.primaryButton} onPress={() => go("orders")}>
          <Text style={styles.primaryButtonText}>My Orders</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
