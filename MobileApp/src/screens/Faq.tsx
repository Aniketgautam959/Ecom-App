import { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { colors, styles } from "../styles";

const faqs = [
  { q: "How do I place an order?", a: "Browse products, add items to your cart, and proceed to checkout. You can pay securely via Razorpay." },
  { q: "What payment methods do you accept?", a: "We accept UPI, credit/debit cards, net banking, and wallets through our secure payment partner." },
  { q: "How can I track my order?", a: "Go to My Orders and click on an order to see its current status and tracking information." },
  { q: "What is your return policy?", a: "We offer a 7-day return policy for unused items in original packaging. Contact support to initiate a return." },
  { q: "How do I contact customer support?", a: "Visit our Contact page or email us at support@example.com. We usually respond within 24 hours." },
];

export function Faq({ back }: { back: () => void }) {
  const { go, cartCount } = useApp();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="FAQ" back={back} go={go} cartCount={cartCount} />
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.heading}>Frequently Asked Questions</Text>
        {faqs.map((faq, index) => (
          <View key={index} style={[styles.webCard, { marginBottom: 12 }]}>
            <Pressable onPress={() => setOpen(open === index ? null : index)} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={[styles.subheading, { flex: 1, paddingRight: 8 }]}>{faq.q}</Text>
              <Feather name={open === index ? "chevron-up" : "chevron-down"} size={18} color={colors.textLight} />
            </Pressable>
            {open === index && <Text style={[styles.body, { marginTop: 8 }]}>{faq.a}</Text>}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
