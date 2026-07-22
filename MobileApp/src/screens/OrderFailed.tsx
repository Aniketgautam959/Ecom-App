import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { money, styles } from "../styles";

export function OrderFailed({ back }: { back: () => void }) {
  const { go, cartCount, selectedOrder } = useApp();

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="Payment Failed" back={back} go={go} cartCount={cartCount} showCart={false} />
      <ScrollView contentContainerStyle={[styles.center, styles.form]}>
        <Text style={{ fontSize: 64, marginBottom: 16, color: "#EF4444" }}>✕</Text>
        <Text style={styles.heading}>Payment Failed</Text>
        <Text style={styles.body}>We couldn't process your payment. You can retry or contact support.</Text>
        {selectedOrder && (
          <View style={[styles.webCard, { width: "100%" }]}>
            <Text style={styles.subheading}>Order #{selectedOrder.order_number}</Text>
            <Text style={styles.body}>Amount: {money(selectedOrder.total)}</Text>
          </View>
        )}
        <Pressable style={styles.primaryButton} onPress={() => go("payment")}>
          <Text style={styles.primaryButtonText}>Retry Payment</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => go("orders")}>
          <Text style={styles.secondaryButtonText}>View Orders</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
