import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { money, styles } from "../styles";

export function OrderSuccess({ back }: { back: () => void }) {
  const { go, cartCount, selectedOrder } = useApp();

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="Order Placed" back={back} go={go} cartCount={cartCount} showCart={false} />
      <ScrollView contentContainerStyle={[styles.center, styles.form]}>
        <Text style={{ fontSize: 64, marginBottom: 16 }}>✓</Text>
        <Text style={styles.heading}>Thank you!</Text>
        <Text style={styles.body}>Your order has been placed successfully.</Text>
        {selectedOrder && (
          <View style={[styles.webCard, { width: "100%" }]}>
            <Text style={styles.subheading}>Order #{selectedOrder.order_number}</Text>
            <Text style={styles.body}>Total: {money(selectedOrder.total)}</Text>
            <Text style={styles.body}>Status: {selectedOrder.status}</Text>
          </View>
        )}
        <Pressable style={styles.primaryButton} onPress={() => go("orders")}>
          <Text style={styles.primaryButtonText}>View Orders</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => go("home")}>
          <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
