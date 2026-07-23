import { Pressable, SafeAreaView, ScrollView, Text, View, Linking } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { colors, styles } from "../styles";

export function Support({ back }: { back: () => void }) {
  const { go, cartCount } = useApp();

  const open = (url: string) => Linking.openURL(url).catch(() => {});

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="Support" back={back} go={go} cartCount={cartCount} />
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.heading}>Help & Support</Text>
        <Text style={styles.body}>
          Need assistance? Our support team is here to help you with orders, returns, payments and account related queries.
        </Text>

        <Pressable style={styles.menuItem} onPress={() => go("contact")}>
          <Text style={styles.menuText}>Contact Us</Text>
          <Feather name="chevron-right" size={16} color={colors.textLight} />
        </Pressable>
        <Pressable style={styles.menuItem} onPress={() => go("faq")}>
          <Text style={styles.menuText}>Frequently Asked Questions</Text>
          <Feather name="chevron-right" size={16} color={colors.textLight} />
        </Pressable>
        <Pressable style={styles.menuItem} onPress={() => go("orders")}>
          <Text style={styles.menuText}>Track My Order</Text>
          <Feather name="chevron-right" size={16} color={colors.textLight} />
        </Pressable>

        <Text style={[styles.subheading, { marginTop: 24 }]}>Reach us directly</Text>
        <Pressable onPress={() => open("mailto:support@ecommerce.com")} style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <Feather name="mail" size={16} color={colors.primary} />
          <Text style={styles.link}>support@ecommerce.com</Text>
        </Pressable>
        <Pressable onPress={() => open("tel:+919876543210")} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Feather name="phone" size={16} color={colors.primary} />
          <Text style={styles.link}>+91 98765 43210</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
