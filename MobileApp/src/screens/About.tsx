import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { Header } from "../components/Header";
import { useApp } from "../context/AppContext";
import { styles } from "../styles";

export function About({ back }: { back: () => void }) {
  const { go, cartCount } = useApp();

  return (
    <SafeAreaView style={styles.flex}>
      <Header title="About Us" back={back} go={go} cartCount={cartCount} />
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.heading}>Welcome to Ecommerce</Text>
        <Text style={styles.body}>
          We are a modern ecommerce platform offering quality products across categories. Our mission is to provide a
          seamless shopping experience with reliable delivery and customer-first support.
        </Text>
        <Text style={[styles.subheading, { marginTop: 20 }]}>Why shop with us?</Text>
        {[
          "Curated product catalog",
          "Secure payments",
          "Fast delivery",
          "Easy returns",
          "24/7 customer support",
        ].map((item) => (
          <Text key={item} style={styles.body}>
            • {item}
          </Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
