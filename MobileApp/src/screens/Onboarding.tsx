import Feather from "@expo/vector-icons/Feather";
import { StatusBar } from "expo-status-bar";
import { Image, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { colors, spacing, styles } from "../styles";

const heroImage = "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=900&q=85";

const features = [
  { icon: "truck", title: "Free Shipping", desc: "Fast & free delivery on every order." },
  { icon: "shield", title: "Secure Payment", desc: "Your payments are safe with us." },
  { icon: "credit-card", title: "Easy Checkout", desc: "Seamless one-tap checkout." },
] as const;

export function Onboarding({ done }: { done: () => void }) {
  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{ uri: heroImage }}
          style={{ width: "100%", height: 320 }}
          resizeMode="cover"
        />

        <View
          style={{
            backgroundColor: colors.background,
            padding: spacing.lg,
            paddingTop: spacing.xxl,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            marginTop: -24,
          }}
        >
          <View style={styles.webBrand}>
            <View style={styles.webBrandMark}>
              <Text style={styles.webBrandLetter}>E</Text>
            </View>
            <Text style={styles.webBrandText}>Ecommerce</Text>
          </View>

          <Text
            style={{
              fontSize: 28,
              fontWeight: "800",
              color: colors.text,
              marginTop: spacing.lg,
              marginBottom: spacing.sm,
            }}
          >
            Everything you love, delivered.
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: colors.textMuted,
              marginBottom: spacing.lg,
              lineHeight: 20,
            }}
          >
            Discover curated products, seamless checkout, and reliable delivery in one place.
          </Text>

          {features.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: spacing.md,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.successLight,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: spacing.md,
                }}
              >
                <Feather name={item.icon} size={18} color={colors.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: colors.text }}>
                  {item.title}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textMuted }}>
                  {item.desc}
                </Text>
              </View>
            </View>
          ))}

          <Pressable
            style={[styles.primaryButton, { width: "100%", marginTop: spacing.md }]}
            onPress={done}
          >
            <Text style={styles.primaryButtonText}>Get started</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
