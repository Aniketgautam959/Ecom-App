import { SafeAreaView, ScrollView, Text } from "react-native";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { styles } from "../styles";

export function PrivacyPolicy({ back }: { back: () => void }) {
  const { go, cartCount } = useApp();

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="Privacy Policy" back={back} go={go} cartCount={cartCount} />
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.heading}>Privacy Policy</Text>
        <Text style={styles.body}>
          Your privacy is important to us. This policy outlines how we collect, use, and protect your personal
          information.
        </Text>
        <Text style={[styles.subheading, { marginTop: 20 }]}>Information We Collect</Text>
        <Text style={styles.body}>
          We collect information such as your name, email address, phone number, shipping address, and payment details when
          you create an account or place an order.
        </Text>
        <Text style={[styles.subheading, { marginTop: 16 }]}>How We Use Your Information</Text>
        <Text style={styles.body}>
          Your information is used to process orders, provide customer support, improve our services, and communicate
          important updates or promotional offers.
        </Text>
        <Text style={[styles.subheading, { marginTop: 16 }]}>Data Security</Text>
        <Text style={styles.body}>
          We implement industry-standard security measures to protect your data from unauthorized access, disclosure, or
          misuse.
        </Text>
        <Text style={[styles.subheading, { marginTop: 16 }]}>Third-Party Services</Text>
        <Text style={styles.body}>
          We may share information with trusted payment gateways and logistics partners solely to fulfill your orders and
          process payments.
        </Text>
        <Text style={[styles.subheading, { marginTop: 16 }]}>Your Rights</Text>
        <Text style={styles.body}>
          You can update or delete your account information by contacting our support team. You may also opt out of marketing
          communications at any time.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
