import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { colors, statusColors, styles } from "../styles";

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
            <View style={[styles.row, { alignItems: "center", gap: 8, marginBottom: 8 }]}>
              <Feather name="truck" size={18} color={colors.text} />
              <Text style={styles.subheading}>Order #{selectedOrder.order_number}</Text>
            </View>
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
          <View style={{ alignItems: "center", paddingVertical: 60 }}>
            <Feather name="package" size={48} color={colors.mutedDark} style={{ marginBottom: 16 }} />
            <Text style={{ color: colors.textLight, marginBottom: 16 }}>No order selected for tracking.</Text>
          </View>
        )}
        <Pressable style={styles.primaryButton} onPress={() => go("orders")}>
          <Text style={styles.primaryButtonText}>My Orders</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
