import { Pressable, Text, View } from "react-native";
import { styles } from "../styles";
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
          <Pressable onPress={() => go("cart")}>
            <Text style={styles.webNavIcon}>🛒{cartCount > 0 ? ` ${cartCount}` : ""}</Text>
          </Pressable>
          <Pressable onPress={() => go("profile")}>
            <Text style={styles.webNavIcon}>◯</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
