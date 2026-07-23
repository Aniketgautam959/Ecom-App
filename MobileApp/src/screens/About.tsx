import { SafeAreaView, ScrollView, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { colors, styles } from "../styles";

export function About({ back }: { back: () => void }) {
  const { go, cartCount } = useApp();

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="About Us" back={back} go={go} cartCount={cartCount} />
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.heading}>About Us</Text>
        <Text style={styles.body}>
          We&apos;re a modern e-commerce platform built to bring you quality products at fair prices, backed by a shopping
          experience that puts you first. From curated collections to reliable delivery, everything we do is designed around
          our customers.
        </Text>
        <Text style={[styles.subheading, { marginTop: 20 }]}>Our Mission</Text>
        <Text style={styles.body}>
          To make quality products accessible to everyone through a seamless, transparent, and enjoyable online shopping
          experience.
        </Text>
        <Text style={[styles.subheading, { marginTop: 16 }]}>Our Vision</Text>
        <Text style={styles.body}>
          To become the most trusted destination for online shopping, known for our commitment to quality, value, and customer
          happiness.
        </Text>
        <Text style={[styles.subheading, { marginTop: 20 }]}>Why Choose Us</Text>
        {[
          "Fast Delivery — Reliable shipping across the country with real-time tracking.",
          "Secure Payments — Your transactions are protected with industry-grade encryption.",
          "Easy Returns — Hassle-free returns and exchanges within 7 days of delivery.",
          "24/7 Support — Our team is always here to help you with any questions.",
        ].map((item) => (
          <View key={item} style={{ flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
            <Feather name="check" size={16} color={colors.success} style={{ marginTop: 3 }} />
            <Text style={[styles.body, { flex: 1 }]}>{item}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
