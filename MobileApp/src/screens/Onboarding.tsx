import { Pressable, SafeAreaView, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { styles } from "../styles";

export function Onboarding({ done }: { done: () => void }) {
  return (
    <SafeAreaView style={[styles.center, { backgroundColor: "#111827", padding: 24 }]}>
      <StatusBar style="light" />
      <Text style={{ color: "#fff", fontSize: 42, fontWeight: "800", marginBottom: 24 }}>Ecom-app</Text>
      <Text style={{ color: "#fff", fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: 12 }}>
        Everything you love, delivered.
      </Text>
      <Text style={{ color: "#D1D5DB", fontSize: 14, textAlign: "center", marginBottom: 32 }}>
        Discover curated products, seamless checkout, and reliable delivery in one place.
      </Text>
      <Pressable style={[styles.primaryButton, { width: "100%" }]} onPress={done}>
        <Text style={styles.primaryButtonText}>Get started</Text>
      </Pressable>
    </SafeAreaView>
  );
}
