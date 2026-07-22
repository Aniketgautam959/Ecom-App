import { useState } from "react";
import { Alert, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { api, messageFrom } from "../api";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { colors, money, styles } from "../styles";

export function Payment({ back }: { back: () => void }) {
  const { go, replace, cartCount, selectedOrder } = useApp();
  const [loading, setLoading] = useState(false);
  const [txid, setTxid] = useState("");

  const verify = async () => {
    if (!selectedOrder) return;
    setLoading(true);
    try {
      await api.post("/orders/verify-payment", {
        order_id: selectedOrder.id,
        razorpay_payment_id: txid || "demo_payment",
        razorpay_order_id: "demo_order",
        razorpay_signature: "demo_signature",
      });
      replace("order-success");
    } catch (err) {
      Alert.alert("Payment", messageFrom(err));
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="Payment" back={back} go={go} cartCount={cartCount} />
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.heading}>Complete payment</Text>
        <Text style={styles.body}>Order #{selectedOrder?.order_number}</Text>
        <Text style={[styles.heading, { marginTop: 8 }]}>{money(selectedOrder?.total ?? 0)}</Text>
        <Text style={styles.inputLabel}>Payment / Transaction ID</Text>
        <TextInput style={styles.input} value={txid} onChangeText={setTxid} placeholder="Enter transaction ID" />
        <Pressable style={[styles.primaryButton, { marginTop: 12 }]} onPress={verify} disabled={loading}>
          <Text style={styles.primaryButtonText}>{loading ? "Verifying..." : "Verify Payment"}</Text>
        </Pressable>
        <Pressable style={[styles.secondaryButton, { marginTop: 12 }]} onPress={() => replace("order-failed")}>
          <Text style={styles.secondaryButtonText}>Simulate Failure</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
