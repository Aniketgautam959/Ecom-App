import { useEffect, useMemo, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Alert, Image, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { api, assetUrl, messageFrom, unwrap } from "../api";
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
  const [payment, setPayment] = useState<"cod" | "razorpay">("cod");
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

        <View style={[styles.row, { alignItems: "center", gap: 8, marginBottom: 12 }]}>
          <Feather name="truck" size={16} color={colors.text} />
          <Text style={styles.subheading}>Delivery Address</Text>
        </View>
        {addresses.length === 0 && (
          <Pressable style={[styles.option, { borderStyle: "dashed", flexDirection: "row", alignItems: "center", gap: 8 }]} onPress={() => go("addresses")}>
            <Feather name="plus" size={14} color={colors.primary} />
            <Text style={styles.link}>Add new address</Text>
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

        <View style={[styles.row, { alignItems: "center", gap: 8, marginBottom: 12 }]}>
          <Feather name="credit-card" size={16} color={colors.text} />
          <Text style={styles.subheading}>Payment Method</Text>
        </View>
        {(["cod", "razorpay"] as const).map((method) => (
          <Pressable
            key={method}
            style={[styles.option, payment === method && styles.optionActive]}
            onPress={() => setPayment(method)}
          >
            <Text style={styles.optionTitle}>
              {method === "cod" ? "Cash on Delivery" : "Razorpay (UPI/Card/Netbanking)"}
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
          <View style={{ gap: 12, marginBottom: 16 }}>
            {cart.map((item) => {
              const image = assetUrl(item.image ?? item.main_image ?? item.images?.[0]);
              const itemTotal = Number(item.sale_price ?? item.price) * item.quantity;
              return (
                <View key={`${item.id}-${item.size ?? ""}-${item.color ?? ""}`} style={[styles.row, { gap: 12, alignItems: "center" }]}>
                  <View style={{ width: 48, height: 48, backgroundColor: colors.muted, borderRadius: 4, overflow: "hidden" }}>
                    {image ? <Image source={{ uri: image }} style={{ width: "100%", height: "100%" }} resizeMode="cover" /> : null}
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={{ fontSize: 12, color: colors.text }} numberOfLines={1}>{item.name}</Text>
                    <Text style={{ fontSize: 11, color: colors.textLight }}>Qty: {item.quantity} {item.size ? `• ${item.size}` : ""}</Text>
                  </View>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text }}>{money(itemTotal)}</Text>
                </View>
              );
            })}
          </View>
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
