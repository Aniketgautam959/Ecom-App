import { Pressable, Text, View } from "react-native";
import { colors, styles } from "../styles";
import type { Screen } from "../types";

export function WebHeader({
  go,
  cartCount,
  showNav = true,
}: {
  go: (screen: Screen) => void;
  cartCount: number;
  showNav?: boolean;
}) {
  return (
    <View style={styles.webNav}>
      <Pressable style={styles.webBrand} onPress={() => go("home")}>
        <View style={styles.webBrandMark}>
          <Text style={styles.webBrandLetter}>E</Text>
        </View>
        <Text style={styles.webBrandText}>Ecommerce</Text>
      </Pressable>

      {showNav && (
        <View style={styles.webNavActions}>
          <Pressable onPress={() => go("search")}>
            <Text style={styles.webNavIcon}>⌕</Text>
          </Pressable>
          <Pressable onPress={() => go("cart")} style={{ position: "relative" }}>
            <Text style={styles.webNavIcon}>🛒</Text>
            {cartCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: -4,
                  right: -8,
                  minWidth: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: colors.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 3,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>{cartCount > 99 ? "99+" : cartCount}</Text>
              </View>
            )}
          </Pressable>
          <Pressable onPress={() => go("profile")}>
            <Text style={styles.webNavIcon}>◯</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
