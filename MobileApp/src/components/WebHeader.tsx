import Feather from "@expo/vector-icons/Feather";
import { Pressable, Text, View } from "react-native";
import { useApp } from "../context/AppContext";
import { colors, styles } from "../styles";
import type { Screen } from "../types";

export function WebHeader({
  go,
  cartCount,
  showNav = true,
}: {
  go?: (screen: Screen) => void;
  cartCount?: number;
  showNav?: boolean;
}) {
  const { go: ctxGo, cartCount: ctxCartCount } = useApp();
  const navigate = go ?? ctxGo;
  const count = cartCount ?? ctxCartCount;

  return (
    <View style={styles.webNav}>
      <Pressable style={styles.webBrand} onPress={() => navigate("home")}>
        <View style={styles.webBrandMark}>
          <Text style={styles.webBrandLetter}>E</Text>
        </View>
        <Text style={styles.webBrandText}>Ecommerce</Text>
      </Pressable>

      {showNav && (
        <View style={styles.webNavActions}>
          <Pressable onPress={() => navigate("search")}>
            <Feather name="search" size={20} color={colors.primary} />
          </Pressable>
          <Pressable onPress={() => navigate("cart")} style={{ position: "relative" }}>
            <Feather name="shopping-cart" size={20} color={colors.primary} />
            {count > 0 && (
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
                <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>{count > 99 ? "99+" : count}</Text>
              </View>
            )}
          </Pressable>
          <Pressable onPress={() => navigate("profile")}>
            <Feather name="user" size={20} color={colors.primary} />
          </Pressable>
          <Pressable onPress={() => navigate("categories")}>
            <Feather name="menu" size={20} color={colors.primary} />
          </Pressable>
        </View>
      )}
    </View>
  );
}
