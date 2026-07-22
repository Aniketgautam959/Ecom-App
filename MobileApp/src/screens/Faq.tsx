import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { styles } from "../styles";

const faqs = [
  { q: "How do I track my order?", a: "Go to My Orders, select an order and tap Track Order to view the delivery status." },
  { q: "What payment methods do you accept?", a: "We accept Cash on Delivery, Razorpay, credit and debit cards." },
  { q: "How do I return a product?", a: "You can initiate a return from the order details page within the return window." },
  { q: "How long does delivery take?", a: "Delivery usually takes 3-7 business days depending on your location." },
  { q: "How can I contact support?", a: "Visit Contact Us or Support to send us a message directly." },
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
            <Pressable onPress={() => setOpen(open === index ? null : index)}>
              <Text style={styles.subheading}>{faq.q}</Text>
            </Pressable>
            {open === index && <Text style={styles.body}>{faq.a}</Text>}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
