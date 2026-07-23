import Feather from "@expo/vector-icons/Feather";
import { Pressable, Text, View } from "react-native";
import { useApp } from "../context/AppContext";
import { colors, styles } from "../styles";
import type { Screen } from "../types";

export function Header({
  title,
  back,
  go,
  cartCount,
  showCart = true,
}: {
  title: string;
  back?: () => void;
  go?: (screen: Screen) => void;
  cartCount: number;
  showCart?: boolean;
}) {
  const ctx = useApp();
  const navigate = go ?? ctx.go;
  const handleBack = back ?? ctx.back;

  return (
    <View style={styles.header}>
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        {back ? (
          <Pressable onPress={handleBack} style={{ marginRight: 12, padding: 4 }}>
            <Feather name="chevron-left" size={28} color={colors.primary} />
          </Pressable>
        ) : (
          <View style={[styles.webBrandMark, { marginRight: 10 }]}>
            <Text style={styles.webBrandLetter}>E</Text>
          </View>
        )}
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      {showCart ? (
        <Pressable
          onPress={() => navigate("cart")}
          style={{ position: "relative", padding: 4 }}
        >
          <Feather name="shopping-cart" size={22} color={colors.primary} />
          {cartCount > 0 && (
            <View
              style={{
                position: "absolute",
                top: -4,
                right: -6,
                minWidth: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: colors.primary,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 3,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
                {cartCount > 99 ? "99+" : cartCount}
              </Text>
            </View>
          )}
        </Pressable>
      ) : (
        <View style={{ width: 24 }} />
      )}
    </View>
  );
}
