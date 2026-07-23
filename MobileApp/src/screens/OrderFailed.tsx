import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { colors, money, styles } from "../styles";

export function OrderFailed({ back }: { back: () => void }) {
  const { go, cartCount, selectedOrder } = useApp();

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="Payment Failed" back={back} go={go} cartCount={cartCount} showCart={false} />
      <ScrollView contentContainerStyle={[styles.center, styles.form]}>
        <Feather name="x-circle" size={64} color={colors.error} style={{ marginBottom: 16 }} />
        <Text style={styles.heading}>Payment Failed</Text>
        <Text style={[styles.body, { textAlign: "center", marginBottom: 16 }]}>
          We couldn&apos;t process your payment. Your order{" "}
          <Text style={{ fontWeight: "700", color: colors.text }}>{selectedOrder?.order_number || ""}</Text> is still pending.
        </Text>

        <View style={[styles.webCard, { width: "100%", backgroundColor: "#FEF2F2", borderColor: colors.error, marginBottom: 16 }]}>
          <View style={[styles.row, { alignItems: "flex-start", gap: 12 }]}>
            <Feather name="credit-card" size={20} color={colors.error} style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: colors.error, marginBottom: 4 }}>What happened?</Text>
              <Text style={{ fontSize: 12, color: colors.error }}>
                Your payment could not be completed. This can happen due to insufficient funds, transaction timeout, or the payment being cancelled.
              </Text>
            </View>
          </View>
        </View>

        <Pressable style={[styles.primaryButton, { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }]} onPress={() => go("payment")}>
          <Feather name="rotate-ccw" size={14} color="#fff" />
          <Text style={styles.primaryButtonText}>Try Again</Text>
        </Pressable>
        <Pressable style={[styles.secondaryButton, { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }]} onPress={() => go("orders")}>
          <Feather name="help-circle" size={14} color={colors.text} />
          <Text style={styles.secondaryButtonText}>View Orders</Text>
        </Pressable>
        <Text style={{ fontSize: 11, color: colors.textLight, marginTop: 16 }}>If the amount was deducted, it will be refunded within 5-7 business days.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
