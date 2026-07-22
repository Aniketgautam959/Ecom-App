import { SafeAreaView, ScrollView, Text } from "react-native";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { styles } from "../styles";

export function TermsConditions({ back }: { back: () => void }) {
  const { go, cartCount } = useApp();

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="Terms & Conditions" back={back} go={go} cartCount={cartCount} />
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.heading}>Terms & Conditions</Text>
        <Text style={styles.body}>
          Welcome to our ecommerce platform. By accessing or using our website, you agree to the following terms and
          conditions.
        </Text>
        <Text style={[styles.subheading, { marginTop: 20 }]}>Use of Website</Text>
        <Text style={styles.body}>
          You agree to use our website for lawful purposes only. Any misuse, fraudulent activity, or abuse of the platform is
          strictly prohibited.
        </Text>
        <Text style={[styles.subheading, { marginTop: 16 }]}>Orders & Payments</Text>
        <Text style={styles.body}>
          All orders are subject to availability and confirmation. Prices are listed in INR and may include applicable taxes.
          Payments are processed securely through our payment partners.
        </Text>
        <Text style={[styles.subheading, { marginTop: 16 }]}>Shipping & Delivery</Text>
        <Text style={styles.body}>
          We aim to deliver orders within the estimated timeframe. Delivery times may vary depending on location and external
          factors beyond our control.
        </Text>
        <Text style={[styles.subheading, { marginTop: 16 }]}>Returns & Refunds</Text>
        <Text style={styles.body}>
          Products may be returned within the specified return window, subject to our return policy. Refunds are processed after
          the returned item is received and inspected.
        </Text>
        <Text style={[styles.subheading, { marginTop: 16 }]}>Changes to Terms</Text>
        <Text style={styles.body}>
          We reserve the right to update these terms at any time. Continued use of the website after changes constitutes
          acceptance of the revised terms.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
