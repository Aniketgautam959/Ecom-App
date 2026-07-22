import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { api, messageFrom, unwrap } from "../api";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { colors, money, styles } from "../styles";
import type { Address, Order } from "../types";

export function Checkout({ back }: { back: () => void }) {
  const { go, replace, cartCount, user, cart, cartTotal, clearCart, setSelectedOrder } = useApp();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState<"cod" | "razorpay" | "card">("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const taxRate = 0.03;
  const shipping = 0;
  const tax = parseFloat((cartTotal * taxRate).toFixed(2));
  const total = Math.max(0, cartTotal + shipping + tax - discount);

  useEffect(() => {
    if (!user) return;
    api
      .get("/addresses")
      .then((res) => {
        const list = (unwrap(res) as Address[]) ?? [];
        setAddresses(list);
        setSelectedAddress(list.find((a) => a.is_default) ?? list[0] ?? null);
      })
      .catch(() => {});
  }, [user]);

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    try {
      const res = await api.post("/coupons/apply", { code: coupon, subtotal: cartTotal });
      const data = unwrap(res) as { discount: number };
      setDiscount(data.discount ?? 0);
    } catch (err) {
      Alert.alert("Coupon", messageFrom(err));
    }
  };

  const placeOrder = async () => {
    setError("");
    if (!user) {
      go("login");
      return;
    }
    if (!selectedAddress) {
      setError("Please select a delivery address.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/orders", {
        address_id: selectedAddress.id,
        payment_method: payment,
        coupon_code: coupon || undefined,
        notes,
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          size: item.size ?? "",
          color: item.color ?? "",
        })),
      });
      const order = (unwrap(res) as Order) ?? (res.data as Order);
      setSelectedOrder(order);
      clearCart();
      if (payment === "razorpay") {
        replace("payment");
      } else {
        replace("order-success");
      }
    } catch (err) {
      setError(messageFrom(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="Checkout" back={back} go={go} cartCount={cartCount} />
      <ScrollView contentContainerStyle={styles.form}>
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.alertText}>{error}</Text>
          </View>
        )}

        <Text style={styles.subheading}>Delivery Address</Text>
        {addresses.length === 0 && (
          <Pressable style={[styles.option, { borderStyle: "dashed" }]} onPress={() => go("addresses")}>
            <Text style={styles.link}>+ Add new address</Text>
          </Pressable>
        )}
        {addresses.map((address) => (
          <Pressable
            key={address.id}
            style={[styles.option, selectedAddress?.id === address.id && styles.optionActive]}
            onPress={() => setSelectedAddress(address)}
          >
            <View style={styles.spaceBetween}>
              <Text style={styles.optionTitle}>{address.label} {address.is_default && "(Default)"}</Text>
            </View>
            <Text style={styles.optionText}>{address.name}</Text>
            <Text style={styles.optionText}>{address.phone}</Text>
            <Text style={styles.optionText}>{address.address_line}, {address.city}, {address.state} - {address.pincode}</Text>
          </Pressable>
        ))}

        <Text style={styles.subheading}>Payment Method</Text>
        {(["cod", "razorpay", "card"] as const).map((method) => (
          <Pressable
            key={method}
            style={[styles.option, payment === method && styles.optionActive]}
            onPress={() => setPayment(method)}
          >
            <Text style={styles.optionTitle}>
              {method === "cod" ? "Cash on Delivery" : method === "razorpay" ? "Razorpay" : "Credit / Debit Card"}
            </Text>
          </Pressable>
        ))}

        <Text style={styles.subheading}>Coupon</Text>
        <View style={[styles.row, styles.input]}>
          <TextInput style={styles.flex} placeholder="Enter coupon code" value={coupon} onChangeText={setCoupon} />
          <Pressable onPress={applyCoupon}>
            <Text style={{ color: colors.primary }}>Apply</Text>
          </Pressable>
        </View>

        <Text style={styles.inputLabel}>Order Notes</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Any special instructions..."
          multiline
          value={notes}
          onChangeText={setNotes}
        />

        <View style={styles.webCard}>
          <Text style={styles.subheading}>Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{money(cartTotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>Free</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>{money(tax)}</Text>
          </View>
          {discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>-{money(discount)}</Text>
            </View>
          )}
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={[styles.summaryValue, { fontSize: 16, fontWeight: "800" }]}>{money(total)}</Text>
          </View>
          <Pressable style={styles.primaryButton} onPress={placeOrder} disabled={loading}>
            <Text style={styles.primaryButtonText}>{loading ? "Placing order..." : "Place Order"}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
